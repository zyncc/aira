import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "./lib/getServerSession";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getServerSession();

  if (pathname.startsWith("/admin")) {
    if (session?.user.role !== "admin" || !session?.user) {
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
  runtime: "nodejs",
  matcher: ["/admin/:path*", "/account/:path*", "/signin"],
};
