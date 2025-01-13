import { useRef, useState, useCallback, useEffect } from "react";
import type { Effect } from "../effects";

export const useAudio = (effects: Effect[]) => {
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [isUsed, setIsUsed] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState<Record<string, number>>({});
  const [isLooping, setIsLooping] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState<Record<string, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const initializeAttempts = useRef(0);

  const audioContext = useRef<AudioContext>();
  const audioBuffers = useRef<Record<string, AudioBuffer>>({});
  const sourceNodes = useRef<Record<string, AudioBufferSourceNode>>({});
  const gainNodes = useRef<Record<string, GainNode>>({});
  const progressAnimationFrames = useRef<Record<string, number>>({});
  const startTimes = useRef<Record<string, number>>({});

  const updateProgress = useCallback(
    (effectId: string) => {
      if (!audioContext.current || !audioBuffers.current[effectId]) return;

      const currentTime =
        audioContext.current.currentTime - (startTimes.current[effectId] || 0);
      const duration = audioBuffers.current[effectId].duration;
      const percentage = (currentTime / duration) * 100;

      setProgress((prev) => ({
        ...prev,
        [effectId]: Math.min(percentage, 100),
      }));

      if (percentage < 100 && isUsed[effectId]) {
        progressAnimationFrames.current[effectId] = requestAnimationFrame(() =>
          updateProgress(effectId)
        );
      }
    },
    [isUsed]
  );

  const handleEnded = useCallback((effectId: string) => {
    setIsUsed((prev) => ({ ...prev, [effectId]: false }));
    setProgress((prev) => ({ ...prev, [effectId]: 0 }));
  }, []);

  const initializeAudioContext = useCallback(async () => {
    if (initializeAttempts.current > 5) return;
    initializeAttempts.current += 1;

    setIsLoading(true);

    try {
      // Create new context if it doesn't exist or is closed
      if (!audioContext.current || audioContext.current.state === "closed") {
        audioContext.current = new (window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext)();
      }

      // For iOS, create and play a silent buffer
      const silentBuffer = audioContext.current.createBuffer(1, 1, 22050);
      const source = audioContext.current.createBufferSource();
      source.buffer = silentBuffer;
      source.connect(audioContext.current.destination);
      source.start(0);

      // Force resume multiple times
      for (let i = 0; i < 3; i++) {
        await audioContext.current.resume();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Load audio files only after context is running
      if (audioContext.current.state === "running") {
        const bufferPromises = effects.map(async (effect) => {
          try {
            const response = await fetch(effect.src);
            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.current!.decodeAudioData(
              arrayBuffer
            );
            audioBuffers.current[effect.id] = audioBuffer;
            setIsLoaded((prev) => ({ ...prev, [effect.id]: true }));
          } catch (error) {
            console.error(`Failed to load audio: ${effect.id}`, error);
          }
        });

        await Promise.all(bufferPromises);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Audio initialization failed:", error);
      setTimeout(() => initializeAudioContext(), 500);
    } finally {
      setIsLoading(false);
    }
  }, [effects]);

  const playEffect = useCallback(
    (effect: Effect) => {
      if (!audioContext.current || !audioBuffers.current[effect.id]) return;

      // Stop existing playback and progress tracking
      if (sourceNodes.current[effect.id]) {
        sourceNodes.current[effect.id].stop();
        sourceNodes.current[effect.id].disconnect();
        if (progressAnimationFrames.current[effect.id]) {
          cancelAnimationFrame(progressAnimationFrames.current[effect.id]);
        }
      }

      if (isUsed[effect.id]) {
        setIsUsed((prev) => ({ ...prev, [effect.id]: false }));
        setProgress((prev) => ({ ...prev, [effect.id]: 0 }));
        return;
      }

      // Create new nodes
      const source = audioContext.current.createBufferSource();
      const gainNode = audioContext.current.createGain();

      source.buffer = audioBuffers.current[effect.id];
      source.loop = isLooping[effect.id];
      gainNode.gain.value = volume[effect.id] ?? effect.volume ?? 1;

      source.connect(gainNode);
      gainNode.connect(audioContext.current.destination);

      sourceNodes.current[effect.id] = source;
      gainNodes.current[effect.id] = gainNode;

      source.onended = () => {
        handleEnded(effect.id);
        if (progressAnimationFrames.current[effect.id]) {
          cancelAnimationFrame(progressAnimationFrames.current[effect.id]);
        }
      };

      try {
        startTimes.current[effect.id] = audioContext.current.currentTime;
        source.start(0);
        setIsPlaying((prev) => ({ ...prev, [effect.id]: true }));
        setIsUsed((prev) => ({ ...prev, [effect.id]: true }));
        // Start progress tracking
        updateProgress(effect.id);

        setTimeout(() => {
          setIsPlaying((prev) => ({ ...prev, [effect.id]: false }));
        }, 200);
      } catch (error) {
        console.error("Playback failed:", error);
      }
    },
    [isUsed, volume, isLooping, handleEnded, updateProgress]
  );

  const setEffectVolume = useCallback((effectId: string, value: number) => {
    setVolume((prev) => ({ ...prev, [effectId]: value }));
    if (gainNodes.current[effectId]) {
      gainNodes.current[effectId].gain.value = value;
    }
  }, []);

  const toggleLoop = useCallback((effectId: string) => {
    setIsLooping((prev) => ({
      ...prev,
      [effectId]: !prev[effectId],
    }));
  }, []);

  useEffect(() => {
    const initOnInteraction = async (e: Event) => {
      e.preventDefault();
      await initializeAudioContext();
    };

    const options = { capture: true, passive: false };
    document.addEventListener("touchstart", initOnInteraction, options);
    document.addEventListener("touchend", initOnInteraction, options);
    document.addEventListener("click", initOnInteraction, options);

    return () => {
      document.removeEventListener("touchstart", initOnInteraction, options);
      document.removeEventListener("touchend", initOnInteraction, options);
      document.removeEventListener("click", initOnInteraction, options);
      if (audioContext.current) {
        audioContext.current.close();
      }
      Object.values(progressAnimationFrames.current).forEach((frameId) => {
        cancelAnimationFrame(frameId);
      });
    };
  }, [initializeAudioContext]);

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
    isInitialized,
    isLoading,
  };
};
