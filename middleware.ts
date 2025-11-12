import { NextRequest, NextResponse } from "next/server";
import { errors } from "jose";
import { AUTH_COOKIE_NAME, getUserFromToken } from "./lib/auth";
import { buildAuthRedirectUrl } from "./lib/auth-redirect";

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

  const redirectTarget = `${pathname}${search}`;
  let authUrl: string;

  try {
    authUrl = buildAuthRedirectUrl(redirectTarget);
  } catch (error) {
    console.error("Failed to build auth redirect URL", error);
    return new NextResponse("Authentication misconfigured", { status: 500 });
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(authUrl);
  }

  try {
    await getUserFromToken(token);
    return NextResponse.next();
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      return NextResponse.redirect(authUrl);
    }
    console.error("Auth token verification failed", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
