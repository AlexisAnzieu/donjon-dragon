import { useState } from "react";
import { HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import type { SoundLibraryWithSounds } from "@/app/game/types/sound";

interface LibraryTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: "session" | "game" | "user", name: string) => void;
  onDelete: (libraryId: string) => void;
  onRename: (libraryId: string, newName: string) => Promise<void>;
  sessionId?: string;
  gameId?: string;
  userId?: string;
  libraries: SoundLibraryWithSounds[];
}

const LIBRARY_TYPES = {
  session: {
    title: "Session Sound Library",
    description:
      "Create a sound library specific to this session. Useful for storing session-specific sound effects and ambient tracks.",
  },
  game: {
    title: "Game Sound Library",
    description:
      "Create a sound library for the entire game campaign. Perfect for storing world-building music scores, major sound cues, and recurring sound themes.",
  },
  user: {
    title: "User Sound Library",
    description:
      "Create a personal sound library that you can use across all your games and sessions. Ideal for reusable sound effects and audio references.",
  },
};

const getLibraryType = (
  library: SoundLibraryWithSounds
): "session" | "game" | "user" => {
  if (library.sessionId) return "session";
  if (library.gameId) return "game";
  return "user";
};

const TYPE_BADGES = {
  session: { label: "Session", class: "bg-purple-500" },
  game: { label: "Game", class: "bg-green-500" },
  user: { label: "User", class: "bg-blue-500" },
};

function Tooltip({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="pointer-events-none absolute z-50 p-2 text-sm text-white bg-gray-900 rounded-md shadow-lg -top-12 left-1/2 transform -translate-x-1/2 w-64">
          {text}
        </div>
      )}
    </div>
  );
}

export function LibraryTypeModal({
  isOpen,
  onClose,
  onSelect,
  onDelete,
  onRename,
  sessionId,
  gameId,
  userId,
  libraries,
}: LibraryTypeModalProps): JSX.Element | null {
  const [libraryName, setLibraryName] = useState("");
  const [editingLibrary, setEditingLibrary] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (type: "session" | "game" | "user") => {
    if (!libraryName.trim()) return;
    onSelect(type, libraryName);
    setLibraryName("");
    setIsCreating(false);
  };

  const handleRename = async (libraryId: string) => {
    if (!newName.trim()) return;
    await onRename(libraryId, newName);
    setEditingLibrary(null);
    setNewName("");
  };

  const handleClose = () => {
    setIsCreating(false);
    setEditingLibrary(null);
    setNewName("");
    setLibraryName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={handleClose} />

      <div className="relative z-50 bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white">Sound Libraries</h2>
        </div>

        {/* Existing Libraries */}
        <div className="mb-6 space-y-3">
          {libraries.map((library) => {
            const type = getLibraryType(library); // computed once per library
            return (
              <div
                key={library.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {editingLibrary === library.id ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleRename(library.id)
                      }
                      className="bg-gray-600 text-white px-2 py-1 rounded"
                      autoFocus
                    />
                  ) : (
                    <>
                      <span className="text-white">{library.name}</span>
                      <Tooltip text={LIBRARY_TYPES[type].description}>
                        <span
                          className={`text-xs px-2 py-1 rounded ${TYPE_BADGES[type].class}`}
                        >
                          {TYPE_BADGES[type].label}
                        </span>
                      </Tooltip>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingLibrary === library.id ? (
                    <button
                      onClick={() => handleRename(library.id)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        title="Edit library"
                        onClick={() => {
                          setEditingLibrary(library.id);
                          setNewName(library.name);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <HiPencil />
                      </button>
                      <button
                        title="Delete library"
                        onClick={() => onDelete(library.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <HiTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create New Library Form */}
        {isCreating ? (
          <>
            <input
              type="text"
              value={libraryName}
              onChange={(e) => setLibraryName(e.target.value)}
              placeholder="Library name"
              className="w-full px-4 py-2 mb-6 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex flex-col gap-4">
              {[
                { type: "session", id: sessionId },
                { type: "game", id: gameId },
                { type: "user", id: userId },
              ]
                .filter(({ id }) => id)
                .map(({ type }) => (
                  <div
                    key={type}
                    className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    <button
                      onClick={() =>
                        handleSelect(type as "session" | "game" | "user")
                      }
                      disabled={!libraryName.trim()}
                      className="w-full text-left"
                    >
                      <h3 className="text-white font-medium mb-2">
                        {
                          LIBRARY_TYPES[type as "session" | "game" | "user"]
                            .title
                        }
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {
                          LIBRARY_TYPES[type as "session" | "game" | "user"]
                            .description
                        }
                      </p>
                    </button>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className="flex justify-center mt-4">
            <button
              title="Create new library"
              onClick={() => setIsCreating(true)}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors duration-200 shadow-lg"
            >
              <HiPlus className="text-2xl text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
