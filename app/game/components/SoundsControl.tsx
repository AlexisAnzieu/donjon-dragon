"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import { useAudio } from "@/app/game/hooks/useAudio";
import { EffectButton } from "@/app/game/components/EffectButton";
import { useSoundLibraries } from "../context/BoardContext";
import { searchFreesound } from "@/lib/freesound";
import { Sound } from "@prisma/client";
import { SoundLibraryWithSounds } from "@/app/game/types/sound";

interface SoundsControlProps {
  onClose: () => void;
  soundLibrary: SoundLibraryWithSounds;
}

export function SoundsControl({ onClose, soundLibrary }: SoundsControlProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { toggleFavorite, toggleFavoriteSound } = useSoundLibraries();
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
    setCurrentTime,
    stopEffect,
  } = useAudio([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [effects, setEffects] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [durationRange, setDurationRange] = useState<[number, number | null]>([
    1,
    null,
  ]);
  const [pageSize, setPageSize] = useState<number>(20);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (term: string, duration: [number, number | null]) => {
      if (term.length >= 2) {
        setIsLoading(true);
        const results = await searchFreesound(
          term,
          duration[0],
          duration[1],
          pageSize
        );
        setEffects(results);
        setIsLoading(false);
      }
    }, 300),
    [pageSize]
  );

  const handleSearchTermChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      debouncedSearch(term, durationRange);
    },
    [debouncedSearch, durationRange]
  );

  const handleDurationRangeChange = useCallback(
    (values: [number, number | null]) => {
      setDurationRange(values);
      debouncedSearch(searchTerm, values);
    },
    [debouncedSearch, searchTerm]
  );

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
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const effectsByCategory = useMemo(() => {
    const grouped = effects.reduce((acc, effect) => {
      if (!acc[effect.category]) {
        acc[effect.category] = [];
      }
      acc[effect.category].push(effect);
      return acc;
    }, {} as Record<string, Sound[]>);

    // Sort categories by number of sounds in descending order
    return Object.fromEntries(
      Object.entries(grouped).sort(([, a], [, b]) => b.length - a.length)
    );
  }, [effects]);

  const renderEffectItem = (effect: Sound, favoriteIndex?: number) => (
    <div key={effect.id} className="space-y-3">
      <div>
        <EffectButton
          volume={volume[effect.id] ?? effect.volume ?? 1}
          onVolumeChange={setEffectVolume}
          effect={effect}
          isPlaying={isPlaying[effect.id]}
          isUsed={isUsed[effect.id]}
          progress={progress[effect.id] || 0}
          isLooping={isLooping[effect.id]}
          favoriteIndex={favoriteIndex}
          onPlay={() => playEffect(effect)}
          onToggleFavorite={() => toggleFavorite(effect, soundLibrary.id)}
          onToggleLoop={() => toggleLoop(effect.id)}
          onTimeSet={(time) => setCurrentTime(effect.id, time)}
          size="line"
          onStop={() => stopEffect(effect.id)}
          onFavoriteClick={() => toggleFavoriteSound(effect)}
        />
      </div>
    </div>
  );

  return (
    <div
      className="bg-gray-800/90 backdrop-blur-sm rounded-xl w-full flex flex-col overflow-hidden border border-white/10 shadow-2xl max-h-[90vh] my-auto"
      ref={modalRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gray-800/95 px-6 py-4 border-b border-white/10 backdrop-blur-sm z-10 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white/90">
          {soundLibrary.name} Library
        </h1>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Library Section */}
        <div className="w-80 bg-gray-900/50 overflow-y-auto border-r border-white/10">
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold text-white/90 sticky top-0 bg-gray-900/95 py-2 -mt-2 mb-4">
              Current Sounds
            </h2>
            <div className="space-y-3">
              {soundLibrary.sounds.map((effect, index) =>
                renderEffectItem(effect, index)
              )}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-gray-800/95 p-4 border-b border-white/10 flex-shrink-0">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sounds..."
                  value={searchTerm}
                  onChange={(e) => handleSearchTermChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                {isLoading && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 bg-gray-700/50 p-3 rounded-lg">
                <label className="text-white/90 whitespace-nowrap">
                  Duration (seconds):
                </label>
                <input
                  type="number"
                  min={1}
                  max={299}
                  value={durationRange[0]}
                  onChange={(e) =>
                    handleDurationRangeChange([
                      Number(e.target.value),
                      durationRange[1],
                    ])
                  }
                  className="w-20 px-2 py-1 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <span className="text-white/90">to</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={durationRange[0] + 1}
                    value={durationRange[1] ?? ""}
                    placeholder="∞"
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? null : Number(e.target.value);
                      handleDurationRangeChange([durationRange[0], value]);
                    }}
                    className="w-20 px-2 py-1 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <label className="text-white/90 whitespace-nowrap">
                    Results:
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const newSize = Number(e.target.value);
                      setPageSize(newSize);
                      debouncedSearch(searchTerm, durationRange);
                    }}
                    className="w-24 px-2 py-1 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {effects.length === 0 && searchTerm.length >= 2 && !isLoading ? (
              <div className="text-center text-white/70 py-8">
                {' No sounds found for "{searchTerm}"'}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(effectsByCategory).map(
                  ([category, categoryEffects]) => (
                    <div key={category} className="space-y-3">
                      <h2 className="text-lg font-semibold text-white/90 border-b border-white/10 pb-2 sticky top-0 bg-gray-800/95 z-10">
                        {category}
                      </h2>
                      <div className="space-y-2">
                        {categoryEffects.map((effect) =>
                          renderEffectItem(effect)
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
