"use client";
import { useEffect, useState } from "react";
import { useAudio } from "@/app/soundcraft/hooks/useAudio";
import { EffectButton } from "@/app/soundcraft/components/EffectButton";
import { useSoundLibraries } from "../context/BoardContext";
import { SoundsControl } from "./SoundsControl";
import { Sound } from "@prisma/client";

export function FavoriteSounds() {
  const {
    soundLibraries,
    toggleFavorite,
    loadSoundLibraries,
    updateSoundLabel,
  } = useSoundLibraries();
  const [favoriteEffects, setFavoriteEffects] = useState<Sound[]>([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [effectToRename, setEffectToRename] = useState<Sound | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const {
    isPlaying,
    isUsed,
    progress,
    volume,
    playEffect,
    setEffectVolume,
    isLooping,
    toggleLoop,
  } = useAudio([]);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    effectId: string;
  } | null>(null);

  useEffect(() => {
    loadSoundLibraries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFavoriteEffects(
      soundLibraries.filter((f) => f.isDefault)[0]?.sounds ?? []
    );
  }, [soundLibraries]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Skip if target is an input element
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key;
      if (key >= "1" && key <= "9") {
        const index = parseInt(key) - 1;
        if (index < favoriteEffects.length) {
          playEffect(favoriteEffects[index]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [favoriteEffects, playEffect]);

  const handleRename = (effect: Sound) => {
    setEffectToRename(effect);
    setNewLabel(effect.label);
    setShowRenameModal(true);
    setContextMenu(null);
  };

  const saveLabel = async () => {
    if (effectToRename && newLabel.trim()) {
      await updateSoundLabel(effectToRename.cid, newLabel.trim());
    }
    setShowRenameModal(false);
    setEffectToRename(null);
    setNewLabel("");
  };

  const renderEffectItem = (effect: Sound, favoriteIndex: number) => (
    <div key={effect.id} className="flex items-center gap-2">
      <span className="text-white/50 w-4">{favoriteIndex + 1}</span>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            effectId: effect.id,
          });
        }}
        onWheel={(e) => {
          e.preventDefault();
          const currentVolume = volume[effect.id] ?? effect.volume ?? 1;
          const delta = e.deltaY > 0 ? -0.03 : 0.03;
          const newVolume = Math.max(0, Math.min(1, currentVolume + delta));
          setEffectVolume(effect.id, newVolume);
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
          {soundLibraries.filter((f) => f.isDefault)[0]?.name}
        </h2>
        <div className="space-y-3">
          {favoriteEffects.map((effect, index) =>
            renderEffectItem(effect, index)
          )}
          {favoriteEffects.length < 9 && (
            <div className="flex items-center gap-2">
              <span className="text-white/50 w-4">
                {favoriteEffects.length + 1}
              </span>
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
              const effect = favoriteEffects.find(
                (effect) => effect.id === contextMenu.effectId
              );
              if (effect) handleRename(effect);
            }}
          >
            Rename
          </button>
          <button
            className="w-full px-4 py-2 text-left text-white/90 hover:bg-gray-700"
            onClick={() => {
              const effect = favoriteEffects.find(
                (effect) => effect.id === contextMenu.effectId
              );
              if (effect) {
                toggleFavorite(
                  effect,
                  soundLibraries.filter((s) => s.isDefault)[0].id
                );
              }
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
            <SoundsControl
              onClose={() => setShowSoundModal(false)}
              soundLibrary={soundLibraries.filter((s) => s.isDefault)[0]}
            />
          </div>
        </div>
      )}

      {showRenameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-4 w-80">
            <h3 className="text-lg font-semibold text-white/90 mb-4">
              Rename Sound
            </h3>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 text-white/90 hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveLabel}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
