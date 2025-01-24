import { useEffect } from "react";
import { FaEraser, FaPencilAlt } from "react-icons/fa";

interface FogControlsProps {
  isFogControlActive: boolean;
  setIsFogControlActive: (active: boolean) => void;
  isDrawingFog: boolean;
  setIsDrawingFog: (drawing: boolean) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onReset: () => void;
  isAutoClearEnabled: boolean;
  setIsAutoClearEnabled: (enabled: boolean) => void;
}

const useKeyboardShortcut = (key: string, onKeyPress: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if any input element is focused
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;

      if (event.key === key && !event.repeat && !isInputFocused) {
        event.preventDefault();
        onKeyPress();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, onKeyPress]);
};

export const FogControls = ({
  isFogControlActive,
  setIsFogControlActive,
  isDrawingFog,
  setIsDrawingFog,
  brushSize,
  setBrushSize,
  onReset,
  isAutoClearEnabled,
  setIsAutoClearEnabled,
}: FogControlsProps) => {
  useKeyboardShortcut("f", () => setIsFogControlActive(!isFogControlActive));

  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center z-50">
      <div className="backdrop-blur-md bg-white/70 p-1 rounded-xl shadow-lg transition-all duration-300 flex justify-center">
        <div className="grid auto-cols-max grid-flow-col h-[30px] relative">
          <button
            onClick={() => setIsFogControlActive(!isFogControlActive)}
            className={`flex items-center justify-center gap-1.5 px-3  rounded-lg text-sm font-medium transition-all duration-300 ${
              isFogControlActive
                ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
            }`}
            style={{
              left: isFogControlActive ? "50%" : "auto",
            }}
            title="Activer/désactiver les contrôles du brouillard de guerre (Barre d'espace)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16H5.5z" />
            </svg>
            <span>Fog</span>
            <span className="text-xs opacity-75">(F)</span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out transform-gpu ${
              isFogControlActive
                ? "w-[465px] opacity-100 scale-x-100 origin-left h-[30px] ml-[70px]"
                : "w-0 opacity-0 scale-x-0 origin-left h-[30px]"
            }`}
          >
            <div className="flex items-center gap-2 ml-2 min-w-[465px] h-full">
              <div className="flex gap-2">
                <button
                  onClick={onReset}
                  className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium bg-gray-800 text-white"
                  title="Réinitialiser le brouillard de guerre"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => setIsDrawingFog(!isDrawingFog)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium ${
                    isDrawingFog
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {isDrawingFog ? (
                    <FaPencilAlt className="h-4 w-4" />
                  ) : (
                    <FaEraser className="h-4 w-4" />
                  )}
                  <span>{isDrawingFog ? "Draw" : "Clear"}</span>
                </button>
              </div>

              <div className="bg-white/50 p-2 rounded-lg">
                <div className="relative flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
                    style={{
                      background: `linear-gradient(to right, rgb(75, 85, 99) ${
                        (brushSize / 500) * 100
                      }%, rgb(229, 231, 235) ${(brushSize / 500) * 100}%)`,
                    }}
                  />
                  <span className="text-xs font-medium text-gray-700 min-w-[3rem] text-right">
                    {brushSize}px
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsAutoClearEnabled(!isAutoClearEnabled)}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-sm font-medium ${
                  isAutoClearEnabled
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <span>Suivi</span>
                <div
                  className={`w-2 h-2 ml-2 rounded-full ${
                    isAutoClearEnabled
                      ? "bg-white animate-pulse"
                      : "bg-gray-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
