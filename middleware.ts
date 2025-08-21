import { Session } from "@/auth/server";
import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const isAdminSubdomain = host.startsWith("admin.");

  // Rewrite root of admin subdomain to /admin
  if (isAdminSubdomain && pathname === "/") {
    const rewriteUrl = new URL("/admin", request.url);
    return NextResponse.rewrite(rewriteUrl);
  }

  // Only check session if admin subdomain
  if (isAdminSubdomain) {
    const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
      baseURL: process.env.NEXT_PUBLIC_APP_URL!,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json("Forbidden", { status: 403 });
    }

    // Allow access to /admin pages
    if (pathname.startsWith("/admin")) {
      return NextResponse.next();
    }

    // If any other path on admin subdomain, allow
    return NextResponse.next();
  }

  // Prevent normal domain users from accessing /admin
  if (pathname.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
