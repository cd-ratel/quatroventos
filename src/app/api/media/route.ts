import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// GET — List media (public)
export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(media);
}

// POST — Upload media (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    await ensureUploadDir();

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const category = formData.get('category') as string || 'gallery';
    const caption = formData.get('caption') as string || null;

    if (!files.length) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        continue;
      }

      // Validate size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || '.jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      await writeFile(filepath, buffer);

      const media = await prisma.media.create({
        data: {
          filename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          category,
          caption,
        },
      });

      results.push(media);
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 });
  }
}

// DELETE — Delete media (admin only)
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });
  }

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: 'Mídia não encontrada' }, { status: 404 });
    }

    // Delete file from disk
    const filepath = path.join(UPLOAD_DIR, media.filename);
    try {
      await unlink(filepath);
    } catch {
      // File may not exist, continue
    }

    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  }
}
