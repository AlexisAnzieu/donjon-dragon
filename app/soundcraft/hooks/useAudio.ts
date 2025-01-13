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

  const isIOSDevice = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      /iphone|ipad|ipod/.test(userAgent) ||
      (userAgent.includes("chrome") && navigator.platform === "iPhone")
    );
  }, []);

  const initializeAudio = useCallback(
    (effect: Effect) => {
      const audio = new Audio();
      audio.src = effect.src;
      // iOS Chrome requires these settings
      audio.preload = "none";
      audio.load();
      audioRefs.current[effect.id] = audio;
      setIsLoaded((prev) => ({ ...prev, [effect.id]: true }));

      audio.addEventListener("timeupdate", () =>
        updateProgress(effect.id, audio)
      );
      audio.addEventListener("ended", () => handleEnded(effect.id));
    },
    [updateProgress, handleEnded]
  );

  const playEffect = useCallback(
    (effect: Effect) => {
      initAudioContext();

      // Initialize audio on first play for iOS
      if (!audioRefs.current[effect.id]) {
        initializeAudio(effect);
      }

      const audio = audioRefs.current[effect.id];
      if (!audio) return;

      if (isUsed[effect.id]) {
        audio.pause();
        audio.currentTime = 0;
        setIsUsed((prev) => ({ ...prev, [effect.id]: false }));
        setProgress((prev) => ({ ...prev, [effect.id]: 0 }));
      } else {
        // Set properties before attempting to play
        audio.volume = volume[effect.id] ?? effect.volume ?? 1;
        audio.loop = isLooping[effect.id];
        audio.currentTime = 0;

        // Force load for iOS Chrome
        if (isIOSDevice()) {
          audio.load();
        }

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying((prev) => ({ ...prev, [effect.id]: true }));
              setIsUsed((prev) => ({ ...prev, [effect.id]: true }));
              setTimeout(() => {
                setIsPlaying((prev) => ({ ...prev, [effect.id]: false }));
              }, 200);
            })
            .catch((error) => {
              console.error("Playback failed:", error);
              // Special handling for iOS
              if (isIOSDevice()) {
                audio.load();
                setTimeout(() => {
                  audio
                    .play()
                    .catch((e) => console.error("iOS retry failed:", e));
                }, 100);
              }
            });
        }
      }
    },
    [isUsed, volume, isLooping, initAudioContext, initializeAudio, isIOSDevice]
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
    // Initialize audio context on any user interaction for iOS
    const handleUserGesture = () => {
      initAudioContext();
      if (!isIOSDevice()) {
        effects.forEach(initializeAudio);
      }
      document.removeEventListener("touchstart", handleUserGesture);
      document.removeEventListener("click", handleUserGesture);
    };

    document.addEventListener("touchstart", handleUserGesture);
    document.addEventListener("click", handleUserGesture);

    return () => {
      document.removeEventListener("touchstart", handleUserGesture);
      document.removeEventListener("click", handleUserGesture);
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [effects, initializeAudio, initAudioContext, isIOSDevice]);

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
