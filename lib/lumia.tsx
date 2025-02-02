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

const LUMIA_TOKEN = "lumia892089382";

export async function sendHurtTokenColor(): Promise<void> {
  sendColorCommand({ r: 255, g: 0, b: 0 });
}

export interface LumiaLight {
  id: string;
  name: string;
  type: string;
}
export interface LumiaSettings {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { lights: LumiaLight[] };
}

export async function getSettings(): Promise<LumiaSettings | null> {
  try {
    const response = await fetch(
      `http://localhost:39231/api/retrieve?token=${LUMIA_TOKEN}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const settings = await response.json();
    return settings;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
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
      `http://localhost:39231/api/send?token=${LUMIA_TOKEN}`,
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
