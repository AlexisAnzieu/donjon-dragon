import { NextRequest, NextResponse } from "next/server";
import { errors } from "jose";
import { AUTH_COOKIE_NAME, getUserFromToken } from "./lib/auth";

const PROTECTED_PATHS = ["/dashboard"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (basePath) => pathname === basePath || pathname.startsWith(`${basePath}/`)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/api/auth/login", req.url);
  loginUrl.searchParams.set("redirectUrl", `${pathname}${search}`);

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    await getUserFromToken(token);
    return NextResponse.next();
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return NextResponse.redirect(loginUrl);
    }
    console.error("Auth token verification failed", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
