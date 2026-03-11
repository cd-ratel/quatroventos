import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { Readable } from 'stream';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getMediaFilePath,
  getSafeDownloadName,
} from '@/lib/media-storage';

function buildContentDisposition(filename: string) {
  const safeName = getSafeDownloadName(filename);
  return `inline; filename*=UTF-8''${encodeURIComponent(safeName)}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const media = await prisma.media.findUnique({
    where: { id },
    select: {
      filename: true,
      originalName: true,
      mimeType: true,
      createdAt: true,
    },
  });

  if (!media) {
    return new NextResponse(null, { status: 404 });
  }

  const filePath = getMediaFilePath(media.filename);

  let fileStats;
  try {
    fileStats = await stat(filePath);
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  const rangeHeader = request.headers.get('range');
  const baseHeaders = new Headers({
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Disposition': buildContentDisposition(media.originalName),
    'Content-Type': media.mimeType,
    'Last-Modified': media.createdAt.toUTCString(),
    'X-Content-Type-Options': 'nosniff',
  });

  if (!rangeHeader) {
    baseHeaders.set('Content-Length', String(fileStats.size));

    return new NextResponse(
      Readable.toWeb(createReadStream(filePath)) as ReadableStream,
      {
        status: 200,
        headers: baseHeaders,
      }
    );
  }

  const [startValue, endValue] = rangeHeader.replace('bytes=', '').split('-');
  const start = Number.parseInt(startValue, 10);
  const end = endValue ? Number.parseInt(endValue, 10) : fileStats.size - 1;

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    start < 0 ||
    end >= fileStats.size ||
    start > end
  ) {
    return new NextResponse(null, {
      status: 416,
      headers: {
        'Content-Range': `bytes */${fileStats.size}`,
      },
    });
  }

  baseHeaders.set('Content-Length', String(end - start + 1));
  baseHeaders.set('Content-Range', `bytes ${start}-${end}/${fileStats.size}`);

  return new NextResponse(
    Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream,
    {
      status: 206,
      headers: baseHeaders,
    }
  );
}
