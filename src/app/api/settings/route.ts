import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET — Public settings
export async function GET() {
  let settings = await prisma.settings.findUnique({ where: { id: 'main' } });

  if (!settings) {
    settings = await prisma.settings.create({
      data: { id: 'main' },
    });
  }

  return NextResponse.json(settings);
}

// PUT — Update settings (admin only)
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const settings = await prisma.settings.upsert({
      where: { id: 'main' },
      update: body,
      create: { id: 'main', ...body },
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}
