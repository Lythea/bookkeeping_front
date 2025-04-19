import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get('authToken');
  const path = req.nextUrl.pathname;

  // If authToken exists and user is on "/" or "/auth", redirect to dashboard
  if (authToken && (path === '/' || path === '/auth')) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  // Redirect to /auth if accessing `/` without authToken
  if (path === '/' && !authToken) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  // If accessing /admin or any sub-routes
  if (path.startsWith('/admin')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    // If authenticated and visiting /admin exactly, redirect to dashboard
    if (path === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth', '/admin/:path*'], // Watch for "/", "/auth", and all admin routes
};
