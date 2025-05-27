import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuthRoute = req.nextUrl.pathname.startsWith("/login");
  const isProtectedRoute = !["/api/auth", "/login"].includes(
    req.nextUrl.pathname
  );

  if (isProtectedRoute && !session) {
    // Redirect to login if no session
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isAuthRoute) {
    // Redirect logged-in users trying to access /login to the home page
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|icons/icon-192x192.png|icons/icon-512x512.png|login|service-worker.js|manifest.json).*)",
  ],
};
