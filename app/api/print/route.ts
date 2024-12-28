import { NextResponse } from "next/server";
import EscPosEncoder from "esc-pos-encoder";
import sharp from "sharp";
import { createCanvas, Image } from "canvas";

async function processImage(pictureUrl: string): Promise<Image> {
  const response = await fetch(pictureUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch image");
  }

  const imageBuffer = await response.arrayBuffer();
  const processedImageBuffer = await sharp(imageBuffer).toBuffer();

  const img = new Image();
  img.src = processedImageBuffer;
  return img;
}

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();
    const imageBuffer = await processImage(imageUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const encoder = new (EscPosEncoder as any)({ createCanvas });

    const adjustedHeight = Math.ceil(imageBuffer.height / 8) * 8;
    const adjustedWidth = Math.ceil(imageBuffer.width / 8) * 8;

    const printData = encoder
      .initialize()
      .align("center")
      .image(imageBuffer, adjustedWidth, adjustedHeight, "atkinson")
      .newline()
      .newline()
      .newline()
      .newline()
      .cut()
      .encode();

    const printerResponse = await fetch("https://printer.h2t.club/raw-print", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: printData,
    });

    if (!printerResponse.ok) {
      throw new Error(`Printer error! status: ${printerResponse.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Printing error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const response = await fetch("https://printer.h2t.club");
  return NextResponse.json({ status: response.status });
}
