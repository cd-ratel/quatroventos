import { NextRequest, NextResponse } from 'next/server';
import { handlers } from '@/lib/auth';
import { assertRateLimit } from '@/lib/rate-limit';
import { assertTrustedMutationRequest } from '@/lib/request-security';
import {
  getRequestHost,
  isAdminHost,
  isAllowedHost,
  isInternalHost,
} from '@/lib/site-host';

function notFoundResponse() {
  return new NextResponse(null, {
    status: 404,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function assertTrustedAuthHost(request: NextRequest) {
  const host = getRequestHost(request.headers);

  if (!host || !isAllowedHost(host)) {
    return notFoundResponse();
  }

  if (!isInternalHost(host) && !isAdminHost(host)) {
    return notFoundResponse();
  }

  return null;
}

function isCredentialsLoginAttempt(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  return (
    pathname.endsWith('/callback/credentials') ||
    pathname.endsWith('/signin/credentials')
  );
}

export async function GET(request: NextRequest) {
  const hostError = assertTrustedAuthHost(request);
  if (hostError) {
    return hostError;
  }

  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  const hostError = assertTrustedAuthHost(request);
  if (hostError) {
    return hostError;
  }

  const trustedRequestError = assertTrustedMutationRequest(request, 'admin');
  if (trustedRequestError) {
    return trustedRequestError;
  }

  if (isCredentialsLoginAttempt(request)) {
    const rateLimitError = assertRateLimit(request, {
      keyPrefix: 'auth-credentials',
      maxRequests: 8,
      windowMs: 10 * 60 * 1000,
      message: 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.',
    });
    if (rateLimitError) {
      return rateLimitError;
    }
  }

  return handlers.POST(request);
}
