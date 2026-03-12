import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  ACTIVE_APPOINTMENT_STATUSES,
  appointmentDateSchema,
  getAppointmentDateRange,
} from '@/lib/appointments';
import { prisma } from '@/lib/prisma';
import { assertRateLimit } from '@/lib/rate-limit';

const AVAILABILITY_WINDOW_MS = 5 * 60 * 1000;

type AvailabilityAppointment = {
  timeSlot: string;
};

export async function GET(req: NextRequest) {
  const rateLimitError = assertRateLimit(req, {
    keyPrefix: 'public-appointment-availability',
    maxRequests: 90,
    windowMs: AVAILABILITY_WINDOW_MS,
    message: 'Muitas consultas de disponibilidade em pouco tempo. Aguarde alguns instantes.',
  });
  if (rateLimitError) {
    return rateLimitError;
  }

  try {
    const { searchParams } = new URL(req.url);
    const date = appointmentDateSchema.parse(searchParams.get('date'));
    const { start, end } = getAppointmentDateRange(date);

    const appointments = await prisma.appointment.findMany({
      where: {
        status: {
          in: [...ACTIVE_APPOINTMENT_STATUSES],
        },
        OR: [
          {
            slotKey: {
              startsWith: `${date}::`,
            },
          },
          {
            date: {
              gte: start,
              lte: end,
            },
          },
        ],
      },
      select: {
        timeSlot: true,
      },
    });

    return NextResponse.json({
      date,
      unavailableSlots: Array.from(
        new Set(
          appointments.map(
            (appointment: AvailabilityAppointment) => appointment.timeSlot
          )
        )
      ),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Data inválida.' },
        { status: 400 }
      );
    }

    console.error('Availability lookup error:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json(
      { error: 'Erro ao consultar a disponibilidade.' },
      { status: 500 }
    );
  }
}
