import { mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

type MediaDescriptor = {
  extension: string;
  mimeType: string;
  kind: 'image' | 'video';
};

export class MediaValidationError extends Error {}

const MEDIA_ROOT = process.env.MEDIA_ROOT || path.join(process.cwd(), 'storage', 'media');

const mediaSignatures: MediaDescriptor[] = [
  { extension: '.jpg', mimeType: 'image/jpeg', kind: 'image' },
  { extension: '.png', mimeType: 'image/png', kind: 'image' },
  { extension: '.webp', mimeType: 'image/webp', kind: 'image' },
  { extension: '.avif', mimeType: 'image/avif', kind: 'image' },
  { extension: '.mp4', mimeType: 'video/mp4', kind: 'video' },
  { extension: '.webm', mimeType: 'video/webm', kind: 'video' },
];

const allowedMimeTypes = new Map(mediaSignatures.map((item) => [item.mimeType, item]));

export function getMediaRoot() {
  return MEDIA_ROOT;
}

export async function ensureMediaDir() {
  await mkdir(MEDIA_ROOT, { recursive: true });
}

export function getMediaFilePath(filename: string) {
  return path.join(MEDIA_ROOT, filename);
}

export function getPublicMediaPath(id: string) {
  return `/media/${id}`;
}

export function getStoredMediaFilename(extension: string) {
  return `${randomUUID()}${extension}`;
}

export function getSafeDownloadName(filename: string) {
  return filename.replace(/[^\p{L}\p{N}._ -]/gu, '').trim() || 'arquivo';
}

function hasSignature(buffer: Buffer, signature: number[]) {
  return signature.every((byte, index) => buffer[index] === byte);
}

function isJpeg(buffer: Buffer) {
  return hasSignature(buffer, [0xff, 0xd8, 0xff]);
}

function isPng(buffer: Buffer) {
  return hasSignature(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
}

function isWebp(buffer: Buffer) {
  return (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  );
}

function isAvif(buffer: Buffer) {
  const brand = buffer.subarray(4, 12).toString('ascii');
  return brand.startsWith('ftyp') && /avif|avis/.test(brand.slice(4));
}

function isMp4(buffer: Buffer) {
  const brand = buffer.subarray(4, 12).toString('ascii');
  return brand.startsWith('ftyp');
}

function isWebm(buffer: Buffer) {
  return hasSignature(buffer, [0x1a, 0x45, 0xdf, 0xa3]);
}

function detectBySignature(buffer: Buffer) {
  if (isJpeg(buffer)) {
    return allowedMimeTypes.get('image/jpeg') || null;
  }

  if (isPng(buffer)) {
    return allowedMimeTypes.get('image/png') || null;
  }

  if (isWebp(buffer)) {
    return allowedMimeTypes.get('image/webp') || null;
  }

  if (isAvif(buffer)) {
    return allowedMimeTypes.get('image/avif') || null;
  }

  if (isWebm(buffer)) {
    return allowedMimeTypes.get('video/webm') || null;
  }

  if (isMp4(buffer)) {
    return allowedMimeTypes.get('video/mp4') || null;
  }

  return null;
}

export function validateUploadedFile(file: File, buffer: Buffer) {
  const fileExtension = path.extname(file.name).toLowerCase();
  const descriptor = detectBySignature(buffer);
  const declared = allowedMimeTypes.get(file.type);

  if (!descriptor || !declared) {
    throw new MediaValidationError('Formato de arquivo não permitido.');
  }

  if (descriptor.mimeType !== declared.mimeType) {
    throw new MediaValidationError(
      'O tipo de arquivo enviado não corresponde ao conteúdo real.'
    );
  }

  if (fileExtension && !descriptor.extension.split(',').includes(fileExtension)) {
    const allowedExtensions = descriptor.extension === '.jpg' ? ['.jpg', '.jpeg'] : [descriptor.extension];
    if (!allowedExtensions.includes(fileExtension)) {
      throw new MediaValidationError(
        'A extensão do arquivo não é permitida para este formato.'
      );
    }
  }

  if (file.size > 50 * 1024 * 1024) {
    throw new MediaValidationError('Cada arquivo pode ter no máximo 50 MB.');
  }

  return descriptor;
}
