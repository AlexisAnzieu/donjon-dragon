import { auth } from "@/lib/auth";
import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const setting = await prisma.setting.findFirst({
      where: {
        userId: session.user.id,
        name: "midi-attribution",
      },
    });

    return NextResponse.json(setting || { value: [] });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
          name: "midi-attribution",
        },
      },
      update: {
        value,
      },
      create: {
        userId: session.user.id,
        name: "midi-attribution",
        value,
      },
    });

    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
