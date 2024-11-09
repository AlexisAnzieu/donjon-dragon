import { useState } from "react";
interface TooltipTextProps {
  text: string;
  children: React.ReactNode;
}

export default function TooltipText({ text, children }: TooltipTextProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <span className="group" onMouseMove={handleMouseMove}>
      <span className="text-blue-600 font-semibold cursor-help border-b border-dotted border-blue-600">
        {text}
      </span>
      <span
        className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition text-white p-2 rounded absolute text-sm z-10 max-w-3xl"
        style={{ top: position.y + 10, left: position.x + 10 }}
      >
        {children}
      </span>
    </span>
  );
}
