import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("sessionId") || "";
  const gameId = searchParams.get("gameId") || "";
  const userId = searchParams.get("gameMasterId") || "";

  try {
    const soundLibraries = await prisma.soundLibrary.findMany({
      select: {
        id: true,
        name: true,
        isDefault: true,
        sounds: true,
      },
      where: {
        OR: [{ sessionId }, { gameId }, { userId }],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(soundLibraries);
  } catch (error) {
    console.error("Failed to fetch sounds:", error);
    return NextResponse.json(
      { error: "Failed to fetch sounds" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, name } = body;

    if (!sessionId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const soundLibrary = await prisma.soundLibrary.create({
      data: {
        sessionId,
        name,
      },
    });

    return NextResponse.json(soundLibrary, { status: 201 });
  } catch (error) {
    console.error("Failed to create soundLibrary:", error);
    return NextResponse.json(
      { error: "Failed to create soundLibrary" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing sound library ID" },
      { status: 400 }
    );
  }

  try {
    await prisma.soundLibrary.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete sound library:", error);
    return NextResponse.json(
      { error: "Failed to delete sound library" },
      { status: 500 }
    );
  }
}
