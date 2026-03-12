import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { normalizeSiteSettings, siteSettingsSchema } from '@/lib/site-settings';
import { getServerSiteSettings } from '@/lib/server-site-settings';
import { assertRateLimit } from '@/lib/rate-limit';
import {
  assertTrustedMutationRequest,
  RequestBodyError,
  readJsonBodyWithLimit,
} from '@/lib/request-security';
import { prisma } from '@/lib/prisma';

const SETTINGS_BODY_LIMIT_BYTES = 256 * 1024;

export async function GET() {
  const settings = await getServerSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'N\u00E3o autorizado.' }, { status: 401 });
  }

  const trustedRequestError = assertTrustedMutationRequest(req, 'admin');
  if (trustedRequestError) {
    return trustedRequestError;
  }

  const rateLimitError = assertRateLimit(req, {
    keyPrefix: 'admin-settings-write',
    maxRequests: 30,
    windowMs: 10 * 60 * 1000,
    message: 'Muitas altera\u00E7\u00F5es de configura\u00E7\u00E3o em pouco tempo. Aguarde alguns instantes.',
  });
  if (rateLimitError) {
    return rateLimitError;
  }

  try {
    const body = z
      .record(z.unknown())
      .parse(await readJsonBodyWithLimit<unknown>(req, SETTINGS_BODY_LIMIT_BYTES));
    const currentSettings = await getServerSiteSettings();
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
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Dados inv\u00E1lidos.' },
        { status: 400 }
      );
    }

    console.error('Settings update error:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json(
      { error: 'Erro ao atualizar as configura\u00E7\u00F5es.' },
      { status: 500 }
    );
  }
}
