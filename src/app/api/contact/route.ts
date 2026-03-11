import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // For now, log the contact. SMTP integration can be added later.
    console.log('📩 New contact form submission:', data);

    // TODO: Send email notification when SMTP is configured
    // await sendEmail({
    //   to: process.env.SMTP_FROM,
    //   subject: `[Quatro Ventos] ${data.subject}`,
    //   body: `Nome: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}
