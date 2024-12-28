import { Token } from "@prisma/client";
import { TokenType } from "../type";
import {
  GiHealthNormal,
  GiSkullCrossedBones,
  GiTrashCan,
  GiCrownedSkull,
  GiCharacter,
  GiMagnifyingGlass,
} from "react-icons/gi";
import { FaRegCopy } from "react-icons/fa6";

interface TokenContextMenuProps {
  position: { x: number; y: number };
  tokenId: string;
  tokenType: TokenType;
  token: Token;
  onMarkAsDead: () => void;
  onConvertToEnemy?: () => void;
  onConvertToNpc?: () => void;
  onRemove?: () => void;
  onDuplicate: () => void;
  onSeeDetails?: () => void;
}

export function TokenContextMenu({
  position,
  token,
  tokenType,
  onMarkAsDead,
  onConvertToEnemy,
  onConvertToNpc,
  onRemove,
  onDuplicate,
  onSeeDetails,
}: TokenContextMenuProps) {
  return (
    <div
      className="fixed bg-white shadow-lg rounded-lg py-2 z-50 min-w-[200px] border border-gray-200 animate-fadeIn"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(0, 0)",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {onSeeDetails && (
        <>
          <div
            className="px-4 py-2 hover:bg-indigo-50 flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-150"
            onClick={onSeeDetails}
          >
            <GiMagnifyingGlass className="text-lg" />
            <span>See details</span>
          </div>
        </>
      )}

      {tokenType === "characters" && onConvertToEnemy && (
        <>
          <div className="border-b border-gray-200 my-1" />
          <div
            className="px-4 py-2 hover:bg-indigo-50 flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-150"
            onClick={onConvertToEnemy}
          >
            <GiCrownedSkull className="text-lg" />
            <span>Convert to Enemy</span>
          </div>
        </>
      )}

      {tokenType === "enemies" && onConvertToNpc && (
        <>
          <div className="border-b border-gray-200 my-1" />
          <div
            className="px-4 py-2 hover:bg-indigo-50 flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-150"
            onClick={onConvertToNpc}
          >
            <GiCharacter className="text-lg" />
            <span>Convert to NPC</span>
          </div>
        </>
      )}

      {tokenType === "npcs" && onConvertToEnemy && (
        <>
          <div className="border-b border-gray-200 my-1" />
          <div
            className="px-4 py-2 hover:bg-indigo-50 flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-150"
            onClick={onConvertToEnemy}
          >
            <GiCrownedSkull className="text-lg" />
            <span>Convert to Enemy</span>
          </div>
        </>
      )}

      <div className="border-b border-gray-200 my-1" />

      <div
        className="px-4 py-2 hover:bg-indigo-50 flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-150"
        onClick={onDuplicate}
      >
        <FaRegCopy className="text-lg" />
        <span>Duplicate</span>
      </div>
      <div
        className="px-4 py-2 hover:bg-indigo-50 flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-150"
        onClick={onMarkAsDead}
      >
        {token.hitPoint <= 0 ? (
          <>
            <GiHealthNormal className="text-lg" />
            <span>Revive</span>
          </>
        ) : (
          <>
            <GiSkullCrossedBones className="text-lg" />
            <span>Mark as dead</span>
          </>
        )}
      </div>

      <div
        className="px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors duration-150"
        onClick={onRemove}
      >
        <GiTrashCan className="text-lg" />
        <span>Remove</span>
      </div>
    </div>
  );
}
