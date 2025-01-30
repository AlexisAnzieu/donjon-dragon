"use client";
import { useMemo, useState, useEffect } from "react";
import { useAudio } from "./hooks/useAudio";
import { EffectButton } from "./components/EffectButton";
import { searchFreesound } from "@/app/services/freesound";
import { Sound } from "@prisma/client";

export default function VFXTriggers() {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<Sound[]>([]);
  const [dynamicEffects, setDynamicEffects] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = (effect: Sound) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === effect.id)) {
        return prev.filter((f) => f.id !== effect.id);
      }
      if (prev.length >= 9) return prev;
      return [...prev, effect];
    });
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      if (key >= "1" && key <= "9") {
        const index = parseInt(key) - 1;
        if (index < favorites.length) {
          const effect = favorites[index];
          playEffect(effect);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [favorites, playEffect]);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsLoading(true);
        const results = await searchFreesound(searchTerm);
        setDynamicEffects(results);
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(searchTimer);
  }, [searchTerm]);

  const effectsByCategory = useMemo(() => {
    return dynamicEffects.reduce((acc, effect) => {
      if (!acc[effect.category]) {
        acc[effect.category] = [];
      }
      acc[effect.category].push(effect);
      return acc;
    }, {} as Record<string, Sound[]>);
  }, [dynamicEffects]);

  const renderEffectItem = (effect: Sound, favoriteIndex?: number) => (
    <div key={effect.id} className="space-y-3">
      <EffectButton
        size="large"
        effect={effect}
        isPlaying={isPlaying[effect.id]}
        isUsed={isUsed[effect.id]}
        progress={progress[effect.id] || 0}
        isLooping={isLooping[effect.id]}
        favoriteIndex={favoriteIndex}
        onPlay={() => playEffect(effect)}
        onToggleFavorite={() => toggleFavorite(effect)}
        onToggleLoop={() => toggleLoop(effect.id)}
        volume={volume[effect.id] ?? effect.volume ?? 1}
        onVolumeChange={setEffectVolume}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8 rounded-2xl bg-gray-800/50 p-8 backdrop-blur-sm shadow-2xl">
        <h1 className="text-3xl font-bold text-white tracking-tight">Sounds</h1>

        {favorites.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white/90 border-b border-white/10 pb-2">
              Favorites (Press 1-9 to play)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {favorites.map((effect, index) =>
                renderEffectItem(effect, index)
              )}
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            placeholder="Search sounds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          {isLoading && (
            <div className="absolute right-3 top-2">
              <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
            </div>
          )}
        </div>

        {Object.entries(effectsByCategory).map(
          ([category, categoryEffects]) => (
            <div key={category} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white/90 border-b border-white/10 pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
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
          )
        )}
      </div>
    </div>
  );
}
