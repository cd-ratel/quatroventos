import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { assertRateLimit } from '@/lib/rate-limit';
import {
  assertTrustedMutationRequest,
  RequestBodyError,
  readJsonBodyWithLimit,
} from '@/lib/request-security';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(120),
  message: z.string().trim().min(10).max(3000),
});

const CONTACT_BODY_LIMIT_BYTES = 16 * 1024;

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function POST(req: NextRequest) {
  const trustedRequestError = assertTrustedMutationRequest(req, 'public');
  if (trustedRequestError) {
    return trustedRequestError;
  }

  const rateLimitError = assertRateLimit(req, {
    keyPrefix: 'public-contact',
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    message: 'Muitas mensagens enviadas em pouco tempo. Aguarde alguns minutos e tente novamente.',
  });
  if (rateLimitError) {
    return rateLimitError;
  }

  try {
    const body = await readJsonBodyWithLimit<unknown>(req, CONTACT_BODY_LIMIT_BYTES);
    const data = contactSchema.parse(body);

    const settings = await prisma.settings.findUnique({
      where: { id: 'main' },
      select: { venueTitle: true, email: true },
    });

    const recipient = settings?.email || process.env.ADMIN_EMAIL;
    const venueName = settings?.venueTitle || 'Quatro Ventos';

    if (recipient) {
      const safeName = escapeHtml(data.name);
      const safeEmail = escapeHtml(data.email);
      const safeSubject = escapeHtml(data.subject);
      const safeMessage = escapeHtml(data.message);

      await sendEmail({
        to: recipient,
        subject: `[${venueName}] Contato: ${data.subject}`,
        text: [
          'Nova mensagem de contato recebida.',
          '',
          `Nome: ${data.name}`,
          `Email: ${data.email}`,
          `Assunto: ${data.subject}`,
          `Mensagem: ${data.message}`,
        ].join('\n'),
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #080e1e; color: #faf8f5; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #0a1120, #121f3d); padding: 32px; text-align: center; border-bottom: 2px solid rgba(212, 168, 83, 0.2);">
              <h1 style="font-size: 24px; margin: 0; color: #d4a853;">${venueName}</h1>
              <p style="margin: 8px 0 0; color: rgba(250, 248, 245, 0.5); font-size: 14px;">Nova mensagem de contato</p>
            </div>
            <div style="padding: 32px;">
              <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(212, 168, 83, 0.15); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #d4a853;">Nome:</strong> ${safeName}</p>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #d4a853;">Email:</strong> ${safeEmail}</p>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #d4a853;">Assunto:</strong> ${safeSubject}</p>
              </div>
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 20px;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #d4a853; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Mensagem</p>
                <p style="margin: 0; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</p>
              </div>
            </div>
            <div style="background: rgba(212, 168, 83, 0.05); padding: 16px 32px; text-align: center; border-top: 1px solid rgba(212, 168, 83, 0.1);">
              <p style="margin: 0; font-size: 12px; color: rgba(250, 248, 245, 0.3);">Equipe ${venueName}</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.' },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json(
      { error: 'Erro interno.' },
      { status: 500 }
    );
  }
}
