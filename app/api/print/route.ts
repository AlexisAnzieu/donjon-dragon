import { NextResponse } from "next/server";
import EscPosEncoder from "esc-pos-encoder";
import sharp from "sharp";
import { createCanvas, Image } from "canvas";

async function getImage({
  pictureUrl,
  width,
  height,
  rotate = 0,
}: {
  pictureUrl: string;
  width: number;
  height: number;
  rotate?: number;
}) {
  const response = await fetch(pictureUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch picture");
  }

  const imageBuffer = await response.arrayBuffer();
  const processedImageBuffer = await sharp(imageBuffer)
    .rotate(rotate)
    .resize(width, height)
    .toBuffer();

  const img = new Image();
  img.src = processedImageBuffer;

  return img;
}

export async function POST(request: Request) {
  try {
    const { imageUrl, options = {} } = await request.json();

    const { endpoint = "http://printer.local:9100/raw-print" } = options;

    // Process the image
    const imageBuffer = await getImage({
      pictureUrl: imageUrl,
      width: 528,
      height: 712,
    });

    // @ts-expect-error - createCanvas is not defined
    const encoder = new EscPosEncoder({
      createCanvas,
    });

    // Build the print job
    encoder
      .initialize()
      .align("center")
      .text("Hello, world!")
      .image(imageBuffer, 528, 712, "atkinson")
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
