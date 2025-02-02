"use client";
import { useEffect, useState } from "react";
import { useAudio } from "@/app/soundcraft/hooks/useAudio";
import { EffectButton } from "@/app/soundcraft/components/EffectButton";
import { useSoundLibraries } from "../context/BoardContext";
import { useLightPresets } from "../context/LightContext";
import { SoundsControl } from "./SoundsControl";
import { Sound } from "@prisma/client";
import { useMidi } from "../context/MidiContext";
import { LightButton } from "./LightButton";
import { sendColorCommand } from "@/lib/lifx";

export function FavoriteEffects() {
  const { lightPresets, loadLightPresets } = useLightPresets();
  const [isLoading, setIsLoading] = useState(true);
  const {
    soundLibraries,
    loadSoundLibraries,
    updateSoundLabel,
    toggleFavoriteSound, // Add this import
  } = useSoundLibraries();
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>("");
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
  const { bindings, currentSignal, isAssigning } = useMidi();
  const [mode, setMode] = useState<"sounds" | "lights">("sounds");

  useEffect(() => {
    const loadLibraries = async () => {
      await loadSoundLibraries();
      setIsLoading(false);
    };
    loadLibraries();
    loadLightPresets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (soundLibraries.length > 0 && !selectedLibraryId) {
      const defaultLibrary = soundLibraries.find((lib) => lib.isDefault);
      if (defaultLibrary) {
        setSelectedLibraryId(defaultLibrary.id);
      }
    }
  }, [soundLibraries, selectedLibraryId]);

  useEffect(() => {
    if (!selectedLibraryId) return;

    const selectedLibrary = soundLibraries.find(
      (lib) => lib.id === selectedLibraryId
    );

    if (selectedLibrary) {
      const favorites = selectedLibrary.sounds.filter((s) => s.isFavorite);
      setFavoriteEffects(favorites);
    }
  }, [soundLibraries, selectedLibraryId]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Skip if target is any form input element
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      const key = event.key;
      if (key >= "1" && key <= "9") {
        const index = parseInt(key) - 1;
        if (mode === "sounds" && index < favoriteEffects.length) {
          playEffect(favoriteEffects[index]);
        } else if (mode === "lights" && index < lightPresets.length) {
          const light = lightPresets[index];
          sendColorCommand(light.color, light.brightness);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [favoriteEffects, playEffect, mode, lightPresets]);

  useEffect(() => {
    if (soundLibraries.length > 0) {
      const lastLibrary = soundLibraries[soundLibraries.length - 1];
      if (lastLibrary) {
        setSelectedLibraryId(lastLibrary.id);
      }
    }
  }, [soundLibraries]);

  useEffect(() => {
    if (!currentSignal || !favoriteEffects.length || isAssigning) return;

    const binding = bindings.find((b) => b.signal === currentSignal);
    if (binding && binding.index < favoriteEffects.length) {
      playEffect(favoriteEffects[binding.index]);
    }
  }, [currentSignal, bindings, favoriteEffects, playEffect, isAssigning]);

  useEffect(() => {
    const handleCtrlPress = (event: KeyboardEvent) => {
      if (event.key === "Control") {
        setMode((prev) => (prev === "sounds" ? "lights" : "sounds"));
      }
    };

    window.addEventListener("keydown", handleCtrlPress);
    return () => window.removeEventListener("keydown", handleCtrlPress);
  }, []);

  const handleRename = (effect: Sound) => {
    setEffectToRename(effect);
    setNewLabel(effect.label);
    setShowRenameModal(true);
    setContextMenu(null);
  };

  const saveLabel = async () => {
    if (effectToRename && newLabel.trim()) {
      await updateSoundLabel(effectToRename, newLabel.trim());
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
          onPlay={() => playEffect(effect)}
          onToggleLoop={() => toggleLoop(effect.id)}
          volume={volume[effect.id] ?? effect.volume ?? 1}
          onVolumeChange={setEffectVolume}
        />
      </div>
    </div>
  );

  const renderLibraryControls = () => (
    <div className="flex flex-wrap gap-1">
      {soundLibraries.map((library) => (
        <button
          key={library.id}
          onClick={() => setSelectedLibraryId(library.id)}
          className={`
            px-1.5 py-0.5 rounded-full text-[10px] font-medium
            transition-all duration-150 ease-in-out
            ${
              selectedLibraryId === library.id
                ? "bg-blue-500 text-white ring-1 ring-blue-400"
                : "bg-gray-700/50 text-white/70 hover:bg-gray-700 hover:text-white/90"
            }
          `}
        >
          {library.name}
        </button>
      ))}
    </div>
  );

  const renderControls = () => (
    <div className="relative mb-5">
      <div className="text-[9px] text-white/40 mb-2 text-center">
        [Press Ctrl key]
      </div>
      <div
        className={`
          w-full h-7 bg-gray-700/50 rounded-full p-0.5
          flex items-center cursor-pointer
          transition-colors duration-200
        `}
        onClick={() => setMode(mode === "sounds" ? "lights" : "sounds")}
      >
        <div
          className={`
            absolute h-6 w-[calc(50%-2px)] bg-blue-500 rounded-full
            transition-transform duration-300 ease-in-out
            ${
              mode === "lights"
                ? "translate-x-[calc(100%+2px)]"
                : "translate-x-0"
            }
          `}
        />
        <div className="relative flex w-full">
          <div
            className={`
            flex-1 flex items-center justify-center z-10
            text-[10px] font-medium transition-colors duration-200
            ${mode === "sounds" ? "text-white" : "text-white/50"}
          `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className={`
            flex-1 flex items-center justify-center z-10
            text-[10px] font-medium transition-colors duration-200
            ${mode === "lights" ? "text-white" : "text-white/50"}
          `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (mode === "sounds") {
      return (
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
      );
    }

    return (
      <div className="space-y-3">
        {lightPresets.map((light, index) => (
          <div key={light.id} className="flex items-center gap-2">
            <span className="text-white/50 w-4">{index + 1}</span>
            <LightButton
              name={light.name}
              color={light.color}
              brightness={light.brightness}
              size="normal"
              onActivate={() => sendColorCommand(light.color, light.brightness)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-800/90 rounded-lg p-3 w-32">
        <div className="mb-3 border-b border-white/10 pb-1">
          {isLoading ? (
            <div className="w-full h-7 bg-gray-700 rounded animate-pulse" />
          ) : (
            <div className="space-y-2">
              {renderControls()}
              {mode === "sounds" && renderLibraryControls()}
            </div>
          )}
        </div>
        {renderContent()}
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
                toggleFavoriteSound(effect);
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
          <div className="w-[90vw] max-w-5xl">
            <SoundsControl
              onClose={() => setShowSoundModal(false)}
              soundLibrary={
                soundLibraries.find((s) => s.id === selectedLibraryId)!
              }
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
