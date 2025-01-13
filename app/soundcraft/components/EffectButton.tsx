import { Effect } from "../effects";

interface EffectButtonProps {
  effect: Effect;
  isPlaying: boolean;
  isUsed: boolean;
  progress: number;
  isLooping: boolean;
  isFavorite: boolean;
  favoriteIndex?: number;
  onPlay: () => void;
  onToggleFavorite: () => void;
  onToggleLoop: () => void;
}

export function EffectButton({
  effect,
  isPlaying,
  isUsed,
  progress,
  isLooping,
  isFavorite,
  favoriteIndex,
  onPlay,
  onToggleFavorite,
  onToggleLoop,
}: EffectButtonProps) {
  return (
    <button
      onClick={onPlay}
      className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center relative overflow-hidden
        ${
          isPlaying
            ? "bg-gradient-to-b from-gray-600 to-gray-700 ring-2 ring-white/30"
            : "bg-gradient-to-b from-gray-700 to-gray-800"
        } hover:scale-105 hover:shadow-xl transition-all duration-200 ease-out`}
    >
      {favoriteIndex !== undefined && (
        <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center text-white/75 text-sm font-medium">
            {favoriteIndex + 1}
          </div>
        </div>
      )}

      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`absolute top-0 left-0 w-8 h-8 flex items-center justify-center rounded-bl-xl transition-all duration-200 z-20 cursor-pointer
          ${isFavorite ? "text-yellow-400" : "text-gray-400 hover:text-white"}`}
        title="Toggle favorite"
      >
        <svg
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          className="w-4 h-4"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </div>

      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleLoop();
        }}
        className={`absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-br-xl transition-all duration-200 z-20 cursor-pointer
          ${
            isLooping
              ? "bg-white/30 text-white"
              : "text-gray-400 hover:bg-gray-600/80 hover:text-white"
          }`}
        title="Toggle loop"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            d="M17 3L21 7M21 7L17 11M21 7H7C4.79086 7 3 8.79086 3 11V13M7 21L3 17M3 17L7 13M3 17H17C19.2091 17 21 15.2091 21 13V11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isUsed && (
        <div
          className="absolute inset-0 bg-white/30 h-full"
          style={{
            right: `${100 - progress}%`,
            transition: "right 100ms linear",
          }}
        />
      )}

      <span className="text-4xl filter drop-shadow-md relative z-10 mb-2">
        {effect.icon}
      </span>
      <span className="text-white/90 text-sm font-medium relative z-10">
        {effect.label}
      </span>
    </button>
  );
}
