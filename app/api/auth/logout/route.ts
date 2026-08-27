import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

const CLEAR = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
  expires: new Date(0),
};

// Local logout only: clears this app's session; the SSO session stays intact.
export async function GET() {
  const res = NextResponse.redirect(
    process.env.NEXT_PUBLIC_WEBSITE_URL as string
  );
  res.cookies.set(AUTH_COOKIE_NAME, "", CLEAR);
  res.cookies.set("oidc_id_token", "", CLEAR);
  return res;
}
