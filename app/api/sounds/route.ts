import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchTerm = searchParams.get("search") || "";

  try {
    const sounds = await prisma.sound.findMany({
      where: {
        OR: [
          { label: { contains: searchTerm } },
          { category: { contains: searchTerm } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(sounds);
  } catch (error) {
    console.error("Failed to fetch sounds:", error);
    return NextResponse.json(
      { error: "Failed to fetch sounds" },
      { status: 500 }
    );
  }
}
