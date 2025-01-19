import { ReactNode, createContext, useContext } from "react";
import { createStorageContext } from "./createContext";
import { Sound } from "@prisma/client";
import { BoardSession } from "@/app/api/sessions/route";

export const FAVORITE_SOUNDS = "soundFavorites";

const SessionContext = createContext<string | null>(null);

export const {
  Provider: FavoritesProvider,
  useStorageContext: useFavoritesStorage,
} = createStorageContext<Sound[]>({
  key: FAVORITE_SOUNDS,
  defaultValue: [],
  maxItems: 9,
});

function useSessionId() {
  const sessionId = useContext(SessionContext);
  if (!sessionId) {
    throw new Error(
      "Board components must be used within a BoardContextProvider with sessionId"
    );
  }
  return sessionId;
}

export function useFavorites() {
  const sessionId = useSessionId();
  const { data: favorites, setData: setFavorites } = useFavoritesStorage();

  const loadFavorites = async () => {
    const response = await fetch(`/api/sessions?id=${sessionId}`);
    const data: BoardSession = await response.json();
    setFavorites(data.favoriteSongs);
  };

  const toggleFavorite = async (effect: Sound) => {
    const newFavorites = favorites.map((f) => f.id).includes(effect.id)
      ? favorites.filter((f) => f.id !== effect.id)
      : favorites.length >= 9
      ? favorites
      : [...favorites, effect];

    setFavorites(newFavorites);

    await fetch(`/api/sessions?id=${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sounds: newFavorites }),
    });
  };

  const updateSoundLabel = async (soundId: string, newLabel: string) => {
    const newFavorites = favorites.map((sound) =>
      sound.id === soundId ? { ...sound, label: newLabel } : sound
    );

    setFavorites(newFavorites);

    await fetch(`/api/sessions?id=${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sounds: newFavorites }),
    });
  };

  return { favorites, toggleFavorite, loadFavorites, updateSoundLabel };
}

export function BoardContextProvider({
  sessionId,
  children,
}: {
  sessionId: string;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={sessionId}>
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
  FavoritesProvider,
  // Add future providers here
];
