import { NextResponse } from "next/server";
import EscPosEncoder from "esc-pos-encoder";
import sharp from "sharp";
import { createCanvas, Image } from "canvas";

async function getImage({ pictureUrl }: { pictureUrl: string }) {
  const response = await fetch(pictureUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch picture");
  }

  const imageBuffer = await response.arrayBuffer();
  const processedImageBuffer = await sharp(imageBuffer).toBuffer();

  const img = new Image();
  img.src = processedImageBuffer;

  return img;
}

export async function POST(request: Request) {
  try {
    const { imageUrl, options = {} } = await request.json();

    const { endpoint = "https://printer.h2t.club/raw-print" } = options;

    // Process the image
    const imageBuffer = await getImage({
      pictureUrl: imageUrl,
    });

    // @ts-expect-error - createCanvas is not defined
    const encoder = new EscPosEncoder({
      createCanvas,
    });

    // Build the print job
    const adjustedHeight = Math.ceil(imageBuffer.height / 8) * 8;
    const adjustedWidth = Math.ceil(imageBuffer.width / 8) * 8;

    encoder
      .initialize()
      .align("center")
      .image(imageBuffer, adjustedWidth, adjustedHeight, "atkinson")
      .newline()
      .newline()
      .newline()
      .newline()
      .cut();

    // Get the final buffer
    const printData = encoder.encode();

    // Send to printer
    const printerResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
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
