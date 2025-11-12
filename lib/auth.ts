import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "auth_token";

type TokenPayload = {
  email: string;
  name: string;
};

export type UnifiedTokenPayload = TokenPayload & {
  cid: string;
};

export type InternalTokenPayload = TokenPayload & {
  id: string;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function getUserFromToken<T>(token: string): Promise<T> {
  const verified = await jwtVerify(token, getSecretKey());
  return verified.payload as T;
}

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    throw new Error("No auth token found in cookies");
  }
  return getUserFromToken<InternalTokenPayload>(token);
}

export async function createToken(payload: InternalTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(getSecretKey());
}
