import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (host.startsWith("admin.")) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/admin", request.url));
    }

    if (!pathname.startsWith("/admin")) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  const sessionCookie = getSessionCookie(request);

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
