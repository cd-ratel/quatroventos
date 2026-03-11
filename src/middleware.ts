import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_HOST = process.env.ADMIN_URL
  ? new URL(process.env.ADMIN_URL).host
  : 'adminquatroventos.redecm.com.br';

const PUBLIC_HOST = process.env.APP_URL
  ? new URL(process.env.APP_URL).host
  : 'quatroventos.redecm.com.br';

// Public pages that only exist on the public domain
const PUBLIC_ROUTES = ['/', '/espacos', '/galeria', '/agendar', '/contato'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host')?.split(':')[0] || '';

  // ===== ADMIN DOMAIN =====
  if (host === ADMIN_HOST) {
    // On admin domain: only /admin/* and /api/* are allowed
    // Redirect root to /admin
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Block public pages on admin domain
    if (PUBLIC_ROUTES.includes(pathname)) {
      return new NextResponse(null, { status: 404 });
    }

    // Protect admin routes (except login) — require authentication
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const session = await auth();
      if (!session) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  }

  // ===== PUBLIC DOMAIN =====
  if (host === PUBLIC_HOST) {
    // On public domain: /admin/* does not exist
    if (pathname.startsWith('/admin')) {
      return new NextResponse(null, { status: 404 });
    }

    // Block auth API on public domain
    if (pathname.startsWith('/api/auth')) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.next();
  }

  // ===== UNKNOWN HOST (localhost / dev) =====
  // Allow everything in dev mode
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = await auth();
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads/).*)'],
};
