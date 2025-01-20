import { useCallback, useEffect } from "react";
import { Token } from "@prisma/client";
import { TokenType } from "../game/type";

interface Position {
  x: number;
  y: number;
}

export interface DragState {
  type: TokenType;
  id: string;
  offsetX: number;
  offsetY: number;
}

export function useTokenDrag({
  tokens,
  selectedTokens,
  draggingToken,
  setDraggingToken, // Add this prop
  boardRef,
  isPublic,
  onTokensUpdate,
  onFogUpdate,
}: {
  tokens: Token[];
  selectedTokens: Set<string>;
  draggingToken: DragState | null;
  setDraggingToken: (state: DragState | null) => void;
  boardRef: React.RefObject<HTMLDivElement>;
  isPublic: boolean;
  onTokensUpdate: (tokens: Token[]) => void;
  onFogUpdate?: (x: number, y: number, radius: number) => void;
}) {
  const calculateNewPositions = useCallback(
    (mouseX: number, mouseY: number): Record<string, Position> => {
      if (!draggingToken || !boardRef.current) return {};

      const rect = boardRef.current.getBoundingClientRect();
      const x = ((mouseX - rect.left) / rect.width) * 100;
      const y = ((mouseY - rect.top) / rect.height) * 100;

      const newX = Math.max(0, Math.min(100, x + draggingToken.offsetX));
      const newY = Math.max(0, Math.min(100, y + draggingToken.offsetY));

      const draggedToken = tokens.find((t) => t.id === draggingToken.id);
      if (!draggedToken) return {};

      const positions: Record<string, Position> = {
        [draggingToken.id]: { x: newX, y: newY },
      };

      // Calculate positions for selected tokens
      selectedTokens.forEach((tokenId) => {
        if (tokenId === draggingToken.id) return;
        const token = tokens.find((t) => t.id === tokenId);
        if (!token) return;

        const offsetX = token.xPercent - draggedToken.xPercent;
        const offsetY = token.yPercent - draggedToken.yPercent;

        positions[tokenId] = {
          x: Math.max(0, Math.min(100, newX + offsetX)),
          y: Math.max(0, Math.min(100, newY + offsetY)),
        };
      });

      return positions;
    },
    [draggingToken, tokens, selectedTokens, boardRef]
  );

  useEffect(() => {
    if (!draggingToken || isPublic) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPositions = calculateNewPositions(e.clientX, e.clientY);

      const updatedTokens = tokens.map((token) => {
        const newPos = newPositions[token.id];
        if (!newPos) return token;

        return {
          ...token,
          xPercent: newPos.x,
          yPercent: newPos.y,
        };
      });

      onTokensUpdate(updatedTokens);

      // Update fog if necessary
      if (draggingToken.type === "characters" && onFogUpdate) {
        const draggedPos = newPositions[draggingToken.id];
        if (draggedPos) {
          onFogUpdate(draggedPos.x, draggedPos.y, 15);
        }
      }
    };

    const handleMouseUp = () => {
      setDraggingToken(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    draggingToken,
    isPublic,
    calculateNewPositions,
    tokens,
    onTokensUpdate,
    onFogUpdate,
    setDraggingToken,
  ]);

  return { calculateNewPositions };
}
