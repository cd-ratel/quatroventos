import { z } from 'zod';

export const ACTIVE_APPOINTMENT_STATUSES = ['pending', 'confirmed'] as const;
export const APPOINTMENT_STATUSES = [...ACTIVE_APPOINTMENT_STATUSES, 'cancelled'] as const;

export const appointmentDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.');

export const appointmentTimeSlotSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Horário inválido.');

export const appointmentStatusSchema = z.enum(APPOINTMENT_STATUSES);

export function buildSlotKey(date: string, timeSlot: string) {
  return `${date}::${timeSlot}`;
}

export function createAppointmentDate(date: string) {
  return new Date(`${date}T12:00:00.000Z`);
}

export function getAppointmentDateRange(date: string) {
  return {
    start: new Date(`${date}T00:00:00.000Z`),
    end: new Date(`${date}T23:59:59.999Z`),
  };
}

export function getDateStringFromDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function isActiveAppointmentStatus(status: string) {
  return ACTIVE_APPOINTMENT_STATUSES.includes(
    status as (typeof ACTIVE_APPOINTMENT_STATUSES)[number]
  );
}

export function getSlotKeyForStatus(
  date: string,
  timeSlot: string,
  status: string
) {
  return isActiveAppointmentStatus(status) ? buildSlotKey(date, timeSlot) : null;
}
