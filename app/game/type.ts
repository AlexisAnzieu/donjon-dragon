import { Token } from "@prisma/client";

export type TokenType = "characters" | "enemies" | "npcs" | "notes";
export type MonsterSize = "TP" | "P" | "M" | "G" | "TG";

export const DEFAULT_TOKEN_SIZE = 0.3;

export interface TokenState {
  characters: Token[];
  enemies: Token[];
  npcs: Token[];
  notes: Token[];
}

export interface ContextMenuState {
  x: number;
  y: number;
  tokenId: string;
  tokenType: TokenType;
}

export interface NewTokenFormState {
  x: number;
  y: number;
  isOpen: boolean;
  type: TokenType;
  name: string;
  hitPoint: number;
  maxHitPoint: number; // Add this line
}

export const MONSTER_SIZE_SCALE: Record<MonsterSize, number> = {
  TP: 0.2,
  P: 0.25,
  M: 0.3,
  G: 0.4,
  TG: 0.5,
};

export const raceIcons: Record<string, string> = {
  Humain: "🧑",
  Elfe: "🧝",
  Halfelin: "🧒",
};
