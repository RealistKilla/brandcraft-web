// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match routes you want to block
  if (
    !pathname.startsWith("/_next") &&
    pathname !== "/favicon.ico" &&
    pathname !== "/"
  ) {
    // if (pathname.startsWith("/auth") || pathname.startsWith("/dashboard")) {
    //   const url = request.nextUrl.clone();
    //   url.pathname = "/waitlist";
    //   return NextResponse.redirect(url);
    // }

    return NextResponse.next();
  }
}
// Optionally, limit middleware to certain paths
export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*"],
};
