"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import RaceSelection from "./RaceSelection";
import ClassSelection from "./ClassSelection";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AbilityScores, {
  AbilityScoreKey,
  DEFAULT_ABILITY_SCORES,
  RollDetail,
} from "./AbilityScores";
import BackgroundSelection, { Background } from "./BackgroundSelection";
import { Class, classes, Race, races } from "./races";
import Step from "./Step";
import CharacterSheet from "./components/CharacterSheet";
import EquipmentSelection from "./EquipmentSelection";
import SkillSelection from "./SkillSelection";

function CharacterBuildContent() {
  const searchParams = useSearchParams();
  const characterClassParam = searchParams.get("characterClass");
  const characterClass =
    classes.find((cls) => cls.name === characterClassParam) || null;

  const raceParam = searchParams.get("race");
  const race = races.find((r) => r.name === raceParam) || null;
  const [areAbilitiesCalculated, setAreAbilitiesCalculated] =
    useState<boolean>(false);

  const [selectedRace, setSelectedRace] = useState<Race | null>(race);
  const [selectedClass, setSelectedClass] = useState<Class | null>(
    characterClass
  );

  const hasAnsweredQuiz = selectedRace && selectedClass;
  const [activeStep, setActiveStep] = useState<number | null>(
    hasAnsweredQuiz ? 3 : 1
  );

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedRace) params.set("race", selectedRace.name);
    if (selectedClass) params.set("characterClass", selectedClass.name);
    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  }, [selectedRace, selectedClass, router]);

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

  const handleSkillChange = (skills: string[]) => {
    setSelectedSkills(skills);
    if (skills.length === selectedClass?.skills.canSelect) setActiveStep(4);
  };

  const onScoresChange = (scores: Record<AbilityScoreKey, number>) => {
    setAreAbilitiesCalculated(true);
    setAbilityScores(scores);
    setActiveStep(5);
  };

  const handleBackgroundChange = (newBackground: Background | null) => {
    setBackground(newBackground);
    if (newBackground) setActiveStep(4); // Now moves to skills selection
  };

  const [rollDetails, setRollDetails] = useState<
    Record<AbilityScoreKey, RollDetail | null>
  >(
    Object.keys(DEFAULT_ABILITY_SCORES).reduce<
      Record<AbilityScoreKey, RollDetail | null>
    >(
      (acc, key) => ({ ...acc, [key]: null }),
      {} as Record<AbilityScoreKey, RollDetail | null>
    )
  );

  const [abilityScores, setAbilityScores] = useState(DEFAULT_ABILITY_SCORES);
  const [background, setBackground] = useState<Background | null>(null);
  const [details] = useState({
    name: "",
    alignment: "",
    personality: "",
    ideals: "",
    bonds: "",
    flaws: "",
  });

  const [selectedEquipment, setSelectedEquipment] = useState<string[] | null>(
    null
  );

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const calculateHP = () => {
    if (!selectedClass || !abilityScores.constitution) return null;

    const classData = classes.find((cls) => cls.name === selectedClass.name);
    if (!classData) return null;

    const baseHP = classData.hitPointDice;
    const constitutionModifier = calculateModifier(abilityScores.constitution);

    return baseHP + constitutionModifier;
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

    if (hasMailArmor) {
      totalAC = 16;
    }

    if (hasLeatherArmor) {
      totalAC++;
    }

    if (hasShield) {
      totalAC += 2;
    }

    return totalAC;
  }, [selectedEquipment, abilityScores.dextérité]);

  useEffect(() => {
    calculateAC();
  }, [selectedEquipment, abilityScores.dextérité, calculateAC]);

  const calculateInitiative = () => {
    return Math.floor((abilityScores.dextérité - 10) / 2);
  };

  const calculateModifier = (abilityScore: number): number => {
    return Math.floor((abilityScore - 10) / 2);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-4 sm:px-8 pt-3 ">
      <div
        className={`flex ${
          !selectedClass && !selectedRace ? "flex-col" : "flex-col lg:flex-row"
        } transition-all duration-500 ease-in-out pl-2 sm:pl-6`}
      >
        <div
          className={`w-full ${
            !selectedClass && !selectedRace ? "p-4" : "lg:w-2/3"
          } transition-all duration-500 ease-in-out py-6`}
        >
          {!selectedClass && !selectedRace && (
            <div className="flex flex-col justify-center items-center text-center mb-4">
              Tu ne sais pas par où commencer ?{" "}
              <Link href="/character-quiz">
                <span className="text-primary font-bold underline hover:text-red-700">
                  Réponds aux 10 questions !
                </span>
              </Link>
            </div>
          )}
          <Step
            stepNumber={1}
            title="1. Choisis une Race"
            content={
              <RaceSelection
                selectedRace={selectedRace}
                setSelectedRace={handleRaceChange}
              />
            }
            isFilled={!!selectedRace}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
          {selectedRace && (
            <Step
              stepNumber={2}
              title="2. Choisis une Classe"
              content={
                <ClassSelection
                  selectedClass={selectedClass}
                  setSelectedClass={handleClassChange}
                />
              }
              isFilled={!!selectedClass}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}
          {selectedClass && (
            <Step
              stepNumber={3}
              title="3. Choisis ton Historique"
              content={
                <BackgroundSelection
                  selectedBackground={background}
                  onBackgroundChange={handleBackgroundChange}
                />
              }
              isFilled={!!background}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}
          {background && selectedClass && (
            <Step
              stepNumber={4}
              title="4. Choisis tes compétences"
              content={
                <SkillSelection
                  selectedClass={selectedClass}
                  selectedSkills={selectedSkills}
                  onSkillsChange={handleSkillChange}
                  background={background}
                />
              }
              isFilled={
                selectedSkills.length === selectedClass?.skills.canSelect
              }
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}
          {selectedSkills.length === selectedClass?.skills.canSelect && (
            <Step
              stepNumber={5}
              title="5. Calcul tes caractéristiques"
              content={
                <AbilityScores
                  scores={abilityScores}
                  onScoresChange={onScoresChange}
                  race={selectedRace}
                  rollDetails={rollDetails}
                  onRollDetailsChange={setRollDetails}
                />
              }
              isFilled={areAbilitiesCalculated}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}
          {Object.values(abilityScores).some((score) => score !== 10) && (
            <Step
              stepNumber={6}
              title="6. Choisis tes équipements"
              content={
                <EquipmentSelection
                  selectedClass={selectedClass}
                  selectedEquipment={selectedEquipment}
                  setSelectedEquipment={setSelectedEquipment}
                />
              }
              isFilled={
                selectedEquipment?.length ===
                classes.find((c) => c.name === selectedClass?.name)?.equipment
                  .length
              }
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}
        </div>
        <div
          className={`w-full ${
            !selectedClass && !selectedRace
              ? "lg:w-0"
              : "lg:w-1/3 flex flex-col"
          } transition-all duration-500 ease-in-out`}
        >
          <div className="pt-4 sm:pt-10 pl-2 sm:pl-7 pb-10">
            <CharacterSheet
              selectedRace={selectedRace}
              selectedClass={selectedClass}
              areAbilitiesCalculated={areAbilitiesCalculated}
              abilityScores={abilityScores}
              background={background}
              calculateHP={calculateHP}
              calculateAC={calculateAC}
              calculateInitiative={calculateInitiative}
              details={details}
              selectedEquipment={selectedEquipment}
              selectedSkills={selectedSkills} // Add this line
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CharacterBuild() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CharacterBuildContent />
    </Suspense>
  );
}
