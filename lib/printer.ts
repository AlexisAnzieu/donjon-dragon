import { toPng } from "html-to-image";

export interface PrintServiceConfig {
  pixelRatio?: number;
  canvasWidth?: number;
}

export class PrinterService {
  private static instance: PrinterService;
  private readonly config: PrintServiceConfig;

  private constructor() {
    this.config = {
      pixelRatio: 2,
      canvasWidth: 280,
    };
  }

  public static getInstance(): PrinterService {
    if (!PrinterService.instance) {
      PrinterService.instance = new PrinterService();
    }
    return PrinterService.instance;
  }

  async generateImage(elementId: string): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    return toPng(element, {
      pixelRatio: this.config.pixelRatio,
      canvasWidth: this.config.canvasWidth,
    });
  }

  async print(imageUrl: string): Promise<void> {
    try {
      const response = await fetch("/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to print");
      }
    } catch (error) {
      console.error("Printing error:", error);
      throw error;
    }
  }

  downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }
}
