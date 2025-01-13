import { useRef, useState, useCallback, useEffect } from "react";
import type { Effect } from "../effects";

export const useAudio = (effects: Effect[]) => {
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [isUsed, setIsUsed] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState<Record<string, number>>({});

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const updateProgress = useCallback(
    (effectId: string, audio: HTMLAudioElement) => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress((prev) => ({ ...prev, [effectId]: percentage }));
    },
    []
  );

  const handleEnded = useCallback((effectId: string) => {
    setIsUsed((prev) => ({ ...prev, [effectId]: false }));
    setProgress((prev) => ({ ...prev, [effectId]: 0 }));
  }, []);

  const playEffect = useCallback(
    (effect: Effect) => {
      const audio = audioRefs.current[effect.id];
      if (!audio) return;

      if (isUsed[effect.id]) {
        audio.pause();
        audio.currentTime = 0;
        setIsUsed((prev) => ({ ...prev, [effect.id]: false }));
        setProgress((prev) => ({ ...prev, [effect.id]: 0 }));
      } else {
        audio.currentTime = 0;
        audio.volume = volume[effect.id] ?? effect.volume ?? 1;
        audio.play();
        setIsPlaying((prev) => ({ ...prev, [effect.id]: true }));
        setIsUsed((prev) => ({ ...prev, [effect.id]: true }));
        setTimeout(() => {
          setIsPlaying((prev) => ({ ...prev, [effect.id]: false }));
        }, 200);
      }
    },
    [isUsed, volume]
  );

  const setEffectVolume = useCallback((effectId: string, value: number) => {
    setVolume((prev) => ({ ...prev, [effectId]: value }));
    if (audioRefs.current[effectId]) {
      audioRefs.current[effectId].volume = value;
    }
  }, []);

  useEffect(() => {
    effects.forEach((effect) => {
      const audio = new Audio(effect.src);
      audio.loop = effect.loop ?? false;
      audioRefs.current[effect.id] = audio;

      audio.addEventListener("timeupdate", () =>
        updateProgress(effect.id, audio)
      );
      audio.addEventListener("ended", () => handleEnded(effect.id));
    });

    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [effects, updateProgress, handleEnded]);

  return {
    isPlaying,
    isUsed,
    progress,
    volume,
    playEffect,
    setEffectVolume,
  };
};
