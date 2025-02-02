import { useState } from "react";
import { RGBColor, sendColorCommand } from "../../../lib/lifx";
import { LightButton } from "./LightButton";
import { useLightPresets } from "../context/LightContext";

interface LightControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Light {
  id: string;
  name: string;
  color: RGBColor;
  brightness: number;
}

function hexToRgb(hex: string): RGBColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

function rgbToHex(color: RGBColor): string {
  return (
    "#" +
    [color.r, color.g, color.b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function LightControlModal({ isOpen, onClose }: LightControlModalProps) {
  const { lightPresets, updateLightPresets } = useLightPresets();
  const [name, setName] = useState("");
  const [color, setColor] = useState<RGBColor>({ r: 255, g: 255, b: 255 });
  const [brightness, setBrightness] = useState(100);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  if (!isOpen) return null;

  const handleAddLight = async () => {
    const newLight: Light = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      color,
      brightness,
    };
    await updateLightPresets([...lightPresets, newLight]);
    setName("");
  };

  const handleRemoveLight = async (id: string) => {
    const newLights = lightPresets.filter((light) => light.id !== id);
    await updateLightPresets(newLights);
  };

  const handleActivateLight = (light: Light) => {
    sendColorCommand(light.color, light.brightness);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rgbColor = hexToRgb(e.target.value);
    setColor(rgbColor);
  };

  const handleStartRename = (light: Light) => {
    setEditingId(light.id);
    setEditingName(light.name);
  };

  const handleSaveRename = async () => {
    if (!editingId) return;

    const newLights = lightPresets.map((light) =>
      light.id === editingId ? { ...light, name: editingName } : light
    );
    await updateLightPresets(newLights);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Light Management</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <span className="sr-only">Close</span>✕
          </button>
        </div>

        <div className="space-y-1 mb-6">
          {lightPresets.map((light) => (
            <div key={light.id} className="group flex items-center gap-2">
              {editingId === light.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded flex-1"
                    onKeyDown={(e) => e.key === "Enter" && handleSaveRename()}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveRename}
                    className="text-green-500 hover:text-green-400"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <LightButton
                      name={light.name}
                      color={light.color}
                      brightness={light.brightness}
                      onActivate={() => handleActivateLight(light)}
                      size="line"
                    />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                    <button
                      onClick={() => handleStartRename(light)}
                      className="text-gray-400 hover:text-white p-1"
                      title="Rename"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.991 8.991L4 16l.595-3.423 8.991-8.991z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemoveLight(light.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Remove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Light name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={rgbToHex(color)}
                onChange={handleColorChange}
                className="w-8 h-8 rounded cursor-pointer"
                title="Color"
              />

              <div className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1z" />
                  <path d="M10 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-20"
                  title="Brightness"
                />
                <span className="text-white text-sm w-8">{brightness}%</span>
              </div>

              <button
                onClick={handleAddLight}
                disabled={!name}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add Light"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
