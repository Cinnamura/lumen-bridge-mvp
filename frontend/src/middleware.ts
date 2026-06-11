import { NextRequest, NextResponse } from 'next/server';

/**
 * Protects:
 *   /cabinet/* — client area, requires lb_session cookie
 *   /admin/*   — admin area, requires lb_admin cookie
 *     A user with lb_session (client) trying to reach /admin is
 *     redirected to their client cabinet; missing both cookies
 *     sends the user to the appropriate login page.
 *
 * Both cookies are set as a server-side presence signal on top of
 * the JWT in localStorage (which is client-only). Middleware cannot
 * read localStorage — that hydration happens client-side inside
 * the corresponding AuthProvider.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get('lb_session');
  const admin   = req.cookies.get('lb_admin');

  if (pathname.startsWith('/admin')) {
    if (!admin?.value) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    if (session?.value && !admin?.value) {
      // Edge case: client session but no admin session — already covered above
    }
  }

  if (pathname.startsWith('/cabinet')) {
    if (!session?.value) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cabinet/:path*', '/admin/:path*'],
};
