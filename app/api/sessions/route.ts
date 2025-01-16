import { DEFAULT_TOKEN_SIZE, raceIcons } from "@/app/game/type";
import prisma from "@/prisma/db";
import { Token } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { gameId, name } = await request.json();

    if (!gameId || !name) {
      return NextResponse.json(
        { error: "Game ID and name are required" },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { characters: true },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const session = await prisma.session.create({
      data: {
        gameId,
        name,
      },
    });

    const tokens: Omit<
      Token,
      "createdAt" | "updatedAt" | "monsterId" | "id"
    >[] =
      game.characters?.map((character, index) => ({
        name: character.name,
        type: "characters",
        xPercent: 10 + index * 5,
        yPercent: 10,
        size: DEFAULT_TOKEN_SIZE,
        hitPoint: character.hp || 0,
        maxHitPoint: character.hp || 0,
        sessionId: session.id,
        characterId: character.id,
        icon: raceIcons[character.race!],
      })) || [];

    await prisma.token.createMany({
      data: tokens,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      {
        error: "Failed to create session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      tokens: true,
      sounds: true,
    },
  });

  return NextResponse.json(session);
}

export async function PUT(request: Request) {
  try {
    const { tokens, fogOfWar, viewState, sounds } = await request.json();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (fogOfWar) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { fogOfWar },
      });
    } else if (tokens && tokens.length > 0) {
      await prisma.$transaction([
        prisma.token.deleteMany({
          where: { sessionId },
        }),
        prisma.token.createMany({
          data: tokens.map((token: Token) => ({
            ...token,
            sessionId,
          })),
        }),
      ]);
    } else if (viewState) {
      await prisma.session.update({
        where: { id: sessionId },
        data: {
          viewState,
        },
      });
    } else if (sounds) {
      await prisma.$transaction([
        prisma.sound.deleteMany({
          where: { sessionId },
        }),
        prisma.sound.createMany({
          data: sounds.map((sound: Token) => ({
            ...sound,
            sessionId,
          })),
        }),
      ]);
    }

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
