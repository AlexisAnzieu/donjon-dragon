import { useState, useCallback, useEffect, useRef } from "react";
import { Token } from "@prisma/client";
import { TokenType } from "../game/type";

interface UseTokenManagementProps {
  initialTokens: Token[];
  sessionId: string;
  ws: {
    send: (data: string) => void;
  };
  isPublic: boolean;
  isAutoClearEnabled?: boolean;
  clearFogAroundPoint?: (x: number, y: number, radius: number) => void;
}

interface DraggingState {
  type: TokenType;
  id: string;
  offsetX: number;
  offsetY: number;
}

export function useTokenManagement({
  initialTokens,
  sessionId,
  ws,
  isPublic,
  isAutoClearEnabled,
  clearFogAroundPoint,
}: UseTokenManagementProps) {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);

  const syncTimeoutRef = useRef<NodeJS.Timeout>();
  const isSyncingRef = useRef(false);

  // Notify other clients through WebSocket
  const notifyTokenUpdate = useCallback(
    (newTokens: typeof tokens) => {
      if (!isPublic) {
        ws.send(
          JSON.stringify({ type: "tokens", payload: { tokens: newTokens } })
        );
      }
    },
    [ws, isPublic]
  );

  const [draggingToken, setDraggingToken] = useState<DraggingState | null>(
    null
  );

  // Sync tokens with server with debouncing
  useEffect(() => {
    if (isPublic || isSyncingRef.current) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      isSyncingRef.current = true;
      try {
        // Convert tokens to a flat array
        const allTokens = tokens.map((t) => ({
          ...t,
          sessionId,
        }));

        const response = await fetch(`/api/sessions?id=${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokens: allTokens }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to sync tokens");
        }
      } catch (error) {
        console.error("Error syncing tokens:", error);
      } finally {
        isSyncingRef.current = false;
      }
    }, 1000);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [tokens, sessionId, isPublic]);

  const updateToken = useCallback(
    (tokenId: string, updates: Partial<Token>) => {
      setTokens((prev) => {
        const newTokens = prev.map((token) =>
          token.id === tokenId ? { ...token, ...updates, sessionId } : token
        );
        notifyTokenUpdate(newTokens);
        return newTokens;
      });
    },
    [notifyTokenUpdate, sessionId]
  );

  const removeToken = useCallback(
    (tokenId: string) => {
      setTokens((prev) => {
        const newTokens = prev.filter((t) => t.id !== tokenId);
        notifyTokenUpdate(newTokens);
        return newTokens;
      });
    },
    [notifyTokenUpdate]
  );

  const convertToken = useCallback(
    (toType: TokenType, tokenId: string) => {
      const tokenToConvert = tokens.find((t) => t.id === tokenId);
      if (!tokenToConvert) return;

      setTokens((prev) => {
        const newTokens = [
          ...prev.filter((t) => t.id !== tokenId),
          {
            ...tokenToConvert,
            id: `${toType[0]}${Date.now()}`,
            type: toType,
            sessionId,
          },
        ];
        notifyTokenUpdate(newTokens);
        return newTokens;
      });
    },
    [tokens, notifyTokenUpdate, sessionId]
  );

  const handleHitPointChange = useCallback(
    (tokenId: string, newValue: number, isMax?: boolean) => {
      setTokens((prev) => {
        const newTokens = prev.map((token) =>
          token.id === tokenId
            ? {
                ...token,
                [isMax ? "maxHitPoint" : "hitPoint"]: Math.max(0, newValue),
              }
            : token
        );
        notifyTokenUpdate(newTokens);
        return newTokens;
      });
    },
    [notifyTokenUpdate]
  );

  useEffect(() => {
    if (!isPublic) {
      notifyTokenUpdate(initialTokens);
    }
  }, [isPublic, notifyTokenUpdate, initialTokens]);

  // Add this effect to handle fog clearing when tokens move
  useEffect(() => {
    if (!draggingToken || !isAutoClearEnabled || !clearFogAroundPoint) return;

    const token = tokens.find((t) => t.id === draggingToken.id);
    if (token && draggingToken.type === "characters") {
      clearFogAroundPoint(token.xPercent, token.yPercent, 15);
    }
  }, [draggingToken, tokens, isAutoClearEnabled, clearFogAroundPoint]);

  const createToken = useCallback(
    (token: Token, position: { xPercent: number; yPercent: number }) => {
      const tokenType = token.type as TokenType;
      const newToken = {
        ...token,
        sessionId,
        type: tokenType,
        id: `${tokenType[0]}${Date.now()}`,
        xPercent: position.xPercent,
        yPercent: position.yPercent,
      };

      setTokens((prev) => {
        const newTokens = [...prev, newToken];
        notifyTokenUpdate(newTokens);
        return newTokens;
      });

      // Auto-clear fog around new character tokens
      if (
        tokenType === "characters" &&
        isAutoClearEnabled &&
        clearFogAroundPoint
      ) {
        clearFogAroundPoint(position.xPercent, position.yPercent, 30);
      }

      return newToken;
    },
    [sessionId, notifyTokenUpdate, isAutoClearEnabled, clearFogAroundPoint]
  );

  const duplicateToken = useCallback(
    (tokenId: string) => {
      const tokenToDuplicate = tokens.find((t) => t.id === tokenId);
      if (!tokenToDuplicate) return;

      const newToken = {
        ...tokenToDuplicate,
        id: `${tokenToDuplicate.type[0]}${Date.now()}`,
        xPercent: tokenToDuplicate.xPercent + 2,
        yPercent: tokenToDuplicate.yPercent + 2,
      };

      setTokens((prev) => {
        const newTokens = [...prev, newToken];
        notifyTokenUpdate(newTokens);
        return newTokens;
      });

      return newToken;
    },
    [tokens, notifyTokenUpdate]
  );

  return {
    tokens,
    setTokens,
    draggingToken,
    setDraggingToken,
    updateToken,
    removeToken,
    handleHitPointChange,
    convertToken,
    createToken, // Add this to the return object
    duplicateToken,
  };
}