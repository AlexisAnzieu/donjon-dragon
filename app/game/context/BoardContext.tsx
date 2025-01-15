import { ReactNode } from "react";
import { createStorageContext } from "./createContext";

export const {
  Provider: FavoritesProvider,
  useStorageContext: useFavoritesStorage,
} = createStorageContext<string[]>({
  key: "soundFavorites",
  defaultValue: [],
  maxItems: 9,
});

export function useFavorites() {
  const { data: favorites, setData: setFavorites } = useFavoritesStorage();

  const toggleFavorite = (effectId: string) => {
    setFavorites(
      favorites.includes(effectId)
        ? favorites.filter((id) => id !== effectId)
        : favorites.length >= 9
        ? favorites
        : [...favorites, effectId]
    );
  };

  return { favorites, toggleFavorite };
}

export function BoardContextProvider({ children }: { children: ReactNode }) {
  return providers.reduce(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}

const providers = [
  FavoritesProvider,
  // Add future providers here
];
