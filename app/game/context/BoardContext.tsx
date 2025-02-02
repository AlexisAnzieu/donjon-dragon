import { ReactNode, createContext, useContext } from "react";
import { createStorageContext } from "./createContext";
import { Sound } from "@prisma/client";
import {
  SoundContextState,
  SoundLibraryWithSounds,
} from "@/app/game/types/sound";
import { MidiProvider } from "./MidiContext";
import { LightPresetsProvider } from "./LightContext";

export const SOUND_LIBRARIES_KEY = "soundLibraries";

interface SessionContextType {
  sessionId: string;
  gameMasterId: string;
  gameId: string;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const {
  Provider: FavoritesProvider,
  useStorageContext: useSoundLibrariesStorage,
} = createStorageContext<SoundLibraryWithSounds[]>({
  key: SOUND_LIBRARIES_KEY,
  defaultValue: [],
  maxItems: 9,
});

function useVariableContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(
      "Board components must be used within a BoardContextProvider"
    );
  }
  return context;
}

export function useSoundLibraries(): SoundContextState {
  const { sessionId, gameId, gameMasterId } = useVariableContext();
  const { data: soundLibraries, setData: setSoundLibraries } =
    useSoundLibrariesStorage();

  const updateLibraryState = (
    soundLibraryId: string,
    updater: (library: SoundLibraryWithSounds) => SoundLibraryWithSounds
  ) => {
    setSoundLibraries(
      soundLibraries.map((library) =>
        library.id === soundLibraryId ? updater(library) : library
      )
    );
  };

  const loadSoundLibraries = async () => {
    try {
      const response = await fetch(
        `/api/soundlibrary?sessionId=${sessionId}&gameId=${gameId}&gameMasterId=${gameMasterId}`
      );
      if (!response.ok) throw new Error("Failed to load sound libraries");
      const data: SoundLibraryWithSounds[] = await response.json();
      setSoundLibraries(data);
    } catch (error) {
      console.error("Error loading sound libraries:", error);
    }
  };

  const toggleFavorite = async (effect: Sound, soundLibraryId: string) => {
    const library = soundLibraries.find((s) => s.id === soundLibraryId);
    if (!library) return;

    const exists = library.sounds.some((s) => s.cid === effect.cid);

    try {
      if (exists) {
        await fetch(`/api/sounds?cid=${effect.cid}`, { method: "DELETE" });
        updateLibraryState(soundLibraryId, (lib) => ({
          ...lib,
          sounds: lib.sounds.filter((s) => s.cid !== effect.cid),
        }));
      } else if (soundLibraries.length < 9) {
        const response = await fetch("/api/sounds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...effect, soundLibraryId }),
        });
        if (!response.ok) throw new Error("Failed to add sound");
        const newSound = await response.json();
        updateLibraryState(soundLibraryId, (lib) => ({
          ...lib,
          sounds: [...lib.sounds, newSound],
        }));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Handle error in UI if needed
    }
  };

  const updateSoundLabel = async (sound: Sound, newLabel: string) => {
    const response = await fetch(`/api/sounds`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sound, label: newLabel }),
    });
    const updatedSound: Sound = await response.json();

    updateLibraryState(updatedSound.soundLibraryId!, (lib) => ({
      ...lib,
      sounds: lib.sounds.map((s) => (s.cid === sound.cid ? updatedSound : s)),
    }));
  };

  const toggleFavoriteSound = async (sound: Sound) => {
    const response = await fetch(`/api/sounds`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sound, isFavorite: !sound.isFavorite }),
    });
    const updatedSound: Sound = await response.json();

    updateLibraryState(updatedSound.soundLibraryId!, (lib) => ({
      ...lib,
      sounds: lib.sounds.map((s) => (s.cid === sound.cid ? updatedSound : s)),
    }));
  };

  const createSoundLibrary = async (name: string, type: string, id: string) => {
    try {
      const response = await fetch("/api/soundlibrary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          [`${type}Id`]: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create sound library");
      }

      const newLibrary = await response.json();
      setSoundLibraries((prev) => [...prev, { ...newLibrary, sounds: [] }]);
      return newLibrary;
    } catch (error) {
      console.error("Error creating sound library:", error);
      throw error;
    }
  };

  const deleteLibrary = async (libraryId: string) => {
    try {
      const response = await fetch(`/api/soundlibrary?id=${libraryId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete library");
      setSoundLibraries((libraries) =>
        libraries.filter((lib) => lib.id !== libraryId)
      );
    } catch (error) {
      console.error("Error deleting library:", error);
    }
  };

  const renameLibrary = async (libraryId: string, newName: string) => {
    try {
      if (!libraryId || !newName.trim()) {
        throw new Error("Invalid input");
      }

      const response = await fetch(`/api/soundlibrary`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: libraryId, name: newName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename library");
      }

      await response.json();
      setSoundLibraries((libraries) =>
        libraries.map((lib) =>
          lib.id === libraryId ? { ...lib, name: newName.trim() } : lib
        )
      );
    } catch (error) {
      console.error("Error renaming library:", error);
      throw error;
    }
  };

  return {
    soundLibraries,
    toggleFavorite,
    loadSoundLibraries,
    updateSoundLabel,
    toggleFavoriteSound,
    createSoundLibrary,
    deleteLibrary,
    renameLibrary,
  };
}

export function BoardContextProvider({
  sessionId,
  gameMasterId,
  gameId,
  children,
}: {
  sessionId: string;
  gameMasterId: string;
  gameId: string;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={{ sessionId, gameMasterId, gameId }}>
      {providers.reduce(
        (acc, Provider) => (
          <Provider>{acc}</Provider>
        ),
        children
      )}
    </SessionContext.Provider>
  );
}

const providers = [
  MidiProvider,
  FavoritesProvider,
  LightPresetsProvider,
  // Add future providers here
];
