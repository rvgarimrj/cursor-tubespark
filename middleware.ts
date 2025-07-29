import { stackServerApp } from "@/lib/auth/stack-auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser();
  const pathname = request.nextUrl.pathname;

  // Define protected routes
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
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !user) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is authenticated and trying to access auth routes
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};