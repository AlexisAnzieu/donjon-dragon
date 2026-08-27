import { cookies } from "next/headers";
import { errors } from "jose";
import NavigationClient from "./navigation-client";
import { AUTH_COOKIE_NAME, getUserFromToken } from "@/lib/auth";
import { buildAuthRedirectUrl } from "@/lib/auth-redirect";

export default async function Navigation() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  let isAuthenticated = false;
  let loginUrl = "/";

  try {
    loginUrl = buildAuthRedirectUrl("/dashboard");
  } catch (error) {
    console.error("Failed to build login URL for navigation", error);
  }

  if (token) {
    try {
      await getUserFromToken(token);
      isAuthenticated = true;
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        isAuthenticated = false;
      } else {
        console.error("Failed to validate auth token for navigation", error);
      }
    }
  }

  return (
    <NavigationClient isAuthenticated={isAuthenticated} loginUrl={loginUrl} />
  );
}
