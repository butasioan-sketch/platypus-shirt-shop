import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return new NextResponse('ADMIN_PASSWORD not set', { status: 500 });
    }
    if (authHeader?.startsWith('Basic ')) {
      const base64 = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64, 'base64').toString('utf-8');
      const [, password] = credentials.split(':');
      if (password === adminPassword) {
        return NextResponse.next();
      }
    }
    return new NextResponse('Admin Login required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="PLATYPUS Admin"' },
    });
  }
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*'] };
