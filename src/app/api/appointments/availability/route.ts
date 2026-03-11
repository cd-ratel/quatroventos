import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  ACTIVE_APPOINTMENT_STATUSES,
  appointmentDateSchema,
  getAppointmentDateRange,
} from '@/lib/appointments';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
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
        new Set(appointments.map((appointment) => appointment.timeSlot))
      ),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Data inválida.' },
        { status: 400 }
      );
    }

    console.error('Availability lookup error:', error);
    return NextResponse.json(
      { error: 'Erro ao consultar a disponibilidade.' },
      { status: 500 }
    );
  }
}
