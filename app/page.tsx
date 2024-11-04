"use client";

import Monster from "@/components/monster";
import { sendImageToPrinter } from "@/lib/printer";
import html2canvas from "html2canvas"; // Import html2canvas

export default function Home() {
  const handlePrint = async () => {
    const element = document.getElementById("printable");
    if (element) {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL("image/png");
      sendImageToPrinter(dataUrl);

      // Create a link element to download the image
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "printable-image.png";
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <main id="printable">
        <Monster />
      </main>

      <button
        onClick={handlePrint}
        className="bg-purple-500 text-white py-2 px-4 rounded"
      >
        Print
      </button>
    </div>
  );
}
