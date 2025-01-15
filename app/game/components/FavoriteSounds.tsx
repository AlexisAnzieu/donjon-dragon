"use client";
import { useEffect, useState, useRef } from "react";
import { effects } from "@/app/soundcraft/effects";
import { useAudio } from "@/app/soundcraft/hooks/useAudio";
import { EffectButton } from "@/app/soundcraft/components/EffectButton";
import { useFavorites } from "../context/BoardContext";
import { SoundsControl } from "./SoundsControl";

export function FavoriteSounds() {
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
  } = useAudio(effects);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    effectId: string;
  } | null>(null);

  const effectRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      if (key >= "1" && key <= "9") {
        const index = parseInt(key) - 1;
        if (index < favorites.length) {
          const effect = effects.find((e) => e.id === favorites[index])!;
          playEffect(effect);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [favorites, playEffect]);

  useEffect(() => {
    // Set up non-passive wheel event listeners
    favorites.forEach((id) => {
      const element = effectRefs.current.get(id);
      if (element) {
        const handleWheel = (e: WheelEvent) => {
          e.preventDefault();
          const effect = effects.find((e) => e.id === id)!;
          const currentVolume = volume[effect.id] ?? effect.volume ?? 1;
          const delta = e.deltaY > 0 ? -0.03 : 0.03;
          const newVolume = Math.max(0, Math.min(1, currentVolume + delta));
          setEffectVolume(effect.id, newVolume);
        };

        element.addEventListener("wheel", handleWheel, { passive: false });
        return () => element.removeEventListener("wheel", handleWheel);
      }
    });
  }, [favorites, volume, setEffectVolume]);

  const renderEffectItem = (
    effect: (typeof effects)[0],
    favoriteIndex: number
  ) => (
    <div key={effect.id} className="flex items-center gap-2">
      <span className="text-white/50 w-4">{favoriteIndex + 1}</span>
      <div
        ref={(el) => {
          if (el) effectRefs.current.set(effect.id, el);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            effectId: effect.id,
          });
        }}
      >
        <EffectButton
          size="small"
          effect={effect}
          isPlaying={isPlaying[effect.id]}
          isUsed={isUsed[effect.id]}
          progress={progress[effect.id] || 0}
          isLooping={isLooping[effect.id]}
          isFavorite={true}
          onPlay={() => playEffect(effect)}
          onToggleLoop={() => toggleLoop(effect.id)}
          volume={volume[effect.id] ?? effect.volume ?? 1}
          onVolumeChange={setEffectVolume}
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-gray-800/90 rounded-lg p-3 w-full max-w-xs">
        <h2 className="text-lg font-semibold text-white/90 bor5der-b border-white/10 pb-1 mb-3 text-center">
          VFX
        </h2>
        <div className="space-y-3">
          {favorites.map((id, index) => {
            const effect = effects.find((e) => e.id === id)!;
            return renderEffectItem(effect, index);
          })}
          {favorites.length < 9 && (
            <div className="flex items-center gap-2">
              <span className="text-white/50 w-4">{favorites.length + 1}</span>
              <button
                title="Open Sound Library"
                onClick={() => setShowSoundModal(true)}
                className="aspect-square w-16 flex items-center justify-center rounded-lg
                  bg-gradient-to-r from-purple-500/80 to-blue-500/80
                  hover:from-purple-500 hover:to-blue-500
                  transition-all duration-300 ease-in-out
                  text-white/90 hover:text-white
                  border border-white/10 hover:border-white/20
                  shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
          )}
        </div>
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 bg-gray-800 rounded-lg shadow-xl border border-white/10 py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="w-full px-4 py-2 text-left text-white/90 hover:bg-gray-700"
            onClick={() => {
              toggleFavorite(contextMenu.effectId);
              setContextMenu(null);
            }}
          >
            Remove from favorites
          </button>
        </div>
      )}

      {/* Click outside to close context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setContextMenu(null)}
        />
      )}

      {showSoundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-[90vw] max-w-4xl">
            <SoundsControl onClose={() => setShowSoundModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}
