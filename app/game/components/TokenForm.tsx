import { useRef, useEffect, useState } from "react";
import { Monster, Token } from "@prisma/client";
import { TokenType, MONSTER_SIZE_SCALE, DEFAULT_TOKEN_SIZE } from "../type";
import { useMonsterSearch } from "../../hooks/useMonsterSearch";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

// Types
interface TokenFormProps {
  position: { x: number; y: number };
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (token: Token) => void;
}

interface SearchResultsProps {
  results: Monster[];
  selectedIndex: number;
  onSelect: (monster: Monster) => void;
}

interface TokenTypeSelectorProps {
  selectedType: TokenType;
  onChange: (type: TokenType) => void;
}

interface TokenConfiguratorProps {
  maxHitPoint: number;
  size: number;
  icon?: string;
  type: TokenType; // Add this prop
  onChange: (field: string, value: number) => void;
}

interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
}

// Component: SearchResults
const SearchResults = ({
  results,
  selectedIndex,
  onSelect,
}: SearchResultsProps) => (
  <motion.div
    initial={{ y: -10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", damping: 20 }}
    className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 max-h-[60vh] overflow-y-auto z-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
  >
    {results.map((monster, index) => (
      <motion.div
        key={monster.name}
        initial={false}
        animate={{
          backgroundColor:
            selectedIndex === index ? "rgb(243 244 246)" : "transparent",
        }}
        whileHover={{ backgroundColor: "rgb(243 244 246)" }}
        onClick={() => onSelect(monster)}
        className="p-3 cursor-pointer border-b border-gray-100 last:border-0"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex-shrink-0">
            {monster.imageUrl ? (
              <Image
                src={monster.imageUrl}
                alt={monster.name}
                className="object-cover rounded-lg"
                width={48}
                height={48}
              />
            ) : (
              <div
                className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg
                            flex items-center justify-center text-2xl"
              >
                👹
              </div>
            )}
            <div
              className="absolute -top-1 -right-1 w-4 h-4 bg-gray-100 rounded-full
                          flex items-center justify-center text-[10px] font-medium"
            >
              {monster.size.charAt(0)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {monster.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-red-500">♥️</span>
                {monster.hit_points}
              </span>
              <span className="flex items-center gap-1">
                <span>🛡️</span>
                {monster.armor_class}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// Component: TokenTypeSelector
const TokenTypeSelector = ({
  selectedType,
  onChange,
}: TokenTypeSelectorProps) => (
  <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
    {(["enemies", "npcs"] as const).map((type) => (
      <button
        key={type}
        onClick={() => onChange(type)}
        className={`flex-1 py-1.5 px-3 rounded-md transition-all text-sm ${
          selectedType === type
            ? "bg-white shadow-sm text-blue-600"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        {type === "enemies" ? "👹 Enemy" : "👤 NPC"}
      </button>
    ))}
  </div>
);
// Component: TokenConfigurator
const TokenConfigurator = ({
  maxHitPoint,
  size,
  icon,
  type,
  onChange,
}: TokenConfiguratorProps) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <div className="flex gap-4">
      <div className="flex-shrink-0 relative">
        {icon ? (
          <Image
            src={icon}
            alt="Token"
            width={80}
            height={80}
            className="w-20 h-20 rounded-lg object-cover shadow-sm border border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-3xl shadow-sm">
            {type === "enemies" ? "👹" : "👤"}
          </div>
        )}
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-lg">♥️</span>
          </div>
          <input
            type="number"
            value={maxHitPoint}
            onChange={(e) => onChange("maxHitPoint", +e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            min="1"
            max="999"
            placeholder="Hit Points"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <span className="text-blue-500 text-lg">📏</span>
          </div>
          <input
            type="number"
            value={size}
            onChange={(e) =>
              onChange("size", Math.max(0.1, Math.min(1, +e.target.value)))
            }
            step="0.1"
            min="0.1"
            max="1"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Size"
          />
        </div>
      </div>
    </div>
  </div>
);

// Component: ActionButtons
const ActionButtons = ({ onCancel, onSubmit }: ActionButtonsProps) => (
  <div className="flex gap-2">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onCancel}
      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 text-gray-700 font-medium text-sm"
    >
      Cancel
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSubmit}
      className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white font-medium text-sm"
    >
      Create Token
    </motion.button>
  </div>
);

// Main Component: TokenForm
export function TokenForm({
  position,
  isOpen,
  onClose,
  onSubmit,
}: TokenFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const { searchResults, isSearching, searchMonster, setSearchResults } =
    useMonsterSearch();

  const [formState, setFormState] = useState<{
    type: TokenType;
    name: string;
    hitPoint: number;
    maxHitPoint: number;
    icon?: string;
    monsterId?: string;
    size: number;
  }>({
    type: "enemies",
    name: "",
    hitPoint: 0,
    maxHitPoint: 0,
    size: DEFAULT_TOKEN_SIZE,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        formRef.current &&
        !formRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Reset selected index when search results change
  useEffect(() => {
    setSelectedResultIndex(-1);
  }, [searchResults]);

  const handleMonsterSelect = (monster: Monster) => {
    setFormState({
      ...formState,
      name: monster.name,
      hitPoint: monster.hit_points,
      maxHitPoint: monster.hit_points,
      icon: monster.imageUrl || "😈",
      monsterId: monster.id,
      size:
        MONSTER_SIZE_SCALE[monster.size as keyof typeof MONSTER_SIZE_SCALE] ||
        DEFAULT_TOKEN_SIZE,
    });
    setSearchResults([]);
  };

  const handleSubmit = () => {
    if (!formState.name.trim()) return;

    onSubmit({
      id: `${formState.type[0]}${Date.now()}`,
      name: formState.name,
      xPercent: position.x,
      yPercent: position.y,
      size: formState.size,
      hitPoint: formState.hitPoint,
      maxHitPoint: formState.maxHitPoint,
      monsterId: formState.monsterId || null,
      icon: formState.icon || null,
      type: formState.type,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={formRef}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bg-white shadow-xl rounded-xl p-3 z-50 border border-gray-200 w-[380px]"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(10px, -50%)",
        }}
      >
        <div className="flex flex-col gap-3">
          <TokenTypeSelector
            selectedType={formState.type}
            onChange={(type) => setFormState((prev) => ({ ...prev, type }))}
          />

          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={formState.name}
                onChange={(e) => {
                  setFormState((prev) => ({ ...prev, name: e.target.value }));
                  searchMonster(e.target.value);
                }}
                placeholder="Search creature..."
                className="w-full px-4 py-2 pl-9 bg-gray-50 rounded-lg border border-gray-300
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 text-sm"
                autoFocus
              />
              <svg
                className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {isSearching && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute right-3 top-3"
              >
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
              </motion.div>
            )}

            {searchResults.length > 0 && (
              <SearchResults
                results={searchResults}
                selectedIndex={selectedResultIndex}
                onSelect={handleMonsterSelect}
              />
            )}
          </div>

          <TokenConfigurator
            maxHitPoint={formState.maxHitPoint}
            size={formState.size}
            icon={formState.icon}
            type={formState.type} // Add this prop
            onChange={(field, value) =>
              setFormState((prev) => ({
                ...prev,
                [field]: value,
                ...(field === "maxHitPoint" ? { hitPoint: value } : {}),
              }))
            }
          />

          <ActionButtons onCancel={onClose} onSubmit={handleSubmit} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
