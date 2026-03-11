import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import {
  createDefaultSiteSettings,
  normalizeSiteSettings,
  siteSettingsSchema,
} from '@/lib/site-settings';
import { assertTrustedMutationRequest } from '@/lib/request-security';
import { z } from 'zod';

async function getOrCreateSettings() {
  const existingSettings = await prisma.settings.findUnique({
    where: { id: 'main' },
  });

  if (existingSettings) {
    return normalizeSiteSettings(existingSettings as unknown as Record<string, unknown>);
  }

  const defaults = createDefaultSiteSettings();

  await prisma.settings.create({
    data: {
      id: 'main',
      ...defaults,
    },
  });

  return defaults;
}

export async function GET() {
  const settings = await getOrCreateSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const trustedRequestError = assertTrustedMutationRequest(req, 'admin');
  if (trustedRequestError) {
    return trustedRequestError;
  }

  try {
    const body = await req.json();
    const currentSettings = await getOrCreateSettings();
    const payload = siteSettingsSchema.parse({
      ...currentSettings,
      ...body,
    });

    const settings = await prisma.settings.upsert({
      where: { id: 'main' },
      update: payload,
      create: {
        id: 'main',
        ...payload,
      },
    });

    return NextResponse.json(
      normalizeSiteSettings(settings as unknown as Record<string, unknown>)
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inválidos.' },
        { status: 400 }
      );
    }

    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar as configurações.' }, { status: 500 });
  }
}
