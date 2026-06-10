import { NextRequest, NextResponse } from 'next/server';

/**
 * Protect /cabinet/* routes.
 * JWT lives in localStorage (client-only), so we use a lightweight
 * cookie "lb_session" as a server-side presence signal.
 * The cookie is set by the login page after successful OTP and
 * cleared on logout.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/cabinet')) {
    const session = req.cookies.get('lb_session');
    if (!session?.value) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cabinet/:path*'],
};
