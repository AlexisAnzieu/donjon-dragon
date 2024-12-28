import { useState, useEffect, useCallback } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenActive = !!document.fullscreenElement;
      setIsFullscreen(isFullscreenActive);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const gameBoard = document.querySelector(".game-board");
    if (!gameBoard) return;

    if (!document.fullscreenElement) {
      gameBoard.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  return {
    isFullscreen,
    toggleFullscreen,
  };
}
