import { NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const character = await prisma.character.create({ data });

    return NextResponse.json(character);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Character ID is required" },
        { status: 400 }
      );
    }

    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        games: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Character ID is required" },
        { status: 400 }
      );
    }

    const character = await prisma.character.delete({
      where: { id },
    });

    return NextResponse.json(character);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
