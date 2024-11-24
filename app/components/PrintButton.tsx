"use client";

import { toPng } from "html-to-image";
import { sendImageToPrinter } from "@/lib/printer";

export default function PrintButton() {
  const handlePrint = () => {
    const element = document.getElementById("printable");
    if (element) {
      toPng(element, { pixelRatio: 2, canvasWidth: 280 }).then((dataUrl) => {
        sendImageToPrinter(dataUrl);

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "printable-image.png";
        link.click();
      });
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 print:hidden"
    >
      Print Monster Card
    </button>
  );
}
