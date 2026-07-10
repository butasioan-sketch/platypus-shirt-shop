import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/api/orders') {
    // POST: nur mit Internal-Key (Stripe-Webhook) — Env fehlt => offen lassen
    if (request.method === 'POST') {
      const internalKey = process.env.INTERNAL_API_KEY;
      if (!internalKey || request.headers.get('x-internal-key') === internalKey) {
        return NextResponse.next();
      }
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // GET mit ?id= : oeffentlich (Tracking, Route liefert reduzierte Daten)
    if (request.method === 'GET' && request.nextUrl.searchParams.get('id')) {
      return NextResponse.next();
    }
    // GET-Liste/Stats + PATCH: nur Admin (Basic-Auth wie /admin)
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return NextResponse.next();
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Basic ')) {
      const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
      const [, password] = credentials.split(':');
      if (password === adminPassword) return NextResponse.next();
    }
    return new NextResponse('Admin Login erforderlich', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="PLATYPUS Admin"' },
    });
  }

  if (pathname.startsWith('/admin')) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.next();
    }

    const authHeader = request.headers.get('authorization');

    if (authHeader?.startsWith('Basic ')) {
      const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
      const [, password] = credentials.split(':');
      if (password === adminPassword) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Admin Login erforderlich', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="PLATYPUS Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/orders'],
};
