import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Class, Race, classes, races } from "./races";
import { Background, BACKGROUNDS } from "./BackgroundSelection";
import {
  AbilityScoreKey,
  DEFAULT_ABILITY_SCORES,
  RollDetail,
} from "./AbilityScores";
import { Prisma } from "@prisma/client";

interface Details {
  name: string;
  alignment: string;
  traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
}

type CharacterContextType = {
  selectedRace: Race | null;
  selectedClass: Class | null;
  background: Background | null;
  abilityScores: Record<AbilityScoreKey, number>;
  selectedEquipment: string[] | null;
  selectedSkills: string[];
  areAbilitiesCalculated: boolean;
  rollDetails: Record<AbilityScoreKey, RollDetail | null>;
  handleRaceChange: (race: Race | null) => void;
  handleClassChange: (characterClass: Class | null) => void;
  handleBackgroundChange: (background: Background | null) => void;
  handleScoresChange: (scores: Record<AbilityScoreKey, number>) => void;
  handleSkillChange: (skills: string[]) => void;
  handleEquipmentChange: (equipment: string[] | null) => void;
  setAreAbilitiesCalculated: (value: boolean) => void;
  setRollDetails: (details: Record<AbilityScoreKey, RollDetail | null>) => void;
  calculateHP: () => number | null;
  calculateAC: () => number;
  calculateInitiative: () => number;
  calculateModifier: (abilityScore: number) => number;
  activeStep: number | null;
  setActiveStep: (step: number | null) => void;
  saveCharacter: (gameId?: string | null) => Promise<void>;
  loadCharacter: (id: string) => Promise<void>;
  characterId: string | null;
  games: string[];
  details: Details;
  setDetails: (traits: Details) => void;
};

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [background, setBackground] = useState<Background | null>(null);
  const [abilityScores, setAbilityScores] = useState(DEFAULT_ABILITY_SCORES);
  const [selectedEquipment, setSelectedEquipment] = useState<string[] | null>(
    null
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [areAbilitiesCalculated, setAreAbilitiesCalculated] = useState(false);
  const [rollDetails, setRollDetails] = useState<
    Record<AbilityScoreKey, RollDetail | null>
  >(
    Object.keys(DEFAULT_ABILITY_SCORES).reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {}
    ) as Record<AbilityScoreKey, RollDetail | null>
  );
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [games, setGames] = useState<string[]>([]);
  const [details, setDetails] = useState<Details>({
    name: "",
    alignment: "",
    traits: "",
    ideals: "",
    bonds: "",
    flaws: "",
  });

  const handleRaceChange = (race: Race | null) => {
    setAreAbilitiesCalculated(false);
    setAbilityScores(DEFAULT_ABILITY_SCORES);
    setSelectedRace(race);
    if (race) setActiveStep(2); // Advance to class selection
  };

  const handleClassChange = (characterClass: Class | null) => {
    setSelectedClass(characterClass);
    setSelectedEquipment(null); // Reset equipment
    setSelectedSkills([]); // Reset skills when class changes
    if (characterClass) setActiveStep(3); // Advance to background selection
  };

  const handleBackgroundChange = (newBackground: Background | null) => {
    setBackground(newBackground);
    setSelectedSkills([]); // Reset skills when background changes
    if (newBackground) setActiveStep(4); // Now moves to skills selection
  };

  const handleSkillChange = (skills: string[]) => {
    setSelectedSkills(skills);
    if (skills.length === selectedClass?.skills.canSelect) setActiveStep(5);
  };

  const handleScoresChange = (scores: Record<AbilityScoreKey, number>) => {
    setAreAbilitiesCalculated(true);
    setAbilityScores(scores);
    setActiveStep(6);
  };

  const handleEquipmentChange = (equipment: string[] | null) => {
    setSelectedEquipment(equipment);
    if (equipment?.filter(Boolean).length === selectedClass?.equipment.length)
      setActiveStep(7);
  };

  const calculateModifier = (abilityScore: number): number => {
    return Math.floor((abilityScore - 10) / 2);
  };

  const calculateHP = () => {
    if (!selectedClass || !abilityScores.constitution) return null;
    const classData = classes.find((cls) => cls.name === selectedClass.name);
    if (!classData) return null;
    return (
      classData.hitPointDice + calculateModifier(abilityScores.constitution)
    );
  };

  const calculateAC = useCallback(() => {
    const baseAC = 10;
    if (!abilityScores.dextérité) return baseAC;

    const dexModifier = calculateModifier(abilityScores.dextérité);
    let totalAC = baseAC + dexModifier;

    if (!selectedEquipment) return totalAC;

    const hasMailArmor = selectedEquipment.some((item) =>
      item?.toLowerCase().includes("cotte de mailles")
    );
    const hasLeatherArmor = selectedEquipment.some((item) =>
      item?.toLowerCase().includes("armure de cuir")
    );
    const hasShield = selectedEquipment.some((item) =>
      item?.toLowerCase().includes("bouclier")
    );

    if (hasMailArmor) totalAC = 16;
    if (hasLeatherArmor) totalAC++;
    if (hasShield) totalAC += 2;

    return totalAC;
  }, [selectedEquipment, abilityScores.dextérité]);

  const calculateInitiative = () => {
    return Math.floor((abilityScores.dextérité - 10) / 2);
  };

  const saveCharacter = async (gameId?: string | null) => {
    try {
      const data: Prisma.CharacterCreateInput = {
        race: selectedRace?.name,
        class: selectedClass?.name,
        background: background?.name,
        abilityScores: abilityScores,
        equipment: selectedEquipment || [],
        skills: selectedSkills,
        rollDetails: rollDetails,
        name: details.name,
        alignment: details.alignment,
        traits: details.traits,
        ideals: details.ideals,
        bonds: details.bonds,
        flaws: details.flaws,
        hp: calculateHP(),
        ...(gameId && {
          games: {
            connect: {
              id: gameId,
            },
          },
        }),
      };

      if (characterId) {
        // TODO: Implement PUT/PATCH endpoint for updates
        throw new Error("Update not implemented yet");
      } else {
        const response = await fetch("/api/character", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to save character");
        }

        const character = await response.json();
        setCharacterId(character.id);
      }
    } catch (error) {
      console.error("Failed to save character:", error);
      throw error;
    }
  };

  const loadCharacter = async (id: string) => {
    try {
      const response = await fetch(`/api/character?id=${id}`);

      if (!response.ok) {
        throw new Error("Failed to load character");
      }

      const character: Prisma.CharacterGetPayload<{
        include: { games: { select: { id: true } } };
      }> = await response.json();

      setDetails({
        name: character.name,
        alignment: character.alignment || "",
        traits: character.traits || "",
        ideals: character.ideals || "",
        bonds: character.bonds || "",
        flaws: character.flaws || "",
      });

      setGames(character.games.map((game) => game.id));

      setCharacterId(character.id);
      setSelectedRace(races.find((r) => r.name === character.race) || null);
      setSelectedClass(
        classes.find((cls) => cls.name === character.class) || null
      );
      setBackground(
        BACKGROUNDS.find((bg) => bg.name === character.background) || null
      );
      setAbilityScores(
        character.abilityScores as Record<AbilityScoreKey, number>
      );
      setSelectedEquipment(character.equipment as string[]);
      setSelectedSkills(character.skills as string[]);
      setRollDetails(
        character.rollDetails as Record<AbilityScoreKey, RollDetail | null>
      );
      setAreAbilitiesCalculated(true);
    } catch (error) {
      console.error("Failed to load character:", error);
      throw error;
    }
  };

  return (
    <CharacterContext.Provider
      value={{
        selectedRace,
        selectedClass,
        background,
        abilityScores,
        selectedEquipment,
        selectedSkills,
        areAbilitiesCalculated,
        rollDetails,
        handleRaceChange,
        handleClassChange,
        handleBackgroundChange,
        handleScoresChange,
        handleSkillChange,
        handleEquipmentChange,
        setAreAbilitiesCalculated,
        setRollDetails,
        calculateHP,
        calculateAC,
        calculateInitiative,
        calculateModifier,
        activeStep,
        setActiveStep,
        saveCharacter,
        loadCharacter,
        characterId,
        games,
        details,
        setDetails,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
};
