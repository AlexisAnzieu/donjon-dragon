import { RGBColor } from "../../../lib/lifx";

interface LightButtonProps {
  name: string;
  color: RGBColor;
  brightness: number;
  onActivate: () => void;
  size?: "normal" | "line";
}

export function LightButton({
  name,
  color,
  brightness,
  onActivate,
  size = "normal",
}: LightButtonProps) {
  if (size === "line") {
    return (
      <button
        onClick={onActivate}
        className="w-full p-2 rounded-lg transition-colors"
        style={{
          backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
          opacity: brightness / 100,
        }}
      >
        <span className="text-white text-sm">{name}</span>
      </button>
    );
  }

  const rgbString = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const buttonSize = size === "normal" ? "w-16 h-16" : "w-24 h-24";

  return (
    <button
      onClick={onActivate}
      className={`${buttonSize} rounded-lg relative overflow-hidden transition-all duration-300 
        hover:scale-[1.02] hover:shadow-lg`}
      style={{
        backgroundColor: rgbString,
        opacity: brightness / 100,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30">
        <div className="h-full w-full flex items-center justify-center text-white text-sm font-medium">
          {name}
        </div>
      </div>
    </button>
  );
}
