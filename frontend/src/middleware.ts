import { NextRequest, NextResponse } from 'next/server';

/**
 * Protects:
 *   /cabinet/* — client area, requires lb_session cookie
 *   /admin/*   — admin area, requires lb_admin cookie
 *
 * Auth pages themselves (/login, /admin/login) are exempt from the
 * check so that anonymous users can reach the form. All other routes
 * inside /cabinet and /admin require the appropriate presence cookie.
 *
 * Both cookies are a server-side presence signal; the actual JWT
 * lives in localStorage and is hydrated inside the corresponding
 * AuthProvider.
 */
const PUBLIC_ADMIN = ['/admin/login'];
const PUBLIC_CABINET = ['/login'];

function isPublic(pathname: string, publicPaths: string[]) {
  return publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get('lb_session');
  const admin   = req.cookies.get('lb_admin');

  if (pathname.startsWith('/admin') && !isPublic(pathname, PUBLIC_ADMIN)) {
    if (!admin?.value) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/cabinet') && !isPublic(pathname, PUBLIC_CABINET)) {
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
