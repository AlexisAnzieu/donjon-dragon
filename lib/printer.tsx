interface PrinterOptions {
  width?: number;
  endpoint?: string;
  imageOptions?: {
    mode?: "normal" | "doubleWidth" | "doubleHeight" | "quadruple";
    density?: "single" | "double";
  };
}

/**
 * Sends an image to the printer using ESC/POS commands via the API
 * @param imageUrl URL of the image to print
 * @param options Printer and image options
 */
async function sendImageToPrinter(
  imageUrl: string,
  options: PrinterOptions = {}
): Promise<void> {
  try {
    const response = await fetch("/api/print", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
        options,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to print");
    }

    const result = await response.json();
    console.log("Print result:", result);
  } catch (error) {
    console.error("Printing error:", error);
    throw error;
  }
}

export { sendImageToPrinter };
