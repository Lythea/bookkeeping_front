import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Access cookies directly from the request object
  const authToken = req.cookies.get('authToken'); // Retrieve authToken from cookies

  // Check if the user is trying to access the /admin page
  if (req.nextUrl.pathname === '/admin') {
    // If the user is authenticated, redirect to /admin/dashboard
    if (authToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    } else {
      // If no authToken is present, redirect to login page
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // If the user tries to access other /admin sub-routes, check authentication
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/', req.url)); // Redirect to login page
    }
  }

  return NextResponse.next(); // Allow the request to proceed if conditions are met
}

export const config = {
  matcher: ['/admin/:path*'], // This will match /admin and all sub-routes (e.g., /admin/dashboard)
};
