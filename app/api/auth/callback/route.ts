import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import {
  AUTH_COOKIE_NAME,
  UnifiedTokenPayload,
  createToken,
  getUserFromToken,
} from "@/lib/auth";

function getWebsiteBaseUrl() {
  const base = process.env.WEBSITE_URL;
  if (!base) {
    throw new Error("WEBSITE_URL environment variable is not set");
  }
  return base.replace(/\/$/, "");
}

function toRelativePath(target: string) {
  if (!target) {
    return "/";
  }
  if (target.startsWith("http://") || target.startsWith("https://")) {
    const { pathname, search, hash } = new URL(target);
    return `${pathname}${search}${hash}` || "/";
  }
  return target.startsWith("/") ? target : `/${target}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const redirectUrl = searchParams.get("redirectUrl");

  if (!token || !redirectUrl) {
    return new NextResponse("Missing token or redirectUrl", { status: 400 });
  }

  try {
    const { cid, email, name } = await getUserFromToken<UnifiedTokenPayload>(
      token
    );

    const user = await prisma.user.upsert({
      where: { unifiedId: cid } as never,
      update: {
        email,
        name,
      } as never,
      create: {
        unifiedId: cid,
        email,
        name,
        pseudo: name,
      } as never,
    });

    const normalizedUser = user as unknown as {
      id: string;
      email: string;
      name: string;
    };

    const newToken = await createToken({
      id: normalizedUser.id,
      email: normalizedUser.email,
      name: normalizedUser.name,
    });

    const baseUrl = getWebsiteBaseUrl();
    const destination = `${baseUrl}${toRelativePath(redirectUrl)}`;

    const response = NextResponse.redirect(destination);
    response.cookies.set(AUTH_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    console.error("Auth callback error", error);
    return new NextResponse("Token verification failed", { status: 401 });
  }
}
