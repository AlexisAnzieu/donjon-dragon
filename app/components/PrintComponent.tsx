"use client";

import { sendImageToPrinter } from "@/lib/printer";
import { toPng } from "html-to-image";

const PrintComponent = () => {
  const handlePrint = async () => {
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
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <div id="printable"></div>

      <button
        onClick={handlePrint}
        className="bg-purple-500 text-white py-2 px-4 rounded"
      >
        Print
      </button>
    </div>
  );
};

export default PrintComponent;
