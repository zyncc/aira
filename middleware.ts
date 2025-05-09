import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (request.nextUrl.pathname.startsWith("/account") && !session?.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (session?.user && request.nextUrl.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    session?.user.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    // "/((?!_next/static|_next/image|favicon.ico).*)",
    "/account/:path*",
    "/admin/:path*",
    "/signin",
  ],
};
