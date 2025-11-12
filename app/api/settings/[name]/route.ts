import { getUserFromCookie } from "@/lib/auth";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  try {
    const { id: userId } = await getUserFromCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const setting = await prisma.setting.findFirst({
      where: {
        userId,
        name,
      },
    });

    return NextResponse.json(setting || { value: [] });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  try {
    const { id: userId } = await getUserFromCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { value } = await request.json();

    const setting = await prisma.setting.upsert({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
      update: {
        value,
      },
      create: {
        userId,
        name,
        value,
      },
    });

    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
