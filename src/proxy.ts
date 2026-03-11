import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getRequestHost,
  isAdminHost,
  isAllowedHost,
  isInternalHost,
  isPublicHost,
} from '@/lib/site-host';

function notFoundResponse() {
  return new NextResponse(null, {
    status: 404,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = getRequestHost(request.headers);
  const isStaticAsset =
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.webmanifest' ||
    pathname.startsWith('/apple-icon') ||
    pathname.startsWith('/icon');

  if (!host) {
    return NextResponse.next();
  }

  if (!isAllowedHost(host)) {
    return notFoundResponse();
  }

  if (isInternalHost(host)) {
    return NextResponse.next();
  }

  if (isAdminHost(host)) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (
      !isStaticAsset &&
      !pathname.startsWith('/admin') &&
      !pathname.startsWith('/api/') &&
      !pathname.startsWith('/media/')
    ) {
      return notFoundResponse();
    }

    return NextResponse.next();
  }

  if (isPublicHost(host)) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/auth')) {
      return notFoundResponse();
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
