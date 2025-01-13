"use client";
import { useMemo, useState } from "react";
import { effects, EffectCategory } from "./effects";
import { useAudio } from "./hooks/useAudio";

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
    isLoaded,
  } = useAudio(effects);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8 rounded-2xl bg-gray-800/50 p-8 backdrop-blur-sm shadow-2xl">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          VFX Triggers
        </h1>

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
                {categoryEffects.map((effect) => (
                  <div key={effect.id} className="space-y-3">
                    <button
                      onClick={() => playEffect(effect)}
                      disabled={!isLoaded[effect.id]}
                      className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center relative overflow-hidden
                        ${
                          !isLoaded[effect.id]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                        ${
                          isPlaying[effect.id]
                            ? "bg-gradient-to-b from-gray-600 to-gray-700 ring-2 ring-white/30"
                            : "bg-gradient-to-b from-gray-700 to-gray-800"
                        } 
                        hover:scale-105 hover:shadow-xl transition-all duration-200 ease-out`}
                    >
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLoop(effect.id);
                        }}
                        className={`absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-br-xl transition-all duration-200 z-20 cursor-pointer
                          ${
                            isLooping[effect.id]
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
                      {isUsed[effect.id] && (
                        <div
                          className="absolute inset-0 bg-white/30 h-full"
                          style={{
                            right: `${100 - (progress[effect.id] || 0)}%`,
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
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume[effect.id] ?? effect.volume ?? 1}
                        onChange={(e) =>
                          setEffectVolume(effect.id, Number(e.target.value))
                        }
                        className="w-full appearance-none h-1.5 rounded-full bg-gray-700 accent-white/75 hover:accent-white transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
