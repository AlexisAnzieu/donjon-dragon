import { Sound } from "@prisma/client";
import { useRef, useState, useCallback } from "react";

export const useAudio = (effects: Sound[]) => {
  const initialLoopState = effects.reduce((acc, effect) => {
    acc[effect.id] = effect.loop ?? false;
    return acc;
  }, {} as Record<string, boolean>);

  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [isUsed, setIsUsed] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState<Record<string, number>>({});
  const [isLooping, setIsLooping] =
    useState<Record<string, boolean>>(initialLoopState);

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const updateProgress = useCallback(
    (effectId: string, audio: HTMLAudioElement) => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress((prev) => ({
        ...prev,
        [effectId]: Math.min(percentage, 100),
      }));
    },
    []
  );

  const handleEnded = useCallback((effectId: string) => {
    setIsUsed((prev) => ({ ...prev, [effectId]: false }));
    setProgress((prev) => ({ ...prev, [effectId]: 0 }));
    setIsPlaying((prev) => ({ ...prev, [effectId]: false }));
  }, []);

  const playEffect = useCallback(
    async (effect: Sound) => {
      try {
        let audio = audioRefs.current[effect.id];

        if (!audio) {
          audio = new Audio(effect.url);
          audioRefs.current[effect.id] = audio;

          audio.volume = volume[effect.id] ?? effect.volume ?? 1;
          audio.loop = isLooping[effect.id] ?? false;

          audio.addEventListener("timeupdate", () =>
            updateProgress(effect.id, audio)
          );
          audio.addEventListener("ended", () => {
            if (!audio.loop) {
              handleEnded(effect.id);
            }
          });
        }

        if (isPlaying[effect.id]) {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying((prev) => ({ ...prev, [effect.id]: false }));
          setIsUsed((prev) => ({ ...prev, [effect.id]: false }));
        } else {
          await audio.play();
          setIsPlaying((prev) => ({ ...prev, [effect.id]: true }));
          setIsUsed((prev) => ({ ...prev, [effect.id]: true }));
        }
      } catch (error) {
        console.error("Error playing sound:", error);
        setIsPlaying((prev) => ({ ...prev, [effect.id]: false }));
      }
    },
    [isPlaying, volume, isLooping, handleEnded, updateProgress]
  );

  const setEffectVolume = useCallback((effectId: string, value: number) => {
    setVolume((prev) => ({ ...prev, [effectId]: value }));
    if (audioRefs.current[effectId]) {
      audioRefs.current[effectId].volume = value;
    }
  }, []);

  const toggleLoop = useCallback((effectId: string) => {
    setIsLooping((prev) => {
      const newValue = !prev[effectId];
      if (audioRefs.current[effectId]) {
        audioRefs.current[effectId].loop = newValue;
      }
      return { ...prev, [effectId]: newValue };
    });
  }, []);

  const stopAllSounds = useCallback(() => {
    Object.entries(audioRefs.current).forEach(([effectId, audio]) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        handleEnded(effectId);
      }
    });
  }, [handleEnded]);

  const setCurrentTime = useCallback((effectId: string, time: number) => {
    const audio = audioRefs.current[effectId];
    if (audio) {
      audio.currentTime = Math.min(time, audio.duration);
    }
  }, []);

  const stopEffect = useCallback(
    (effectId: string) => {
      const audio = audioRefs.current[effectId];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        handleEnded(effectId);
      }
    },
    [handleEnded]
  );

  return {
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
  };
};
