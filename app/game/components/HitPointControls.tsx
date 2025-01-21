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
  onNameChange?: (tokenId: string, newName: string) => void;
}

export function HitPointControls({
  tokens,
  onHitPointChange,
  onNameChange,
}: HitPointControlsProps) {
  const [tokenStates, setTokenStates] = useState<
    Record<
      string,
      {
        temp?: number;
        maxTemp?: number;
        saving?: boolean;
        saved?: boolean;
        isEditingName?: boolean;
        tempName?: string;
      }
    >
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedTypes, setCollapsedTypes] = useState<Set<string>>(new Set());

  const filteredTokens = useMemo(() => {
    return tokens.filter((token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, searchTerm, tokenStates]);

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

      const currentHp = tokenStates[tokenId]?.temp ?? token.hitPoint ?? 0;
      const maxHp = token.maxHitPoint ?? 0;
      const newValue = Math.min(Math.max(0, currentHp + amount), maxHp);

      setTokenStates((prev) => ({
        ...prev,
        [tokenId]: { ...prev[tokenId], temp: newValue },
      }));

      onHitPointChange(tokenId, newValue);
    },
    [tokens, tokenStates, onHitPointChange]
  );

  const handleNameEdit = useCallback(
    (tokenId: string, newName: string) => {
      if (!onNameChange) return;

      onNameChange(tokenId, newName);
      setTokenStates((prev) => ({
        ...prev,
        [tokenId]: { ...prev[tokenId], isEditingName: false },
      }));
    },
    [onNameChange]
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
                          {tokenStates[token.id]?.isEditingName ? (
                            <input
                              type="text"
                              className="w-24 bg-gray-600 rounded px-1"
                              value={
                                tokenStates[token.id]?.tempName ?? token.name
                              }
                              onChange={(e) =>
                                setTokenStates((prev) => ({
                                  ...prev,
                                  [token.id]: {
                                    ...prev[token.id],
                                    tempName: e.target.value,
                                  },
                                }))
                              }
                              onBlur={(e) =>
                                handleNameEdit(token.id, e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleNameEdit(
                                    token.id,
                                    e.currentTarget.value
                                  );
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <span
                              className="font-bold w-24 truncate cursor-pointer hover:text-purple-400"
                              onClick={() =>
                                setTokenStates((prev) => ({
                                  ...prev,
                                  [token.id]: {
                                    ...prev[token.id],
                                    isEditingName: true,
                                    tempName: token.name,
                                  },
                                }))
                              }
                            >
                              {token.name}
                            </span>
                          )}
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
