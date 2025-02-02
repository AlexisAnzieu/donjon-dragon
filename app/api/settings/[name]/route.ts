import { auth } from "@/lib/auth";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = await params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const setting = await prisma.setting.findFirst({
      where: {
        userId: session.user.id,
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
  { params }: { params: { name: string } }
) {
  const { name } = await params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { value } = await request.json();

    const setting = await prisma.setting.upsert({
      where: {
        userId_name: {
          userId: session.user.id,
          name,
        },
      },
      update: {
        value,
      },
      create: {
        userId: session.user.id,
        name,
        value,
      },
    });

    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
