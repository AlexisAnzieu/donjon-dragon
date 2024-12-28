import PartySocket from "partysocket";
import { useState, useCallback, useEffect, RefObject } from "react";
import debounce from "lodash/debounce";

interface ViewState {
  zoom: number;
  position: { x: number; y: number };
}

interface UseBoardViewProps {
  initialViewState?: ViewState;
  isPublic: boolean;
  ws: PartySocket;
  isFogControlActive: boolean;
  boardRef: RefObject<HTMLDivElement>;
  sessionId: string;
}

export function useBoardView({
  initialViewState,
  isPublic,
  ws,
  isFogControlActive,
  boardRef,
  sessionId,
}: UseBoardViewProps) {
  const [zoom, setZoom] = useState(initialViewState?.zoom || 1);
  const [position, setPosition] = useState(
    initialViewState?.position || { x: 0, y: 0 }
  );
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const syncViewState = useCallback(
    debounce(async (viewState: ViewState) => {
      if (isPublic) return;

      try {
        const response = await fetch(`/api/sessions?id=${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ viewState }),
        });

        if (!response.ok) {
          throw new Error("Failed to sync view state");
        }
      } catch (error) {
        console.error("Error syncing view state:", error);
      }
    }, 1000),
    [sessionId, isPublic]
  );

  const updatePanning = useCallback(
    (e: MouseEvent) => {
      if (isPublic) return;
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      const newPosition = {
        x: position.x + deltaX,
        y: position.y + deltaY,
      };

      setPosition(newPosition);
      setPanStart({ x: e.clientX, y: e.clientY });

      syncViewState({ zoom, position: newPosition });
    },
    [isPublic, panStart, position, zoom, syncViewState]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const board = boardRef.current;
      const isToken = (e.target as HTMLElement).closest('[class*="token"]');
      if (isFogControlActive || (e.target !== board && !isToken)) {
        return;
      }
      e.preventDefault();

      // Calculate the zoom
      const delta = e.deltaY * -0.01;
      const newZoom = Math.min(Math.max(1, zoom + delta), 16);
      const scale = newZoom / zoom;

      // Calculate new position relative to center
      const newPosition = {
        x: position.x * scale,
        y: position.y * scale,
      };

      if (!isPublic) {
        const viewState = {
          zoom,
          position,
        };
        ws.send(
          JSON.stringify({
            type: "viewState",
            payload: viewState,
          })
        );
      }

      setZoom(newZoom);
      setPosition(newPosition);

      syncViewState({ zoom: newZoom, position: newPosition });
    },
    [zoom, position, isPublic, isFogControlActive, boardRef, syncViewState, ws]
  );

  // Update the wheel event listener to use the new handler
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    board.addEventListener("wheel", handleWheel as EventListener, {
      passive: false,
    });
    return () =>
      board.removeEventListener("wheel", handleWheel as EventListener);
  }, [handleWheel, boardRef]);

  const startPanning = useCallback(
    (x: number, y: number) => {
      if (isPublic) return;
      setIsPanning(true);
      setPanStart({ x, y });
    },
    [isPublic]
  );

  const stopPanning = useCallback(() => {
    if (isPublic) return;
    setIsPanning(false);
  }, [isPublic]);

  const getBoardTransformStyle = useCallback(
    () => ({
      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
      transformOrigin: "center",
    }),
    [zoom, position]
  );

  return {
    zoom,
    setZoom,
    position,
    setPosition,
    isPanning,
    startPanning,
    updatePanning,
    stopPanning,
    getBoardTransformStyle,
    mousePosition, // Add this to the return object
  };
}
