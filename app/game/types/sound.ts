import { Sound, SoundLibrary } from "@prisma/client";

export interface SoundLibraryWithSounds extends SoundLibrary {
  sounds: Sound[];
}

export interface SoundUpdate {
  label: string;
}

export interface SoundContextState {
  soundLibraries: SoundLibraryWithSounds[];
  toggleFavorite: (effect: Sound, soundLibraryId: string) => Promise<void>;
  loadSoundLibraries: () => Promise<void>;
  updateSoundLabel: (sound: Sound, newLabel: string) => Promise<void>;
  toggleFavoriteSound: (sound: Sound) => Promise<void>;
}
