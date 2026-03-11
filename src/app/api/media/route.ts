import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { unlink, writeFile } from 'fs/promises';
import {
  ensureMediaDir,
  getMediaFilePath,
  getPublicMediaPath,
  getStoredMediaFilename,
  MediaValidationError,
  validateUploadedFile,
} from '@/lib/media-storage';
import { assertTrustedMutationRequest } from '@/lib/request-security';

function toClientMedia<T extends { id: string }>(media: T) {
  return {
    ...media,
    url: getPublicMediaPath(media.id),
  };
}

// GET — List media (public)
export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(media.map(toClientMedia));
}

// POST — Upload media (admin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const trustedRequestError = assertTrustedMutationRequest(req, 'admin');
  if (trustedRequestError) {
    return trustedRequestError;
  }

  try {
    await ensureMediaDir();

    const formData = await req.formData();
    const files = formData.getAll('files').filter((item): item is File => item instanceof File);
    const category = (formData.get('category') as string) || 'gallery';
    const caption = (formData.get('caption') as string) || null;

    if (!files.length) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const preparedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const descriptor = validateUploadedFile(file, buffer);

        return {
          file,
          buffer,
          descriptor,
        };
      })
    );

    const results = [];

    for (const { file, buffer, descriptor } of preparedFiles) {
      const filename = getStoredMediaFilename(descriptor.extension);
      const filepath = getMediaFilePath(filename);

      await writeFile(filepath, buffer);

      const media = await prisma.media.create({
        data: {
          filename,
          originalName: file.name,
          mimeType: descriptor.mimeType,
          size: file.size,
          category,
          caption,
        },
      });

      results.push(toClientMedia(media));
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    if (error instanceof MediaValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erro no upload.' }, { status: 500 });
  }
}

// DELETE — Delete media (admin only)
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const trustedRequestError = assertTrustedMutationRequest(req, 'admin');
  if (trustedRequestError) {
    return trustedRequestError;
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

    const filepath = getMediaFilePath(media.filename);
    try {
      await unlink(filepath);
    } catch {
      // The record should still be removed even if the file is already gone.
    }

    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao excluir a mídia.' }, { status: 500 });
  }
}
