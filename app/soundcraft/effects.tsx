export enum EffectCategory {
  COMBAT = "Combat",
  WEATHER = "Weather",
  ANIMALS = "Animals",
  TRANSPORTATION = "Transportation",
  MUSIC = "Music",
  MISC = "Misc",
}

export type Effect = {
  id: string;
  label: string;
  icon?: string;
  src: string;
  category: EffectCategory;
  loop?: boolean;
  volume?: number;
};

const createEffect = (
  id: string,
  label: string,
  src: string,
  category: EffectCategory,
  icon?: string,
  loop: boolean = false,
  volume: number = 1
): Effect => ({
  id,
  label,
  icon,
  src,
  category,
  loop,
  volume,
});

export const effects: Effect[] = [
  createEffect(
    "sword",
    "Sword Clash",
    "https://s3.h2t.club/soundcraft/dark-forest%2Fbear1.ogg",
    EffectCategory.COMBAT,
    "⚔️"
  ),
  createEffect(
    "rain1",
    "Light Rain",
    "https://s3.h2t.club/soundcraft/dark-forest%2Fbear1.ogg",
    EffectCategory.WEATHER
  ),
  createEffect(
    "rain2",
    "Medium Rain",
    "https://s3.h2t.club/soundcraft/dark-forest/rain2_lp.ogg",
    EffectCategory.WEATHER,
    "⛈️"
  ),
  createEffect(
    "rain3",
    "Heavy Rain",
    "https://s3.h2t.club/soundcraft/dark-forest/rain3_lp.ogg",
    EffectCategory.WEATHER,
    "🌊"
  ),
  createEffect(
    "stream",
    "Stream",
    "https://s3.h2t.club/soundcraft/dark-forest/stream1_lp.ogg",
    EffectCategory.WEATHER,
    "💧"
  ),
  createEffect(
    "footsteps",
    "Footsteps",
    "https://s3.h2t.club/soundcraft/dark-forest/footsteps1_lp.ogg",
    EffectCategory.WEATHER,
    "👣"
  ),
  createEffect(
    "bear",
    "Bear",
    "https://s3.h2t.club/soundcraft/dark-forest/bear1.ogg",
    EffectCategory.ANIMALS,
    "🐻"
  ),
  createEffect(
    "hawk",
    "Hawk",
    "https://s3.h2t.club/soundcraft/dark-forest/hawk1.ogg",
    EffectCategory.ANIMALS,
    "🦅"
  ),
  createEffect(
    "owl",
    "Owl",
    "https://s3.h2t.club/soundcraft/dark-forest/owl2.ogg",
    EffectCategory.ANIMALS,
    "🦉"
  ),
  createEffect(
    "snake",
    "Snake",
    "https://s3.h2t.club/soundcraft/dark-forest/snake1.ogg",
    EffectCategory.ANIMALS,
    "🐍"
  ),
  createEffect(
    "dogs",
    "Dogs Barking",
    "https://s3.h2t.club/soundcraft/dark-forest/dogs_barking.ogg",
    EffectCategory.ANIMALS,
    "🐕"
  ),
  createEffect(
    "horsecart",
    "Horse Cart",
    "https://s3.h2t.club/soundcraft/dark-forest/horsecart1_lp.ogg",
    EffectCategory.TRANSPORTATION,
    "🐎"
  ),
  createEffect(
    "horses",
    "Horses",
    "https://s3.h2t.club/soundcraft/dark-forest/horses1_lp.ogg",
    EffectCategory.TRANSPORTATION,
    "🐎"
  ),
  createEffect(
    "scared_horses",
    "Scared Horses",
    "https://s3.h2t.club/soundcraft/dark-forest/scared_horses2.ogg",
    EffectCategory.TRANSPORTATION,
    "😱"
  ),
  createEffect(
    "thunder1",
    "Thunder Crash",
    "https://s3.h2t.club/soundcraft/dark-forest/thunder1.ogg",
    EffectCategory.WEATHER,
    "⚡"
  ),
  createEffect(
    "thunder2",
    "Thunder Roll",
    "https://s3.h2t.club/soundcraft/dark-forest/thunder2.ogg",
    EffectCategory.WEATHER,
    "🌩️"
  ),
  createEffect(
    "eerie_flute",
    "Eerie Flute",
    "https://s3.h2t.club/soundcraft/dark-forest/music_eerie_flute1.ogg",
    EffectCategory.MUSIC,
    "🎭"
  ),
  createEffect(
    "forest_action",
    "Forest Action",
    "https://s3.h2t.club/soundcraft/dark-forest/music_forest_action1.ogg",
    EffectCategory.MUSIC,
    "🎬"
  ),
  createEffect(
    "forest_combat",
    "Forest Combat",
    "https://s3.h2t.club/soundcraft/dark-forest/music_forest_combat1.ogg",
    EffectCategory.MUSIC,
    "⚔️"
  ),
  createEffect(
    "trees_fall",
    "Falling Trees",
    "https://s3.h2t.club/soundcraft/dark-forest/trees_fall1.ogg",
    EffectCategory.MISC,
    "🌳"
  ),
  createEffect(
    "snarl",
    "Snarl",
    "https://s3.h2t.club/soundcraft/dark-forest/snarl1.ogg",
    EffectCategory.MISC,
    "👹"
  ),
  createEffect(
    "spirit_breath",
    "Spirit Breath",
    "https://s3.h2t.club/soundcraft/dark-forest/spirit_breath1.ogg",
    EffectCategory.MISC,
    "👻"
  ),
].sort((a, b) => a.category.localeCompare(b.category));
