import { Token } from "@prisma/client";
import { TokenType } from "../type";
import groupBy from "lodash/groupBy";
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HitPointControlsProps {
  tokens: Token[];
  onHitPointChange: (
    tokenId: string,
    newValue: number,
    isMax?: boolean
  ) => void;
}

export function HitPointControls({
  tokens,
  onHitPointChange,
}: HitPointControlsProps) {
  const [tokenStates, setTokenStates] = useState<
    Record<
      string,
      { temp?: number; maxTemp?: number; saving?: boolean; saved?: boolean }
    >
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedTypes, setCollapsedTypes] = useState<Set<string>>(new Set());

  const filteredTokens = useMemo(() => {
    return tokens.filter((token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tokens, searchTerm]);

  const tokensByType = useMemo(
    () => groupBy(filteredTokens, "type") as Record<TokenType, Token[]>,
    [filteredTokens]
  );

  const handleSave = useCallback(
    async (tokenId: string, isMax?: boolean) => {
      const token = tokens.find((t) => t.id === tokenId);
      if (!token) return;

      setTokenStates((prev) => ({
        ...prev,
        [tokenId]: { ...prev[tokenId], saving: true },
      }));

      const newValue = isMax
        ? tokenStates[tokenId]?.maxTemp ?? token.maxHitPoint ?? 0
        : tokenStates[tokenId]?.temp ?? token.hitPoint ?? 0;

      await onHitPointChange(tokenId, newValue, isMax);

      // Update the state to reflect the saved value
      setTokenStates((prev) => ({
        ...prev,
        [tokenId]: {
          ...prev[tokenId],
          saving: false,
          saved: true,
          [isMax ? "maxTemp" : "temp"]: newValue,
        },
      }));

      setTimeout(
        () =>
          setTokenStates((prev) => ({
            ...prev,
            [tokenId]: { ...prev[tokenId], saved: false },
          })),
        1500
      );
    },
    [tokens, tokenStates, onHitPointChange]
  );

  const quickChange = useCallback(
    (tokenId: string, amount: number) => {
      const token = tokens.find((t) => t.id === tokenId);
      if (!token) return;

      const currentHp = token.hitPoint ?? 0;
      const maxHp = token.maxHitPoint ?? 0;
      const newValue = Math.min(Math.max(0, currentHp + amount), maxHp);

      onHitPointChange(tokenId, newValue);
    },
    [tokens, onHitPointChange]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-4 bg-gray-900 rounded-lg text-white"
    >
      <div className="sticky top-0 z-10 bg-gray-900 pb-4">
        <input
          type="text"
          placeholder="Rechercher un token..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 px-3 py-1 rounded-md w-full"
        />
      </div>

      <div className="space-y-2 max-h-[calc(80vh)] overflow-y-auto">
        {Object.entries(tokensByType).map(([type, tokenList]) => (
          <motion.div
            key={type}
            className="bg-gray-800 rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setCollapsedTypes((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(type)) {
                    newSet.delete(type);
                  } else {
                    newSet.add(type);
                  }
                  return newSet;
                })
              }
              className="w-full p-2 flex items-center justify-between hover:bg-gray-700"
            >
              <h3 className="text-lg font-bold text-purple-400 uppercase">
                {type} ({tokenList.length})
              </h3>
              <span>{collapsedTypes.has(type) ? "▼" : "▲"}</span>
            </button>

            <AnimatePresence>
              {!collapsedTypes.has(type) && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-2 space-y-2">
                    {tokenList.map((token) => (
                      <motion.div
                        key={token.id}
                        className="bg-gray-700 rounded p-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold w-24 truncate">
                            {token.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={
                                tokenStates[token.id]?.temp ??
                                token.hitPoint ??
                                0
                              }
                              onChange={(e) =>
                                setTokenStates((prev) => ({
                                  ...prev,
                                  [token.id]: {
                                    ...prev[token.id],
                                    temp: +e.target.value,
                                  },
                                }))
                              }
                              onBlur={() => handleSave(token.id)}
                              className="w-14 bg-transparent text-center"
                            />
                            <span>/</span>
                            <input
                              type="number"
                              value={
                                tokenStates[token.id]?.maxTemp ??
                                token.maxHitPoint ??
                                0
                              }
                              onChange={(e) =>
                                setTokenStates((prev) => ({
                                  ...prev,
                                  [token.id]: {
                                    ...prev[token.id],
                                    maxTemp: +e.target.value,
                                  },
                                }))
                              }
                              onBlur={() => handleSave(token.id, true)}
                              className="w-14 bg-transparent text-center"
                            />
                          </div>
                          <div className="flex gap-1 ml-auto">
                            <button
                              className="px-2 py-1 bg-red-600 rounded"
                              onClick={() => quickChange(token.id, -1)}
                            >
                              -
                            </button>
                            <button
                              className="px-2 py-1 bg-green-600 rounded"
                              onClick={() => quickChange(token.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
