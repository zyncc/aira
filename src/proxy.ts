import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// middleware to redirect admin to admin domain
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (!host.startsWith("admin.")) {
    const url = request.nextUrl.clone();
    url.pathname = "/not-found";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
