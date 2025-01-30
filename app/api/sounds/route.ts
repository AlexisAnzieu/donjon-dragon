import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { soundLibraryId, ...data } = await request.json();

    const sound = await prisma.sound.create({
      data: {
        ...data,
        soundLibrary: { connect: { id: soundLibraryId } },
      },
    });

    return NextResponse.json(sound, { status: 201 });
  } catch (error) {
    console.error("Failed to create sound:", error);
    return NextResponse.json(
      { error: "Failed to create sound" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cid = searchParams.get("cid");

  if (!cid) {
    return NextResponse.json({ error: "Missing sound CID" }, { status: 400 });
  }

  try {
    await prisma.sound.delete({
      where: { cid },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete sound:", error);
    return NextResponse.json(
      { error: "Failed to delete sound" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cid = searchParams.get("cid");

  if (!cid) {
    return NextResponse.json({ error: "Missing sound CID" }, { status: 400 });
  }

  try {
    const { label } = await request.json();

    const updatedSound = await prisma.sound.update({
      where: { cid },
      data: { label },
    });

    return NextResponse.json(updatedSound);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to update sound:", error.message);
    return NextResponse.json(
      { error: "Failed to update sound" },
      { status: 500 }
    );
  }
}
