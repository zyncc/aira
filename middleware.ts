import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/account")) {
    if (!sessionCookie) {
      return NextResponse.redirect(
        new URL(`/signin?callbackUrl=/account`, request.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/signin")) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/signin"],
};
