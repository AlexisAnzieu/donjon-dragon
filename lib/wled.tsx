import { RGBColor } from "./lumia";
import { debounce } from "lodash";

export interface WLEDDevice {
  id: string;
  name: string;
  ip: string;
}

interface WLEDDeviceInfo {
  leds: {
    count: number;
  };
  name: string;
  mac: string;
  brand: string;
}

interface WLEDState {
  on: boolean;
  bri: number;
  seg: {
    col: number[][];
    len: number; // Length of the segment
    stop: number; // Stop index based on health percentage
  }[];
}

async function getDeviceInfo(ip: string): Promise<WLEDDeviceInfo | null> {
  try {
    const response = await fetch(`http://${ip}/json/info`);
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Ignore connection errors
  }
  return null;
}

export async function discoverWLEDDevices(): Promise<WLEDDevice[]> {
  try {
    const ip = "192.168.0.12";
    const info = await getDeviceInfo(ip);

    if (info?.brand === "WLED") {
      return [
        {
          id: info.mac || `wled-${ip}`,
          name: info.name || `WLED Device (${ip})`,
          ip,
        },
      ];
    }

    return [];
  } catch (error) {
    console.error("Error discovering WLED devices:", error);
    return [];
  }
}

function interpolateColor(
  color1: RGBColor,
  color2: RGBColor,
  factor: number
): RGBColor {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * factor),
    g: Math.round(color1.g + (color2.g - color1.g) * factor),
    b: Math.round(color1.b + (color2.b - color1.b) * factor),
  };
}

export function getHealthColor(current: number, max: number): RGBColor {
  const percentage = (current / max) * 100;

  // Define color stops
  const red: RGBColor = { r: 255, g: 0, b: 0 }; // 0%
  const orange: RGBColor = { r: 255, g: 165, b: 0 }; // 33%
  const yellow: RGBColor = { r: 255, g: 255, b: 0 }; // 66%
  const green: RGBColor = { r: 0, g: 255, b: 0 }; // 100%

  if (percentage <= 33) {
    // Interpolate between red and orange
    return interpolateColor(red, orange, percentage / 33);
  } else if (percentage <= 66) {
    // Interpolate between orange and yellow
    return interpolateColor(orange, yellow, (percentage - 33) / 33);
  } else {
    // Interpolate between yellow and green
    return interpolateColor(yellow, green, (percentage - 66) / 34);
  }
}

// Create a debounced version of the core command functionality
const debouncedSendCommand = debounce(
  async (
    device: WLEDDevice,
    color: RGBColor,
    percentage: number,
    brightness: number
  ) => {
    try {
      const info = await getDeviceInfo(device.ip);
      if (!info) {
        throw new Error("Could not get device info");
      }

      console.log(info);

      const ledCount = info.leds.count;
      const stopIndex = Math.floor((percentage / 100) * ledCount);

      const state: WLEDState = {
        on: true,
        bri: Math.floor((brightness * 255) / 100),
        seg: [
          {
            col: [[color.r, color.g, color.b]],
            len: ledCount,
            stop: stopIndex,
          },
        ],
      };

      const response = await fetch(`http://${device.ip}/json/state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to send color command to WLED:", error);
    }
  },
  300 // Debounce wait time in milliseconds
);

export async function sendColorCommand(
  device: WLEDDevice,
  color: RGBColor,
  percentage: number,
  brightness: number = 100
): Promise<void> {
  await debouncedSendCommand(device, color, percentage, brightness);
}
