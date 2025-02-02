import { Sound } from "@prisma/client";
import { useRef, useState, useCallback, useEffect } from "react";

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
  const [isInitialized, setIsInitialized] = useState(false);
  const dummyAudioRef = useRef<HTMLAudioElement | null>(null);

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

  const initializeAudio = useCallback(() => {
    if (isInitialized) return;

    const silentAudio = new Audio(
      "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMz//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV"
    );
    silentAudio
      .play()
      .then(() => {
        setIsInitialized(true);
        dummyAudioRef.current = silentAudio;
      })
      .catch(console.error);
  }, [isInitialized]);

  useEffect(() => {
    const handleInteraction = () => {
      initializeAudio();
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, [initializeAudio]);

  const playEffect = useCallback(
    async (effect: Sound) => {
      if (!isInitialized) {
        initializeAudio();
        const checkInitAndPlay = setInterval(() => {
          if (isInitialized) {
            clearInterval(checkInitAndPlay);
          }
        }, 100);
        return;
      }

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
    [
      isPlaying,
      volume,
      isLooping,
      handleEnded,
      updateProgress,
      isInitialized,
      initializeAudio,
    ]
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
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = Math.max(0, Math.min(time, audio.duration));
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

  useEffect(() => {
    return () => {
      if (dummyAudioRef.current) {
        dummyAudioRef.current.remove();
      }
    };
  }, []);

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
    isInitialized,
  };
};
