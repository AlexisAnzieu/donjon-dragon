import { Token } from "@prisma/client";
import { useState, MouseEvent } from "react";

interface DetailComponentProps {
  token: Token;
  onClose: () => void;
  isPublic?: boolean;
}

export function DetailComponent({
  token,
  onClose,
  isPublic = true,
}: DetailComponentProps) {
  const [position, setPosition] = useState({
    x: isPublic ? 20 : window.innerWidth - 320,
    y: isPublic ? 200 : window.innerHeight - 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed z-50"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className={`bg-white rounded-lg p-6 shadow-xl cursor-move ${
          isPublic ? "max-w-md" : "max-w-xs"
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <h2
            className={`font-bold text-gray-800 ${
              isPublic ? "text-2xl" : "text-lg"
            }`}
          >
            {token.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {token.icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={token.icon}
            alt={token.name}
            className={`w-full h-auto rounded-lg shadow-md ${
              !isPublic && "max-h-32"
            }`}
          />
        )}
      </div>
    </div>
  );
}
