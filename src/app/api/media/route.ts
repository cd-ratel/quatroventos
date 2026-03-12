import { NextRequest, NextResponse } from 'next/server';
import { unlink, writeFile } from 'fs/promises';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import {
  ensureMediaDir,
  getMediaFilePath,
  getPublicMediaPath,
  getStoredMediaFilename,
  MediaValidationError,
  validateUploadedFile,
} from '@/lib/media-storage';
import { prisma } from '@/lib/prisma';
import { assertRateLimit } from '@/lib/rate-limit';
import { assertTrustedMutationRequest } from '@/lib/request-security';

const mediaCategorySchema = z.enum([
  'gallery',
  'venue',
  'wedding',
  'children',
  'corporate',
  'decoration',
]);

const mediaCaptionSchema = z
  .string()
  .trim()
  .max(180, 'Legenda muito longa.')
  .optional()
  .transform((value) => value || null);

const MAX_UPLOAD_FILES_PER_REQUEST = 10;
const MAX_UPLOAD_REQUEST_BYTES = 52 * 1024 * 1024;

function toClientMedia<T extends { id: string }>(media: T) {
  return {
    ...media,
    url: getPublicMediaPath(media.id),
  };
}

export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(media.map(toClientMedia));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const trustedRequestError = assertTrustedMutationRequest(req, 'admin');
  if (trustedRequestError) {
    return trustedRequestError;
  }

  const rateLimitError = assertRateLimit(req, {
    keyPrefix: 'admin-media-upload',
    maxRequests: 20,
    windowMs: 10 * 60 * 1000,
    message: 'Muitos uploads em pouco tempo. Aguarde alguns minutos e tente novamente.',
  });
  if (rateLimitError) {
    return rateLimitError;
  }

  const contentLength = Number.parseInt(req.headers.get('content-length') || '0', 10);
  if (!Number.isNaN(contentLength) && contentLength > MAX_UPLOAD_REQUEST_BYTES) {
    return NextResponse.json(
      { error: 'Payload muito grande.' },
      { status: 413 }
    );
  }

  try {
    await ensureMediaDir();

    const formData = await req.formData();
    const files = formData.getAll('files').filter((item): item is File => item instanceof File);

    if (!files.length) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    if (files.length > MAX_UPLOAD_FILES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Envie no máximo ${MAX_UPLOAD_FILES_PER_REQUEST} arquivos por vez.` },
        { status: 400 }
      );
    }

    const categoryResult = mediaCategorySchema.safeParse(formData.get('category') || 'gallery');
    if (!categoryResult.success) {
      return NextResponse.json({ error: 'Categoria de mídia inválida.' }, { status: 400 });
    }

    const captionResult = mediaCaptionSchema.safeParse(formData.get('caption') || undefined);
    if (!captionResult.success) {
      return NextResponse.json(
        { error: captionResult.error.errors[0]?.message || 'Legenda inválida.' },
        { status: 400 }
      );
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

      await writeFile(filepath, buffer, { flag: 'wx' });

      const media = await prisma.media.create({
        data: {
          filename,
          originalName: file.name,
          mimeType: descriptor.mimeType,
          size: file.size,
          category: categoryResult.data,
          caption: captionResult.data,
        },
      });

      results.push(toClientMedia(media));
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    if (error instanceof MediaValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Upload error:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Erro no upload.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const trustedRequestError = assertTrustedMutationRequest(req, 'admin');
  if (trustedRequestError) {
    return trustedRequestError;
  }

  const rateLimitError = assertRateLimit(req, {
    keyPrefix: 'admin-media-delete',
    maxRequests: 40,
    windowMs: 10 * 60 * 1000,
    message: 'Muitas exclusões de mídia em pouco tempo. Aguarde alguns instantes.',
  });
  if (rateLimitError) {
    return rateLimitError;
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID obrigatório.' }, { status: 400 });
  }

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: 'Mídia não encontrada.' }, { status: 404 });
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
