import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { Session } from "./auth";
import { betterFetch } from "@better-fetch/fetch";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const isAdminSubdomain = host.startsWith("admin.");

  if (isAdminSubdomain) {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",

      {
        baseURL: request.nextUrl.origin,

        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!session || session.user.role !== "admin") {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }

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
