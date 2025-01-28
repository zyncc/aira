import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./auth";

type Session = typeof auth.$Infer.Session;

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (pathname.startsWith("/admin")) {
    if (session?.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/signin")) {
    if (session?.session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!session?.session) {
    return NextResponse.redirect(
      new URL(`/signin?callbackUrl=${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/signin", "/checkout"],
};
