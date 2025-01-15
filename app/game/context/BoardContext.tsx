import { ReactNode } from "react";
import { createStorageContext } from "./createContext";
import { Effect } from "@/app/soundcraft/effects";

export const FAVORITE_SOUNDS = "soundFavorites";

export const {
  Provider: FavoritesProvider,
  useStorageContext: useFavoritesStorage,
} = createStorageContext<Effect[]>({
  key: FAVORITE_SOUNDS,
  defaultValue: [],
  maxItems: 9,
});

export function useFavorites() {
  const { data: favorites, setData: setFavorites } = useFavoritesStorage();

  const toggleFavorite = (effect: Effect) => {
    setFavorites(
      favorites.map((f) => f.id).includes(effect.id)
        ? favorites.filter((f) => f.id !== effect.id)
        : favorites.length >= 9
        ? favorites
        : [...favorites, effect]
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
