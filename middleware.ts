import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  console.log(
    "Middleware - Path:",
    pathname,
    "Token:",
    token ? "exists" : "missing"
  );

  // Redirect to signin if no token and trying to access protected routes
  if (!token && pathname !== "/signin") {
    return NextResponse.redirect(new URL("/signin", origin));
  }

  // Redirect to home if already logged in and trying to access signin
  if (token && pathname === "/signin") {
    return NextResponse.redirect(new URL("/", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Protect all routes except these
};
