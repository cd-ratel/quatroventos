import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { auth } from '@/lib/auth';
import {
  ACTIVE_APPOINTMENT_STATUSES,
  appointmentDateSchema,
  appointmentStatusSchema,
  appointmentTimeSlotSchema,
  buildSlotKey,
  createAppointmentDate,
  getAppointmentDateRange,
  getDateStringFromDate,
  getSlotKeyForStatus,
  isActiveAppointmentStatus,
} from '@/lib/appointments';
import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { assertTrustedMutationRequest } from '@/lib/request-security';

const createSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido.'),
  phone: z.string().min(8, 'Telefone inválido.'),
  date: appointmentDateSchema,
  timeSlot: appointmentTimeSlotSchema,
  eventType: z.string().min(1, 'Tipo de evento obrigatório.'),
  guests: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => {
      if (value === undefined || value === null || value === '') {
        return null;
      }

      const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }),
  message: z.string().optional(),
});

const updateSchema = z.object({
  id: z.string().min(1, 'ID obrigatório.'),
  status: appointmentStatusSchema,
});

type AppointmentNotification = {
  name: string;
  email: string;
  phone: string;
  date: Date;
  timeSlot: string;
  eventType: string;
  guests: number | null;
  message: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function findSlotConflict({
  date,
  timeSlot,
  excludeId,
}: {
  date: string;
  timeSlot: string;
  excludeId?: string;
}) {
  const slotKey = buildSlotKey(date, timeSlot);
  const { start, end } = getAppointmentDateRange(date);

  return prisma.appointment.findFirst({
    where: {
      id: excludeId ? { not: excludeId } : undefined,
      status: {
        in: [...ACTIVE_APPOINTMENT_STATUSES],
      },
      OR: [
        { slotKey },
        {
          timeSlot,
          date: {
            gte: start,
            lte: end,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      date: true,
      timeSlot: true,
      status: true,
    },
  });
}

async function notifyAdminAboutAppointment(appointment: AppointmentNotification) {
  const settings = await prisma.settings.findUnique({
    where: { id: 'main' },
    select: {
      venueTitle: true,
      email: true,
    },
  });

  const recipient = settings?.email || process.env.ADMIN_EMAIL;

  if (!recipient) {
    console.warn('Appointment notification skipped because no admin email is configured.');
    return;
  }

  const formattedDate = appointment.date.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
  const safeMessage = escapeHtml(appointment.message || 'Não informada');
  const safeName = escapeHtml(appointment.name);
  const safeEmail = escapeHtml(appointment.email);
  const safePhone = escapeHtml(appointment.phone);
  const safeEventType = escapeHtml(appointment.eventType);

  await sendEmail({
    to: recipient,
    subject: `[${settings?.venueTitle || 'Quatro Ventos'}] Novo agendamento de visita`,
    text: [
      'Novo agendamento recebido.',
      '',
      `Nome: ${appointment.name}`,
      `Email: ${appointment.email}`,
      `Telefone: ${appointment.phone}`,
      `Data: ${formattedDate}`,
      `Horário: ${appointment.timeSlot}`,
      `Tipo de evento: ${appointment.eventType}`,
      `Convidados: ${appointment.guests ?? 'Não informado'}`,
      `Mensagem: ${appointment.message || 'Não informada'}`,
    ].join('\n'),
    html: `
      <h2>Novo agendamento recebido</h2>
      <p><strong>Nome:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Telefone:</strong> ${safePhone}</p>
      <p><strong>Data:</strong> ${formattedDate}</p>
      <p><strong>Horário:</strong> ${appointment.timeSlot}</p>
      <p><strong>Tipo de evento:</strong> ${safeEventType}</p>
      <p><strong>Convidados:</strong> ${appointment.guests ?? 'Não informado'}</p>
      <p><strong>Mensagem:</strong> ${safeMessage}</p>
    `,
  });
}

async function notifyClientAboutStatusChange(
  appointment: AppointmentNotification,
  status: string
) {
  if (status !== 'confirmed' && status !== 'cancelled') {
    return;
  }

  const settings = await prisma.settings.findUnique({
    where: { id: 'main' },
    select: { venueTitle: true, phone: true, email: true, address: true },
  });

  const venueName = settings?.venueTitle || 'Quatro Ventos';
  const safeName = escapeHtml(appointment.name);
  const formattedDate = appointment.date.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });

  const isConfirmed = status === 'confirmed';
  const statusLabel = isConfirmed ? 'Confirmada' : 'Cancelada';
  const statusColor = isConfirmed ? '#4ade80' : '#f87171';
  const statusPrefix = isConfirmed ? 'Confirmação' : 'Cancelamento';

  const subject = isConfirmed
    ? `[${statusPrefix}] Sua visita ao ${venueName} foi confirmada!`
    : `[${statusPrefix}] Sua visita ao ${venueName} foi cancelada`;

  const message = isConfirmed
    ? `Temos o prazer de informar que sua visita ao ${venueName} foi confirmada! Estamos ansiosos para recebê-lo(a).`
    : `Infelizmente, sua visita ao ${venueName} foi cancelada. Se desejar reagendar, entre em contato conosco.`;

  const contactInfo = [
    settings?.phone ? `Telefone: ${settings.phone}` : null,
    settings?.email ? `E-mail: ${settings.email}` : null,
    settings?.address ? `Endereço: ${settings.address}` : null,
  ].filter(Boolean).join(' | ');

  await sendEmail({
    to: appointment.email,
    subject,
    text: [
      `Olá, ${appointment.name}!`,
      '',
      message,
      '',
      `Detalhes da visita:`,
      `Status: ${statusLabel}`,
      `Data: ${formattedDate}`,
      `Horário: ${appointment.timeSlot}`,
      `Tipo de evento: ${appointment.eventType}`,
      '',
      contactInfo,
      '',
      `Atenciosamente,`,
      `Equipe ${venueName}`,
    ].join('\n'),
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #faf8f5; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0c1425, #162340); padding: 32px; text-align: center; border-bottom: 2px solid rgba(201, 169, 110, 0.2);">
          <h1 style="font-size: 24px; margin: 0; color: #c9a96e;">${venueName}</h1>
          <p style="margin: 8px 0 0; color: rgba(250, 248, 245, 0.5); font-size: 14px;">Espaço para Eventos</p>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; margin: 0 0 16px;">Olá, <strong>${safeName}</strong>!</p>
          <p style="font-size: 15px; color: rgba(250, 248, 245, 0.8); margin: 0 0 24px;">${message}</p>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(201, 169, 110, 0.15); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
              <span style="background: ${statusColor}22; color: ${statusColor}; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em;">${statusLabel}</span>
            </div>
            <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #c9a96e;">Data:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #c9a96e;">Horário:</strong> ${appointment.timeSlot}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #c9a96e;">Evento:</strong> ${escapeHtml(appointment.eventType)}</p>
            ${appointment.guests ? `<p style="margin: 8px 0; font-size: 14px;"><strong style="color: #c9a96e;">Convidados:</strong> ${appointment.guests}</p>` : ''}
          </div>
          ${contactInfo ? `<p style="font-size: 13px; color: rgba(250, 248, 245, 0.4); text-align: center;">${contactInfo}</p>` : ''}
        </div>
        <div style="background: rgba(201, 169, 110, 0.05); padding: 16px 32px; text-align: center; border-top: 1px solid rgba(201, 169, 110, 0.1);">
          <p style="margin: 0; font-size: 12px; color: rgba(250, 248, 245, 0.3);">Equipe ${venueName}</p>
        </div>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const conflict = await findSlotConflict({
      date: data.date,
      timeSlot: data.timeSlot,
    });

    if (conflict) {
      return NextResponse.json(
        { error: 'Este horário já está reservado para outra visita.' },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: createAppointmentDate(data.date),
        timeSlot: data.timeSlot,
        slotKey: buildSlotKey(data.date, data.timeSlot),
        eventType: data.eventType,
        guests: data.guests,
        message: data.message || null,
      },
    });

    await notifyAdminAboutAppointment(appointment);

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      );
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Este horário já está reservado para outra visita.' },
        { status: 409 }
      );
    }

    console.error('Appointment creation error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const limit = Number.parseInt(searchParams.get('limit') || '20', 10);

  const where = status ? { status } : {};

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ]);

  return NextResponse.json({ appointments, total, page, limit });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const trustedRequestError = assertTrustedMutationRequest(req, 'admin');
  if (trustedRequestError) {
    return trustedRequestError;
  }

  try {
    const { id, status } = updateSchema.parse(await req.json());

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado.' },
        { status: 404 }
      );
    }

    const appointmentDate = getDateStringFromDate(appointment.date);

    if (isActiveAppointmentStatus(status)) {
      const conflict = await findSlotConflict({
        date: appointmentDate,
        timeSlot: appointment.timeSlot,
        excludeId: appointment.id,
      });

      if (conflict) {
        return NextResponse.json(
          { error: 'Este horário já foi ocupado por outro agendamento ativo.' },
          { status: 409 }
        );
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        slotKey: getSlotKeyForStatus(
          appointmentDate,
          appointment.timeSlot,
          status
        ),
      },
    });

    // Notify the client about their appointment status change
    await notifyClientAboutStatusChange(updatedAppointment, status);

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      );
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Este horário já foi ocupado por outro agendamento ativo.' },
        { status: 409 }
      );
    }

    console.error('Appointment update error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar o agendamento.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const trustedRequestError = assertTrustedMutationRequest(req, 'admin');
  if (trustedRequestError) {
    return trustedRequestError;
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID obrigatório.' }, { status: 400 });
  }

  await prisma.appointment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
