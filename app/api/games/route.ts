import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        characters: {
          select: {
            id: true,
            createdAt: true,
            race: true,
            class: true,
            background: true,
            name: true,
            alignment: true,
          },
        },
        sessions: true,
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const { name } = await request.json();

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  try {
    const updatedGame = await prisma.game.update({
      where: { id },
      data: { name },
    });

    return new Response(JSON.stringify(updatedGame));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
