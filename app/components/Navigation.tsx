import { cookies } from "next/headers";
import { errors } from "jose";
import NavigationClient from "./navigation-client";
import { AUTH_COOKIE_NAME, getUserFromToken } from "@/lib/auth";

export default async function Navigation() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  let isAuthenticated = false;

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

  return <NavigationClient isAuthenticated={isAuthenticated} />;
}
