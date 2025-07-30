import { stackServerApp } from "@/lib/auth/stack-auth";
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n/config';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
  // Don't use a prefix for the default locale
  localePrefix: 'as-needed'
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip intl middleware for API routes, static files, and Stack handler
  const shouldSkipIntl = pathname.startsWith('/api/') || 
                        pathname.startsWith('/_next/') ||
                        pathname.startsWith('/handler/') ||
                        pathname.includes('.') && !pathname.endsWith('.html');

  if (shouldSkipIntl) {
    return NextResponse.next();
  }

  // Handle internationalization first
  const intlResponse = intlMiddleware(request);
  
  // Get the locale from the pathname or use default
  const locale = locales.find(loc => pathname.startsWith(`/${loc}/`)) || 
                pathname === `/${defaultLocale}` ? defaultLocale :
                locales.find(loc => pathname === `/${loc}`) || defaultLocale;

  // Create new request with locale for auth middleware
  const localePathnameRegex = new RegExp(`^/(${locales.join('|')})(/.*)?$`);
  const pathWithoutLocale = pathname.replace(localePathnameRegex, '$2') || '/';

  try {
    // Get user for auth check
    const user = await stackServerApp.getUser();

    // Define protected routes (without locale prefix)
    const protectedRoutes = [
      "/dashboard",
      "/ideas",
      "/calendar",
      "/analytics",
      "/settings",
      "/billing",
    ];

    // Define auth routes (should redirect to dashboard if already authenticated)
    const authRoutes = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];

    // Check if the current path is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathWithoutLocale.startsWith(route)
    );

    // Check if the current path is an auth route
    const isAuthRoute = authRoutes.some((route) => pathWithoutLocale.startsWith(route));

    // If user is not authenticated and trying to access protected route
    if (isProtectedRoute && !user) {
      const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
      signInUrl.searchParams.set("redirect", pathWithoutLocale);
      return NextResponse.redirect(signInUrl);
    }

    // If user is authenticated and trying to access auth routes
    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    return intlResponse;
  } catch (error) {
    console.error("Middleware error:", error);
    return intlResponse;
  }
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
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};