import { Token } from "@prisma/client";
import { TokenType } from "../type";
import { CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface TokenProps {
  token: Token;
  type: TokenType;
  onMouseDown: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  style: CSSProperties;
  zoom: number;
  isPublic?: boolean;
}

const getTokenColor = (isDead: boolean, type: TokenType) => {
  if (isDead) return "bg-black";
  switch (type) {
    case "characters":
      return "bg-blue-500 border-2 border-white";
    case "enemies":
      return "bg-red-500";
    case "npcs":
      return "bg-white";
    case "notes":
      return "bg-yellow-200";
  }
};

const getHealthBarColor = (hitPoint: number, maxHitPoint: number) => {
  if (hitPoint <= 0) return "bg-black";
  if (hitPoint <= maxHitPoint * 0.25) return "bg-red-500";
  if (hitPoint <= maxHitPoint * 0.5) return "bg-orange-500";
  return "bg-green-600";
};

const TokenContent = ({ token }: { token: Token }) => (
  <span className="text-xl">
    {token.hitPoint <= 0 && token.type !== "notes" ? (
      "☠️"
    ) : token.icon?.startsWith("http") ? (
      <Image
        width={96}
        height={96}
        src={token.icon}
        alt={token.name}
        className="w-9 h-9 rounded-full"
      />
    ) : token.icon ? (
      token.icon
    ) : token.type === "enemies" ? (
      "👹"
    ) : token.type === "notes" ? (
      "📝"
    ) : (
      "👤"
    )}
  </span>
);

export const TokenComponent = ({
  token,
  type,
  onMouseDown,
  onContextMenu,
  style,
  zoom,
  isPublic,
}: TokenProps) => {
  if (type === "notes" && isPublic) {
    return null;
  }
  const scale = Math.max(1 / zoom, token.size);
  const transformOrigin = { x: "-50%", y: "-50%" };

  return (
    <AnimatePresence>
      <motion.div
        onMouseDown={onMouseDown}
        onContextMenu={onContextMenu}
        className={`absolute w-10 h-10 rounded-full cursor-move flex items-center token justify-center text-white font-bold shadow-lg select-none ${getTokenColor(
          token.hitPoint <= 0,
          type
        )}`}
        style={style}
        initial={{ scale, ...transformOrigin }}
        animate={{
          scale,
          ...transformOrigin,
          rotate: [0, -10, 10, -5, 0],
        }}
        transition={{
          duration: 0.4,
          times: [0, 0.2, 0.4, 0.6, 1],
          ease: "easeInOut",
        }}
        key={`${token.id}-${token.hitPoint}`}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.3 }}
          key={`flash-${token.id}-${token.hitPoint}`}
        />

        <TokenContent token={token} />

        {zoom > 1.7 && (
          <div
            className={`absolute -bottom-3 left-1/2 text-center rounded ${
              type === "notes"
                ? "bg-yellow-100 text-gray-800 p-2"
                : "text-white bg-gray-800/80"
            }`}
            style={{
              transform: `translateX(-50%) scale(${1 / scale})`,
              transformOrigin: "top center",
              fontSize: type === "notes" ? "8px" : "6px",
              maxWidth: type === "notes" ? "120px" : "60px",
              maxHeight: type === "notes" ? "none" : "23px",
              display: "-webkit-box",
              WebkitLineClamp: type === "notes" ? undefined : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.2,
              padding: type === "notes" ? "4px 6px" : "1px 2px 1px 2px",
              whiteSpace: type === "notes" ? "pre-wrap" : "normal",
            }}
          >
            {token.name}
          </div>
        )}

        {token.maxHitPoint > 0 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getHealthBarColor(
                token.hitPoint,
                token.maxHitPoint
              )}`}
              style={{
                width: `${Math.max(
                  0,
                  (token.hitPoint / token.maxHitPoint) * 100
                )}%`,
              }}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
