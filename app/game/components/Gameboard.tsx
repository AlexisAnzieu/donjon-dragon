"use client";

import { useRef, useState, useEffect } from "react";
import { TokenComponent } from "./Token";
import { HitPointControls } from "./HitPointControls";
import { TokenType } from "../type";
import { Token } from "@prisma/client";
import { useFogOfWar } from "../../hooks/useFogOfWar";
import { FogControls } from "./FogControls";
import { useWebsocket } from "@/lib/websocket";
import { useBoardView } from "../../hooks/useBoardView";
import { useTokenManagement } from "../../hooks/useTokenManagement";
import { useBackgroundImage } from "../../hooks/useBackgroundImage";
import { useFullscreen } from "../../hooks/useFullscreen";
import { TokenForm } from "./TokenForm";
import { TokenContextMenu } from "./TokenContextMenu";
import { CSSProperties } from "react";
import { BrushPreview } from "./BrushPreview";
import { NavBar } from "./NavBar";

interface GameBoardProps {
  sessionId: string;
  initialTokens: Token[];
  fogOfWar: string | null;
  isPublic: boolean;
  initialViewState?: { zoom: number; position: { x: number; y: number } };
}

const UIElements = {
  HitPointControls: true,
  FogControls: true,
};
export type UIElementsKey = keyof typeof UIElements;

export default function GameBoard({
  sessionId,
  initialTokens,
  fogOfWar,
  isPublic,
  initialViewState,
}: GameBoardProps) {
  const ws = useWebsocket(sessionId);
  const boardRef = useRef<HTMLDivElement>(null);

  // Fog of war management
  const {
    fogCanvasRef,
    isDrawingFog,
    setIsDrawingFog,
    isFogControlActive,
    setIsFogControlActive,
    brushSize,
    setBrushSize,
    resetFog,
    clearFogAroundPoint,
    isAutoClearEnabled,
    setIsAutoClearEnabled,
    updateFogCanvas,
  } = useFogOfWar({
    sessionId,
    initialFogData: fogOfWar,
    ws,
    isPublic,
  });

  // Board view management
  const {
    zoom,
    isPanning,
    startPanning,
    updatePanning,
    stopPanning,
    getBoardTransformStyle,
    setZoom,
    setPosition,
    mousePosition,
    position,
  } = useBoardView({
    initialViewState,
    isPublic,
    ws,
    isFogControlActive,
    boardRef,
    sessionId,
  });

  // Update the panning effect to sync position
  useEffect(() => {
    if (isPanning) {
      const handlePanMove = (e: MouseEvent) => {
        updatePanning(e);

        // Send view state update via websocket if not public
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
      };

      window.addEventListener("mousemove", handlePanMove);
      window.addEventListener("mouseup", stopPanning);

      return () => {
        window.removeEventListener("mousemove", handlePanMove);
        window.removeEventListener("mouseup", stopPanning);
      };
    }
  }, [isPanning, updatePanning, stopPanning, isPublic, ws, zoom, position]);

  // Token management
  const {
    tokens,
    setTokens,
    draggingToken,
    setDraggingToken,
    updateToken,
    removeToken,
    handleHitPointChange,
    convertToken,
    createToken,
    duplicateToken, // Add this
  } = useTokenManagement({
    initialTokens,
    sessionId,
    ws,
    isPublic,
    isAutoClearEnabled,
    clearFogAroundPoint,
  });

  // Background image management
  const { backgroundImage, setBackgroundImage, handleImageUpload } =
    useBackgroundImage({
      sessionId,
      onImageUpdate: (url) => {
        if (!isPublic) {
          ws.send(
            JSON.stringify({ type: "backgroundImage", payload: { url } })
          );
        }
      },
    });

  // Fullscreen management
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Form and context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    tokenId: string;
    tokenType: TokenType;
  } | null>(null);

  const [newTokenForm, setNewTokenForm] = useState<{
    x: number;
    y: number;
    boardX: number;
    boardY: number;
    isOpen: boolean;
  }>({
    x: 0,
    y: 0,
    boardX: 0,
    boardY: 0,
    isOpen: false,
  });

  const [showElements, setShowElements] = useState(UIElements);

  // Update the WebSocket message handler for public view
  useEffect(() => {
    if (!isPublic) return;

    // Set initial tokens state for public view
    setTokens(initialTokens);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "FOG_UPDATE") {
        const { fogData } = message.payload;
        updateFogCanvas(fogData);
      } else if (message.type === "viewState") {
        const { zoom: newZoom, position } = message.payload;
        setZoom(newZoom);
        setPosition(position);
      } else if (message.type === "tokens") {
        const { tokens: newTokens } = message.payload;
        if (newTokens) {
          setTokens(newTokens);
        }
      } else if (message.type === "backgroundImage") {
        const { url } = message.payload;
        setBackgroundImage(url);
      }
    };
  }, [
    isPublic,
    ws,
    setZoom,
    setPosition,
    setTokens,
    setBackgroundImage,
    initialTokens,
    updateFogCanvas,
  ]);

  // Board event handlers
  const handleBoardMouseDown = (e: React.MouseEvent) => {
    if (isPublic) return;

    if (isFogControlActive) {
      return;
    }

    const isToken = (e.target as HTMLElement).closest('[class*="cursor-move"]');
    if (e.button === 0 && !isToken) {
      startPanning(e.clientX, e.clientY);
      cleanMap();
    } else if (e.button === 2 && !isToken) {
      e.preventDefault();
      const board = boardRef.current;
      if (!board) return;

      const rect = board.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

      // Adjust form position to ensure it's visible
      const formHeight = 300; // Height of the form in pixels
      const windowHeight = window.innerHeight;
      const adjustedY =
        e.clientY + formHeight > windowHeight
          ? windowHeight - formHeight
          : e.clientY;

      setNewTokenForm({
        x: e.clientX,
        y: adjustedY,
        boardX: xPercent,
        boardY: yPercent,
        isOpen: true,
      });
    }
  };

  useEffect(() => {
    cleanMap();
  }, [zoom, position]);

  const cleanMap = () => {
    setNewTokenForm((prev) => ({ ...prev, isOpen: false }));
    setContextMenu(null);
  };

  // Token event handlers
  const handleTokenMouseDown = (
    e: React.MouseEvent,
    tokenType: TokenType,
    tokenId: string
  ) => {
    if (isPublic) return;
    e.preventDefault();

    const token = tokens.find((t) => t.id === tokenId);
    if (!token) return;

    // Calculate the offset between mouse position and token position
    const board = boardRef.current;
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const boardX = ((e.clientX - rect.left) / rect.width) * 100;
    const boardY = ((e.clientY - rect.top) / rect.height) * 100;

    setDraggingToken({
      type: tokenType,
      id: tokenId,
      offsetX: token.xPercent - boardX,
      offsetY: token.yPercent - boardY,
    });
  };

  const handleTokenContextMenu = (
    e: React.MouseEvent,
    tokenType: TokenType,
    tokenId: string
  ) => {
    if (isPublic) return;
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      tokenId,
      tokenType,
    });
  };

  // Style calculations
  const boardStyle: React.CSSProperties = {
    ...getBoardTransformStyle(),
    backgroundImage: `url('${backgroundImage}')`,
    backgroundSize: "100% 100%", // Changed from 'cover' to '100% 100%'
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat", // Added to prevent repeating
    cursor: isFogControlActive ? "crosshair" : isPanning ? "grabbing" : "grab",
    pointerEvents: "auto" as const,
    zIndex: 1,
  };

  const getTokenStyle = (token: Token): CSSProperties => ({
    position: "absolute" as const,
    left: `${token.xPercent}%`,
    top: `${token.yPercent}%`,
    zIndex: draggingToken?.id === token.id ? 50 : 10,
    pointerEvents: isPublic ? "none" : "auto",
  });

  useEffect(() => {
    if (!draggingToken || isPublic) return;

    const handleMouseMove = (e: MouseEvent) => {
      const board = boardRef.current;
      if (!board) return;

      const rect = board.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Apply the offset to maintain the grab position
      const newX = Math.max(0, Math.min(100, x + draggingToken.offsetX));
      const newY = Math.max(0, Math.min(100, y + draggingToken.offsetY));

      setTokens((prev) => {
        const newTokens = prev.map((token) =>
          token.id === draggingToken.id
            ? {
                ...token,
                xPercent: newX,
                yPercent: newY,
              }
            : token
        );

        // Send update via websocket
        if (!isPublic) {
          ws.send(
            JSON.stringify({ type: "tokens", payload: { tokens: newTokens } })
          );
        }

        return newTokens;
      });

      // Auto-clear fog for character tokens
      if (draggingToken.type === "characters" && isAutoClearEnabled) {
        clearFogAroundPoint(newX, newY, 15);
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
    ws,
    isAutoClearEnabled,
    clearFogAroundPoint,
    setTokens,
    setDraggingToken,
  ]);

  const handleTokenFormSubmit = (token: Token) => {
    createToken(token, {
      xPercent: newTokenForm.boardX,
      yPercent: newTokenForm.boardY,
    });
    setNewTokenForm((prev) => ({ ...prev, isOpen: false }));
  };

  const handleToggleElements = (element: UIElementsKey) => {
    setShowElements((prev) => ({
      ...prev,
      [element]: !prev[element],
    }));
  };

  return (
    <div className="h-screen w-screen select-none">
      <div className="relative h-full w-full">
        <div
          className={`
            game-board
            relative w-full h-full
            overflow-hidden
            bg-black
            border-4
            transition-colors
            duration-200
            ${isFogControlActive ? "border-violet-600" : "border-black"}
            ${isPublic ? "cursor-default" : ""}
          `}
        >
          <div
            ref={boardRef}
            className="absolute inset-0"
            style={boardStyle}
            onMouseDown={handleBoardMouseDown}
            onContextMenu={(e) => e.preventDefault()}
          >
            {tokens.map((token: Token) => (
              <TokenComponent
                zoom={zoom}
                key={token.id}
                token={token}
                type={token.type as TokenType}
                onMouseDown={(e) =>
                  handleTokenMouseDown(e, token.type as TokenType, token.id)
                }
                onContextMenu={(e) =>
                  handleTokenContextMenu(e, token.type as TokenType, token.id)
                }
                style={getTokenStyle(token)}
              />
            ))}
          </div>

          <canvas
            ref={fogCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              opacity: isPublic ? 1 : 0.7,
              mixBlendMode: "multiply",
              ...getBoardTransformStyle(),
              zIndex: 2,
              pointerEvents: isFogControlActive ? "auto" : "none",
            }}
          />

          {!isPublic && (
            <>
              {isFogControlActive && (
                <BrushPreview
                  size={brushSize}
                  mousePosition={mousePosition}
                  zoom={zoom}
                />
              )}
              {!isFogControlActive && (
                <>
                  {showElements.HitPointControls && (
                    <div className="absolute top-4 right-4  z-50 ">
                      <HitPointControls
                        tokens={tokens}
                        onHitPointChange={handleHitPointChange}
                      />
                    </div>
                  )}
                  <NavBar
                    onImageUpload={handleImageUpload}
                    onToggleElements={handleToggleElements}
                    showElements={showElements}
                  />
                </>
              )}
              {showElements.FogControls && (
                <FogControls
                  isFogControlActive={isFogControlActive}
                  setIsFogControlActive={setIsFogControlActive}
                  isDrawingFog={isDrawingFog}
                  setIsDrawingFog={setIsDrawingFog}
                  brushSize={brushSize}
                  setBrushSize={setBrushSize}
                  onReset={resetFog}
                  isAutoClearEnabled={isAutoClearEnabled}
                  setIsAutoClearEnabled={setIsAutoClearEnabled}
                />
              )}
            </>
          )}

          <div className="absolute bottom-4 right-4 flex gap-2 z-50">
            <button
              onClick={toggleFullscreen}
              className="bg-white/80 hover:bg-white/90 p-2 rounded-lg shadow-md"
            >
              {isFullscreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                  />
                </svg>
              )}
            </button>
          </div>

          {contextMenu && (
            <TokenContextMenu
              position={{ x: contextMenu.x, y: contextMenu.y }}
              tokenId={contextMenu.tokenId}
              tokenType={contextMenu.tokenType}
              token={tokens.find((t) => t.id === contextMenu.tokenId)!}
              onSeeDetails={() => {
                // You can implement the details view logic here
                console.log("Show details for token:", contextMenu.tokenId);
                setContextMenu(null);
              }}
              onDuplicate={() => {
                duplicateToken(contextMenu.tokenId);
                setContextMenu(null);
              }}
              onMarkAsDead={() => {
                const token = tokens.find((t) => t.id === contextMenu.tokenId);
                if (token) {
                  updateToken(contextMenu.tokenId, {
                    hitPoint: token.hitPoint <= 0 ? 1 : 0,
                  });
                }
                setContextMenu(null);
              }}
              onConvertToEnemy={() => {
                convertToken("enemies", contextMenu.tokenId);
                setContextMenu(null);
              }}
              onConvertToNpc={() => {
                convertToken("npcs", contextMenu.tokenId);
                setContextMenu(null);
              }}
              onRemove={() => {
                removeToken(contextMenu.tokenId);
                setContextMenu(null);
              }}
            />
          )}

          {newTokenForm.isOpen && (
            <TokenForm
              position={{ x: newTokenForm.x, y: newTokenForm.y }}
              isOpen={newTokenForm.isOpen}
              onClose={() =>
                setNewTokenForm((prev) => ({ ...prev, isOpen: false }))
              }
              onSubmit={handleTokenFormSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
