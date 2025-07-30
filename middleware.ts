import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n/config';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'pt',
  localePrefix: 'always',
  localeDetection: false // Disable browser language detection
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('Middleware executing for:', pathname);
  
  // Skip middleware for static files and API routes
  const shouldSkip = pathname.startsWith('/api/') || 
                    pathname.startsWith('/_next/') ||
                    pathname.startsWith('/handler/') ||
                    pathname.includes('.') && !pathname.endsWith('.html');

  if (shouldSkip) {
    console.log('Skipping middleware for:', pathname);
    return NextResponse.next();
  }

  try {
    // Only use intl middleware for now
    console.log('Applying intl middleware to:', pathname);
    const response = intlMiddleware(request);
    console.log('Intl middleware response status:', response.status);
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};