import { Sound } from "@prisma/client";

interface EffectButtonProps {
  effect: Sound;
  isPlaying: boolean;
  isUsed: boolean;
  progress: number;
  isLooping: boolean;
  isFavorite: boolean;
  size?: "small" | "medium" | "large" | "line";
  onPlay: () => void;
  onToggleFavorite?: () => void;
  onToggleLoop: () => void;
  volume: number;
  onVolumeChange: (effectId: string, volume: number) => void;
  favoriteIndex?: number;
  onTimeSet?: (time: number) => void;
  onStop?: () => void;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function EffectButton({
  effect,
  isPlaying,
  isUsed,
  progress,
  isLooping,
  isFavorite,
  size = "medium",
  onPlay,
  onToggleFavorite,
  onToggleLoop,
  volume,
  onVolumeChange,
  favoriteIndex,
  onTimeSet,
  onStop,
}: EffectButtonProps) {
  const sizeClasses = {
    small: {
      button: "w-16",
      icon: "w-6 h-6",
      controls: "w-6 h-6",
      iconText: "text-2xl",
      label: "text-xs",
      favorite: "text-sm",
      volume: "h-1",
    },
    medium: {
      button: "w-full",
      icon: "w-8 h-8",
      controls: "w-8 h-8",
      iconText: "text-4xl",
      label: "text-sm",
      favorite: "text-sm",
      volume: "h-1.5",
    },
    large: {
      button: "w-full",
      icon: "w-10 h-10",
      controls: "w-10 h-10",
      iconText: "text-5xl",
      label: "text-base",
      favorite: "text-base",
      volume: "h-2",
    },
    line: {
      button: "w-full",
      icon: "w-8 h-8",
      controls: "w-8 h-8",
      iconText: "text-4xl",
      label: "text-sm",
      favorite: "text-sm",
      volume: "h-1.5",
    },
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (size === "line") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const time = effect.duration * percentage;
      onTimeSet?.(time);
      if (!isPlaying) {
        onPlay();
      }
    } else {
      onPlay();
    }
  };

  const handleStopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStop?.();
  };

  return (
    <div
      className={`flex ${
        size === "line" ? "flex-row gap-4 h-[60px]" : "flex-col gap-2"
      } px-3`}
    >
      <button
        onClick={handleButtonClick}
        className={`${sizeClasses[size].button} ${
          size === "line" ? "h-full" : "aspect-square"
        } rounded-xl flex flex-col items-center justify-center relative overflow-hidden
        ${
          isPlaying
            ? "bg-gradient-to-b from-gray-600 to-gray-700 ring-2 ring-white/30"
            : "bg-gradient-to-b from-gray-700 to-gray-800"
        } hover:scale-105 hover:shadow-xl transition-all duration-200 ease-out bg-no-repeat`}
        style={{
          backgroundImage: `url(${effect.waveformUrl})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Only show favorite index and button for medium and large sizes */}
        {favoriteIndex !== undefined && size !== "small" && (
          <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center">
            <div
              className={`w-6 h-6 rounded-full bg-gray-700/50 flex items-center justify-center text-white/75 ${sizeClasses[size].favorite} font-medium`}
            >
              {favoriteIndex + 1}
            </div>
          </div>
        )}

        {size !== "small" && (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite!();
            }}
            className={`absolute top-0 left-0 ${
              sizeClasses[size].controls
            } flex items-center justify-center rounded-bl-xl transition-all duration-200 z-20 cursor-pointer
            ${
              isFavorite ? "text-yellow-400" : "text-gray-400 hover:text-white"
            }`}
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
        )}

        {/* Keep loop button for all sizes */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleLoop();
          }}
          className={`absolute top-0 ${
            size === "small" ? "right-0" : "right-0"
          } ${
            sizeClasses[size].controls
          } flex items-center justify-center rounded-br-xl transition-all duration-200 z-20 cursor-pointer
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
        {/* Label for medium and large sizes at the top */}
        {size !== "small" && (
          <div className="absolute top-8 left-0 right-0 z-10 px-2">
            <span
              className={`text-white/90 ${sizeClasses[size].label} font-medium text-center break-words`}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              title={effect.label}
            >
              {effect.label}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900/70 to-transparent" />
        {/* Label for small size in the center */}
        {size === "small" && (
          <div className="relative z-10 flex-1 flex items-center justify-center p-2">
            <span
              className={`text-white/90 ${sizeClasses[size].label} font-medium text-center break-words`}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: "3",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              title={effect.label}
            >
              {effect.label}
            </span>
          </div>
        )}
        {/* Add duration display for line size */}
        {size === "line" && (
          <div className="absolute bottom-2 right-2 text-xs text-white/75 font-medium px-1.5 py-0.5 bg-black/30 rounded">
            {formatDuration(effect.duration)}
          </div>
        )}
        {/* Replace the button with div for stop control */}
        {size === "line" && isPlaying && (
          <div
            role="button"
            onClick={handleStopClick}
            className="absolute bottom-2 left-2 w-6 h-6 bg-black/30 rounded flex items-center justify-center text-white/75 hover:text-white cursor-pointer z-30"
            title="Stop"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
            </svg>
          </div>
        )}
      </button>
      {size !== "line" && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(effect.id, Number(e.target.value))}
          className={`${sizeClasses[size].button} appearance-none ${sizeClasses[size].volume} rounded-full bg-gray-700 accent-white/75 hover:accent-white transition-all cursor-pointer`}
        />
      )}
    </div>
  );
}
