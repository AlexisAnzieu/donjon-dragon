import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      soundLibrary: true,
      hostedgames: true,
      characters: {
        select: {
          name: true,
          games: true,
        },
      },
    },
  });

  return NextResponse.json(user);
}
