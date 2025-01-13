import { useRef, useState, useCallback, useEffect } from "react";
import type { Effect } from "../effects";

export const useAudio = (effects: Effect[]) => {
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [isUsed, setIsUsed] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState<Record<string, number>>({});
  const [isLooping, setIsLooping] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState<Record<string, boolean>>({});

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const audioContext = useRef<AudioContext>();

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

  const initAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext)();
    }
    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }
  }, []);

  const playEffect = useCallback(
    (effect: Effect) => {
      initAudioContext();
      const audio = audioRefs.current[effect.id];
      if (!audio || !isLoaded[effect.id]) return;

      if (isUsed[effect.id]) {
        audio.pause();
        audio.currentTime = 0;
        setIsUsed((prev) => ({ ...prev, [effect.id]: false }));
        setProgress((prev) => ({ ...prev, [effect.id]: 0 }));
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audio.currentTime = 0;
              audio.volume = volume[effect.id] ?? effect.volume ?? 1;
              audio.loop = isLooping[effect.id];
              setIsPlaying((prev) => ({ ...prev, [effect.id]: true }));
              setIsUsed((prev) => ({ ...prev, [effect.id]: true }));
              setTimeout(() => {
                setIsPlaying((prev) => ({ ...prev, [effect.id]: false }));
              }, 200);
            })
            .catch((error) => {
              console.error("Playback failed:", error);
            });
        }
      }
    },
    [isUsed, volume, isLooping, isLoaded, initAudioContext]
  );

  const setEffectVolume = useCallback((effectId: string, value: number) => {
    setVolume((prev) => ({ ...prev, [effectId]: value }));
    if (audioRefs.current[effectId]) {
      audioRefs.current[effectId].volume = value;
    }
  }, []);

  const toggleLoop = useCallback((effectId: string) => {
    setIsLooping((prev) => ({
      ...prev,
      [effectId]: !prev[effectId],
    }));
  }, []);

  useEffect(() => {
    effects.forEach((effect) => {
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = effect.src;
      audio.loop = effect.loop ?? false;

      audio.addEventListener("canplaythrough", () => {
        setIsLoaded((prev) => ({ ...prev, [effect.id]: true }));
      });

      audio.addEventListener("timeupdate", () =>
        updateProgress(effect.id, audio)
      );
      audio.addEventListener("ended", () => handleEnded(effect.id));

      audioRefs.current[effect.id] = audio;
    });

    // Initialize loop state for all effects
    const initialLoopState = effects.reduce((acc, effect) => {
      acc[effect.id] = true; // Default to true
      return acc;
    }, {} as Record<string, boolean>);
    setIsLooping(initialLoopState);

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
    isLooping,
    toggleLoop,
    isLoaded,
  };
};
