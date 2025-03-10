"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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
import { FavoriteEffects } from "./FavoriteEffects";
import { BoardContextProvider } from "../context/BoardContext";
import { DetailComponent } from "./DetailComponent";
import { DragState } from "@/app/hooks/useTokenDrag";

interface GameBoardProps {
  sessionId: string;
  initialTokens: Token[];
  fogOfWar: string | null;
  isPublic: boolean;
  initialViewState?: { zoom: number; position: { x: number; y: number } };
  sessionName: string;
  gameMasterId: string;
  gameId: string;
}

const UIElements = {
  HitPointControls: true,
  FogControls: true,
  VFXControls: true,
};
export type UIElementsKey = keyof typeof UIElements;

// Extract token style calculation
const createTokenStyle = (
  token: Token,
  draggingToken: DragState | null,
  selectedTokens: Set<string>,
  isPublic: boolean
): CSSProperties => ({
  position: "absolute",
  left: `${token.xPercent}%`,
  top: `${token.yPercent}%`,
  zIndex: draggingToken?.id === token.id ? 50 : 10,
  pointerEvents: isPublic ? "none" : "auto",
  outline: selectedTokens.has(token.id) ? "4px solid white" : "none",
  outlineOffset: "2px",
  opacity: token.visibility === "hidden" ? 0.6 : 1,
});

export default function GameBoard({
  sessionId,
  initialTokens,
  fogOfWar,
  isPublic,
  initialViewState,
  sessionName,
  gameId,
  gameMasterId,
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
    removeToken,
    handleHitPointChange,
    convertToken,
    createToken,
    duplicateToken,
    selectedTokens,
    setSelectedTokens,
    toggleTokenSelection,
    clearSelection,
    handleNameChange,
    toggleTokenVisibility,
  } = useTokenManagement({
    initialTokens,
    sessionId,
    ws,
    isPublic,
    isAutoClearEnabled,
    clearFogAroundPoint,
    boardRef,
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
  const [detailToken, setDetailToken] = useState<Token | null>(null);

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
      } else if (message.type === "detailToken") {
        const { token } = message.payload;
        setDetailToken(token);
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

  // Add effect to sync detailToken
  useEffect(() => {
    if (isPublic) return;

    ws.send(
      JSON.stringify({
        type: "detailToken",
        payload: { token: detailToken || null },
      })
    );
  }, [detailToken, isPublic, ws]);

  // Board event handlers
  const handleBoardMouseDown = (e: React.MouseEvent) => {
    if (isPublic) return;

    if (isFogControlActive) {
      return;
    }

    const isToken = (e.target as HTMLElement).closest('[class*="cursor-move"]');
    if (e.button === 0 && !isToken) {
      startPanning(e.clientX, e.clientY);
      if (!e.metaKey && !e.ctrlKey) {
        clearSelection();
      }
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

    if (e.metaKey || e.ctrlKey) {
      toggleTokenSelection(tokenId);
      return;
    }

    // If clicking on an unselected token, clear other selections
    if (!selectedTokens.has(tokenId)) {
      clearSelection();
      setSelectedTokens(new Set([tokenId])); // Select the clicked token
    }

    const token = tokens.find((t) => t.id === tokenId);
    if (!token) return;

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
    backgroundSize: "contain", // Changed from 'cover' to '100% 100%'
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat", // Added to prevent repeating
    cursor: isFogControlActive ? "crosshair" : isPanning ? "grabbing" : "grab",
    pointerEvents: "auto" as const,
    zIndex: 1,
  };

  const getTokenStyle = useCallback(
    (token: Token): CSSProperties =>
      createTokenStyle(token, draggingToken, selectedTokens, isPublic),
    [draggingToken, selectedTokens, isPublic]
  );

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
      <BoardContextProvider
        sessionId={sessionId}
        gameId={gameId}
        gameMasterId={gameMasterId}
      >
        <div className="relative h-full w-full">
          {!isFogControlActive && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
              <h1 className="text-xl font-bold text-white bg-black/50 px-4 py-2 rounded-lg">
                {sessionName}
              </h1>
            </div>
          )}
          <div
            className={`
            game-board
            relative w-full h-full
            overflow-hidden
            bg-black
            border-4
            transition-colors
            duration-200
            ${isFogControlActive ? "border-gray-600" : "border-black"}
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
              {tokens
                .filter((token) => !(isPublic && token.visibility === "hidden"))
                .map((token: Token) => (
                  <TokenComponent
                    zoom={zoom}
                    key={token.id}
                    token={token}
                    type={token.type as TokenType}
                    onMouseDown={(e) =>
                      handleTokenMouseDown(e, token.type as TokenType, token.id)
                    }
                    onContextMenu={(e) =>
                      handleTokenContextMenu(
                        e,
                        token.type as TokenType,
                        token.id
                      )
                    }
                    style={getTokenStyle(token)}
                    isPublic={isPublic}
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
                      <div className="absolute top-4 right-1  z-50 ">
                        <HitPointControls
                          tokens={tokens}
                          onHitPointChange={handleHitPointChange}
                          onNameChange={handleNameChange}
                          selectedTokenId={Array.from(selectedTokens)[0]}
                        />
                      </div>
                    )}
                    {showElements.VFXControls && (
                      <div className="absolute top-20 left-1 z-50">
                        <FavoriteEffects />
                      </div>
                    )}
                    <NavBar
                      sessionId={sessionId}
                      gameId={gameId}
                      userId={gameMasterId}
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
                onSeeDetails={() => {
                  const token = tokens.find(
                    (t) => t.id === contextMenu.tokenId
                  );
                  if (token) {
                    setDetailToken(token);
                  }
                  setContextMenu(null);
                }}
                onDuplicate={() => {
                  duplicateToken(contextMenu.tokenId);
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
                onToggleVisibility={() => {
                  toggleTokenVisibility(contextMenu.tokenId);
                  setContextMenu(null);
                }}
                isHidden={
                  tokens.find((t) => t.id === contextMenu.tokenId)
                    ?.visibility === "hidden"
                }
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

            {!isFogControlActive && detailToken && (
              <DetailComponent
                isPublic={isPublic}
                token={detailToken}
                onClose={() => setDetailToken(null)}
              />
            )}
          </div>
        </div>
      </BoardContextProvider>
    </div>
  );
}
