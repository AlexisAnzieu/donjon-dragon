"use client";
import { useMemo, useState, useEffect } from "react";
import { effects, EffectCategory } from "./effects";
import { useAudio } from "./hooks/useAudio";
import { EffectButton } from "./components/EffectButton";
import { VolumeSlider } from "./components/VolumeSlider";

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
  } = useAudio(effects);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (effectId: string) => {
    setFavorites((prev) => {
      if (prev.includes(effectId)) {
        return prev.filter((id) => id !== effectId);
      }
      if (prev.length >= 9) return prev;
      return [...prev, effectId];
    });
  };

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

  const effectsByCategory = useMemo(() => {
    const filteredEffects = effects.filter(
      (effect) =>
        effect.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        effect.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredEffects.reduce((acc, effect) => {
      if (!acc[effect.category]) {
        acc[effect.category] = [];
      }
      acc[effect.category].push(effect);
      return acc;
    }, {} as Record<EffectCategory, typeof effects>);
  }, [searchTerm]);

  const renderEffectItem = (
    effect: (typeof effects)[0],
    favoriteIndex?: number
  ) => (
    <div key={effect.id} className="space-y-3">
      <EffectButton
        effect={effect}
        isPlaying={isPlaying[effect.id]}
        isUsed={isUsed[effect.id]}
        progress={progress[effect.id] || 0}
        isLooping={isLooping[effect.id]}
        isFavorite={favorites.includes(effect.id)}
        favoriteIndex={favoriteIndex}
        onPlay={() => playEffect(effect)}
        onToggleFavorite={() => toggleFavorite(effect.id)}
        onToggleLoop={() => toggleLoop(effect.id)}
      />
      <VolumeSlider
        effectId={effect.id}
        volume={volume[effect.id] ?? effect.volume ?? 1}
        onChange={setEffectVolume}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8 rounded-2xl bg-gray-800/50 p-8 backdrop-blur-sm shadow-2xl">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          VFX Triggers
        </h1>

        {favorites.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white/90 border-b border-white/10 pb-2">
              Favorites (Press 1-9 to play)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {favorites.map((id, index) => {
                const effect = effects.find((e) => e.id === id)!;
                return renderEffectItem(effect, index);
              })}
            </div>
          </div>
        )}

        <input
          type="text"
          placeholder="Search effects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
        />

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
                    favorites.includes(effect.id)
                      ? favorites.indexOf(effect.id)
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
