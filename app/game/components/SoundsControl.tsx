"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useAudio } from "@/app/soundcraft/hooks/useAudio";
import { EffectButton } from "@/app/soundcraft/components/EffectButton";
import { useFavorites } from "../context/BoardContext";
import { searchFreesound } from "@/app/services/freesound";
import { Sound } from "@prisma/client";

interface SoundsControlProps {
  onClose: () => void;
}

export function SoundsControl({ onClose }: SoundsControlProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { favorites, toggleFavorite } = useFavorites();
  const {
    isPlaying,
    isUsed,
    progress,
    volume,
    playEffect,
    setEffectVolume,
    isLooping,
    toggleLoop,
    stopAllSounds,
  } = useAudio([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [effects, setEffects] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      if (key >= "1" && key <= "9") {
        const index = parseInt(key) - 1;
        if (index < favorites.length) {
          const effect = effects.find((e) => e.id === favorites[index].id)!;
          playEffect(effect);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [favorites, playEffect, effects]);

  const handleClose = useCallback(() => {
    stopAllSounds();
    onClose();
  }, [stopAllSounds, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsLoading(true);
        const results = await searchFreesound(searchTerm);
        setEffects(results);
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(searchTimer);
  }, [searchTerm]);

  const effectsByCategory = useMemo(() => {
    return effects.reduce((acc, effect) => {
      if (!acc[effect.category]) {
        acc[effect.category] = [];
      }
      acc[effect.category].push(effect);
      return acc;
    }, {} as Record<string, Sound[]>);
  }, [effects]);

  const handleToggleFavorite = (effect: Sound) => {
    toggleFavorite(effect);
  };

  const renderEffectItem = (effect: Sound, favoriteIndex?: number) => (
    <div key={effect.id} className="space-y-3">
      <EffectButton
        volume={volume[effect.id] ?? effect.volume ?? 1}
        onVolumeChange={setEffectVolume}
        effect={effect}
        isPlaying={isPlaying[effect.id]}
        isUsed={isUsed[effect.id]}
        progress={progress[effect.id] || 0}
        isLooping={isLooping[effect.id]}
        isFavorite={favorites.map((f) => f.id).includes(effect.id)}
        favoriteIndex={favoriteIndex}
        onPlay={() => playEffect(effect)}
        onToggleFavorite={() => handleToggleFavorite(effect)}
        onToggleLoop={() => toggleLoop(effect.id)}
      />
    </div>
  );

  return (
    <div
      className="bg-gray-800/90 rounded-lg p-4 w-full max-h-[80vh] overflow-y-auto max-w-3xl mx-auto relative"
      ref={modalRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-white/60 hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg p-1"
        aria-label="Close sound controls"
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClose();
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="relative">
        <input
          type="text"
          placeholder="Search sounds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 mb-6"
        />
        {isLoading && (
          <div className="absolute right-3 top-2">
            <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
          </div>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-white/90 border-b border-white/10 pb-2">
            Favorites
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {favorites.map((effect, index) => renderEffectItem(effect, index))}
          </div>
        </div>
      )}

      {Object.entries(effectsByCategory).map(([category, categoryEffects]) => (
        <div key={category} className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-white/90 border-b border-white/10 pb-2">
            {category}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categoryEffects.map((effect) =>
              renderEffectItem(
                effect,
                favorites.some((f) => f.id === effect.id)
                  ? favorites.findIndex((f) => f.id === effect.id)
                  : undefined
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
