import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type HeaderBag = {
  get(name: string): string | null;
};

type RateLimitConfig = {
  keyPrefix: string;
  maxRequests: number;
  windowMs: number;
  message: string;
};

type Bucket = {
  count: number;
  resetAt: number;
};

declare global {
  var __quatroVentosRateLimitStore: Map<string, Bucket> | undefined;
}

const rateLimitStore =
  globalThis.__quatroVentosRateLimitStore ||
  new Map<string, Bucket>();

if (!globalThis.__quatroVentosRateLimitStore) {
  globalThis.__quatroVentosRateLimitStore = rateLimitStore;
}

function normalizeIp(value?: string | null) {
  return value?.split(',')[0]?.trim() || '';
}

function getRequestIp(headers: HeaderBag) {
  return (
    normalizeIp(headers.get('cf-connecting-ip')) ||
    normalizeIp(headers.get('x-real-ip')) ||
    normalizeIp(headers.get('x-forwarded-for')) ||
    'unknown'
  );
}

function pruneExpiredBuckets(now: number) {
  if (rateLimitStore.size < 1024) {
    return;
  }

  for (const [key, bucket] of rateLimitStore.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

export function assertRateLimit(
  request: NextRequest,
  config: RateLimitConfig
) {
  const now = Date.now();
  pruneExpiredBuckets(now);

  const ip = getRequestIp(request.headers);
  const key = `${config.keyPrefix}:${ip}`;
  const currentBucket = rateLimitStore.get(key);

  if (!currentBucket || currentBucket.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return null;
  }

  if (currentBucket.count >= config.maxRequests) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((currentBucket.resetAt - now) / 1000)
    );

    return NextResponse.json(
      { error: config.message },
      {
        status: 429,
        headers: {
          'Cache-Control': 'no-store',
          'Retry-After': String(retryAfterSeconds),
        },
      }
    );
  }

  currentBucket.count += 1;
  rateLimitStore.set(key, currentBucket);

  return null;
}
