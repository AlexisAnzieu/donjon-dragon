"use client";

import { PrinterService } from "@/lib/printer";
import { useEffect, useState } from "react";

export default function PrintButton({ elementId }: { elementId: string }) {
  const [isPrintAvailable, setIsPrintAvailable] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkPrintAvailability = async () => {
      try {
        const response = await fetch("/api/print");
        const data = await response.json();
        setIsPrintAvailable(data.status === 200);
      } catch (error) {
        console.error("Print check failed:", error);
        setIsPrintAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkPrintAvailability();
  }, []);

  const handlePrint = async () => {
    const printerService = PrinterService.getInstance();

    try {
      const dataUrl = await printerService.generateImage(elementId);
      await printerService.print(dataUrl);
      printerService.downloadImage(dataUrl, "printable-image.png");
    } catch (error) {
      console.error("Print failed:", error);
    }
  };

  return (
    <button
      onClick={handlePrint}
      disabled={!isPrintAvailable || isChecking}
      className={`mb-4 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg 
      font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
      transition-all duration-200 ease-in-out hover:from-red-600 hover:to-red-700 
      focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 print:hidden
      ${
        !isPrintAvailable || isChecking ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <span className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        {isChecking ? "Checking printer..." : "Print Monster Card"}
      </span>
    </button>
  );
}
