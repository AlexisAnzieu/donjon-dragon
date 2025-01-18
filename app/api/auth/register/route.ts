import { NextResponse } from "next/server";
import { scryptSync } from "crypto";
import prisma from "@/prisma/db";

export async function POST(request: Request) {
  try {
    const { pseudo, email, password } = await request.json();

    // Validate input
    if (!email || !password || !pseudo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hashedPassword = scryptSync(password, "", 64).toString("hex");

    const user = await prisma.user.create({
      data: {
        pseudo,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      user,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
