import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getRequestHost,
  isAdminHost,
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

  if (!host) {
    return NextResponse.next();
  }

  if (isAdminHost(host)) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/')) {
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads/).*)'],
};
