import { useCallback, useRef, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import PartySocket from "partysocket";

interface UseFogOfWarProps {
  sessionId: string;
  initialFogData: string | null;
  ws: PartySocket;
  isPublic: boolean;
}

export const useFogOfWar = ({
  sessionId,
  initialFogData,
  ws,
  isPublic,
}: UseFogOfWarProps) => {
  const [isDrawingFog, setIsDrawingFog] = useState(false);
  const [isFogControlActive, setIsFogControlActive] = useState(false);
  const [brushSize, setBrushSize] = useState(50);
  const [isAutoClearEnabled, setIsAutoClearEnabled] = useState(false);
  const [fogData, setFogData] = useState<string | null>(initialFogData);

  const fogCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const initializeFogCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (initialFogData) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = initialFogData;
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    },
    [initialFogData]
  );

  const updateFogCanvas = useCallback((fogData: string) => {
    if (!fogData) return;

    const canvas = fogCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = fogData;
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveFogOfWar = useCallback(
    debounce(async (dataUrl: string) => {
      try {
        await fetch(`/api/sessions?id=${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fogOfWar: dataUrl }),
        });
      } catch (error) {
        console.error("Error saving fog of war:", error);
      }
    }, 1000),
    [sessionId]
  );

  const drawFog = useCallback(
    (e: MouseEvent, canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

      ctx.globalCompositeOperation = isDrawingFog
        ? "source-over"
        : "destination-out";
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();

      setFogData(canvas.toDataURL());
    },
    [isDrawingFog, brushSize]
  );

  const startDrawing = useCallback(
    (e: MouseEvent) => {
      if (!isFogControlActive || !fogCanvasRef.current) return;

      isDrawingRef.current = true;
      drawFog(e, fogCanvasRef.current);
    },
    [isFogControlActive, drawFog]
  );

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDrawingRef.current || !fogCanvasRef.current) return;
      drawFog(e, fogCanvasRef.current);
    },
    [drawFog]
  );

  // Add resize observer logic
  useEffect(() => {
    const canvas = fogCanvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        initializeFogCanvas(canvas);
      }
    });

    resizeObserver.observe(canvas.parentElement as Element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [initializeFogCanvas]);

  const resetFog = useCallback(() => {
    const canvas = fogCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "black";
    ctx.globalCompositeOperation = "source-over";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setFogData(canvas.toDataURL());
  }, [setFogData]);

  const clearFogAroundPoint = useCallback(
    (x: number, y: number, radius: number = 15) => {
      const canvas = fogCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Convert percentage coordinates to canvas coordinates
      const canvasX = (x / 100) * canvas.width;
      const canvasY = (y / 100) * canvas.height;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
      ctx.fill();

      setFogData(canvas.toDataURL());
    },
    [setFogData]
  );

  const handleFogMouseDown = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target !== fogCanvasRef.current) return;
      if (isFogControlActive) {
        startDrawing(e);
      }
    },
    [isFogControlActive, startDrawing]
  );

  const handleFogMouseMove = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target !== fogCanvasRef.current) return;
      if (isFogControlActive) {
        handleMouseMove(e);
      }
    },
    [isFogControlActive, handleMouseMove]
  );

  const handleFogMouseUp = useCallback(() => {
    if (isFogControlActive) {
      stopDrawing();
    }
  }, [isFogControlActive, stopDrawing]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isFogControlActive) return;
      e.preventDefault();

      const delta = e.deltaY * -0.1;
      setBrushSize(
        (prevSize) => +Math.min(Math.max(prevSize + delta, 1), 500).toFixed(2)
      );
    },
    [isFogControlActive]
  );

  useEffect(() => {
    if (isPublic) return;

    if (isFogControlActive) {
      document.addEventListener("mousedown", handleFogMouseDown);
      document.addEventListener("mousemove", handleFogMouseMove);
      document.addEventListener("mouseup", handleFogMouseUp);
      document.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener("mousedown", handleFogMouseDown);
      document.removeEventListener("mousemove", handleFogMouseMove);
      document.removeEventListener("mouseup", handleFogMouseUp);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [
    isPublic,
    isFogControlActive,
    handleFogMouseDown,
    handleFogMouseMove,
    handleFogMouseUp,
    handleWheel,
  ]);

  useEffect(() => {
    if (!isFogControlActive && fogData) {
      saveFogOfWar(fogData);
      ws.send(
        JSON.stringify({
          type: "FOG_UPDATE",
          payload: { fogData },
        })
      );
    }
  }, [isFogControlActive, ws, saveFogOfWar, fogData]);

  return {
    fogCanvasRef,
    isDrawingFog,
    setIsDrawingFog,
    isFogControlActive,
    setIsFogControlActive,
    brushSize,
    setBrushSize,
    initializeFogCanvas,
    startDrawing,
    stopDrawing,
    handleMouseMove,
    resetFog,
    clearFogAroundPoint,
    isAutoClearEnabled,
    setIsAutoClearEnabled,
    setFogData,
    updateFogCanvas,
  };
};
