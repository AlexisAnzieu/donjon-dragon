import { useState, useCallback } from "react";
import { Monster } from "@prisma/client";
import { searchMonsters } from "@/lib/dd5";

export function useMonsterSearch() {
  const [searchResults, setSearchResults] = useState<Monster[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMonster = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const monsters = await searchMonsters({ slug: searchTerm.toLowerCase() });
      setSearchResults(monsters);
    } catch (error) {
      console.error("Error searching monsters:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    searchResults,
    setSearchResults,
    isSearching,
    searchMonster,
  };
}
