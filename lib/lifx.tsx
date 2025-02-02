export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface ColorCommand {
  type: "rgb-color";
  params: {
    value: RGBColor;
    brightness: number;
    transition: number;
    duration?: number;
  };
}

export async function sendHurtTokenColor(): Promise<void> {
  sendColorCommand({ r: 255, g: 0, b: 0 });
}

export async function sendColorCommand(
  color: RGBColor,
  brightness: number = 100
): Promise<void> {
  const command: ColorCommand = {
    type: "rgb-color",
    params: {
      value: color,
      brightness,
      transition: 0,
    },
  };

  try {
    const response = await fetch(
      "http://localhost:39231/api/send?token=lumia892089382",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to send color command:", error);
  }
}
