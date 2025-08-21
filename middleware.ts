import { Session } from "@/auth/server";
import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const isAdminSubdomain = host.startsWith("admin.");

  if (isAdminSubdomain && pathname === "/") {
    return NextResponse.rewrite(new URL("/admin", request.url));
  }

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

    if (pathname.startsWith("/admin")) {
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
