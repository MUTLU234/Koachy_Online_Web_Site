import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware
 * 
 * Sayfa erişimlerini kontrol eder.
 * AuthContext tarafından set edilen 'session' cookie'sine bakar.
 */
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // Korumalı rotalar
  const protectedRoutes = ['/dashboard', '/profil', '/randevular', '/mesajlar'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Auth sayfaları (Giriş yapmış kullanıcı girmemeli)
  const authRoutes = ['/giris', '/kayit'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // 1. Korumalı sayfaya erişmeye çalışıyor ama giriş yapmamış
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/giris', request.url);
    // Gittiği sayfayı query param olarak ekle (redirect için)
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Auth sayfasına erişmeye çalışıyor ama zaten giriş yapmış
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
