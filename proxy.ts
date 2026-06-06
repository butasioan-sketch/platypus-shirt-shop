import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ['/admin/:path*'],
};
