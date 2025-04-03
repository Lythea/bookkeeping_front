import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin'],
};