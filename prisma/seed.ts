import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import {
  ACTIVE_APPOINTMENT_STATUSES,
  buildSlotKey,
  getDateStringFromDate,
} from '../src/lib/appointments';
import {
  createDefaultSiteSettings,
  normalizeSiteSettings,
} from '../src/lib/site-settings';

const prisma = new PrismaClient();

const PLACEHOLDER_PATTERNS = [
  'CHANGE_ME',
  'GENERATE_WITH_OPENSSL',
  'EXAMPLE',
  'PLACEHOLDER',
];

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Environment variable ${name} is required for seed execution.`);
  }

  if (PLACEHOLDER_PATTERNS.some((pattern) => value.toUpperCase().includes(pattern))) {
    throw new Error(`Environment variable ${name} still contains a placeholder value.`);
  }

  return value;
}

function assertStrongAdminPassword(password: string) {
  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must contain at least 12 characters.');
  }

  const requirements = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/];
  if (!requirements.every((pattern) => pattern.test(password))) {
    throw new Error(
      'ADMIN_PASSWORD must include uppercase, lowercase, numeric, and symbol characters.'
    );
  }
}

async function main() {
  const adminEmail = requireEnv('ADMIN_EMAIL').toLowerCase();
  const adminPassword = requireEnv('ADMIN_PASSWORD');
  const adminName = process.env.ADMIN_NAME?.trim() || 'Administrador';

  assertStrongAdminPassword(adminPassword);

  const hashedPassword = await hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password: hashedPassword,
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
    },
  });

  const existingSettings = await prisma.settings.findUnique({
    where: { id: 'main' },
  });

  const defaults = createDefaultSiteSettings();
  const normalizedSettings = normalizeSiteSettings(
    existingSettings
      ? (existingSettings as unknown as Record<string, unknown>)
      : (defaults as unknown as Record<string, unknown>)
  );

  await prisma.settings.upsert({
    where: { id: 'main' },
    update: normalizedSettings,
    create: {
      id: 'main',
      ...normalizedSettings,
    },
  });

  const appointments = await prisma.appointment.findMany({
    where: {
      status: {
        in: [...ACTIVE_APPOINTMENT_STATUSES],
      },
      slotKey: null,
    },
    orderBy: { createdAt: 'asc' },
  });

  for (const appointment of appointments) {
    const slotKey = buildSlotKey(
      getDateStringFromDate(appointment.date),
      appointment.timeSlot
    );

    const conflict = await prisma.appointment.findFirst({
      where: {
        id: { not: appointment.id },
        slotKey,
      },
      select: { id: true },
    });

    if (conflict) {
      console.warn(
        `Skipping slotKey backfill for appointment ${appointment.id} because ${conflict.id} already blocks ${slotKey}.`
      );
      continue;
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { slotKey },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
