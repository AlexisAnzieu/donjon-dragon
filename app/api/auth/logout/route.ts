import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { oidcConfig } from "@/lib/oidc";

// Single logout: clear the local session and end the provider session too.
export async function GET(req: NextRequest) {
  const oidc = oidcConfig();
  const idToken = req.cookies.get("oidc_id_token")?.value;

  const endSession = new URL(`${oidc.authUrl}/api/auth/oauth2/end-session`);
  endSession.searchParams.set("client_id", oidc.clientId);
  endSession.searchParams.set("post_logout_redirect_uri", oidc.websiteUrl);
  if (idToken) {
    endSession.searchParams.set("id_token_hint", idToken);
  }

  const res = NextResponse.redirect(endSession);
  res.cookies.delete(AUTH_COOKIE_NAME);
  res.cookies.delete("oidc_id_token");
  return res;
}
