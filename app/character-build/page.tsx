"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
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
import { classes } from "./races";
import Step from "./Step";

function CharacterBuildContent() {
  const searchParams = useSearchParams();
  const characterClass = searchParams.get("characterClass");
  const race = searchParams.get("race");
  const [areAbilitiesCalculated, setAreAbilitiesCalculated] =
    useState<boolean>(false);

  const [selectedRace, setSelectedRace] = useState<string | null>(race);
  const [selectedClass, setSelectedClass] = useState<string | null>(
    characterClass
  );

  const hasAnsweredQuiz = selectedRace && selectedClass;
  const [activeStep, setActiveStep] = useState<number | null>(
    hasAnsweredQuiz ? 3 : 1
  );

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedRace) params.set("race", selectedRace);
    if (selectedClass) params.set("characterClass", selectedClass);
    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  }, [selectedRace, selectedClass, router]);

  const handleRaceChange = (race: string | null) => {
    setAreAbilitiesCalculated(false);
    setAbilityScores(DEFAULT_ABILITY_SCORES);
    setSelectedRace(race);
    if (race) setActiveStep(2); // Advance to class selection
  };

  const handleClassChange = (characterClass: string | null) => {
    setSelectedClass(characterClass);
    if (characterClass) setActiveStep(3); // Advance to ability scores
  };

  const onScoresChange = (scores: Record<AbilityScoreKey, number>) => {
    setAreAbilitiesCalculated(true);
    setAbilityScores(scores);
    setActiveStep(4); // Advance to background selection
  };

  const handleBackgroundChange = (newBackground: Background | null) => {
    setBackground(newBackground);
    if (newBackground) setActiveStep(5); // Advance to next step (if any)
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

  const calculateHP = () => {
    if (!selectedClass || !abilityScores.constitution) return null;

    const classData = classes.find((cls) => cls.name === selectedClass);
    if (!classData) return null;

    const baseHP = classData.hitPointDice;
    const constitutionModifier = calculateModifier(abilityScores.constitution);
    const modifierSymbol = constitutionModifier >= 0 ? "+" : "-";

    return `${
      baseHP + constitutionModifier
    } (${baseHP} ${modifierSymbol} ${Math.abs(
      constitutionModifier
    )} Constitution)`;
  };

  const calculateModifier = (abilityScore: number): number => {
    return Math.floor((abilityScore - 10) / 2);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-4 sm:px-8 pt-3 pb-32">
      <div
        className={`flex ${
          !selectedClass && !selectedRace ? "flex-col" : "flex-col lg:flex-row"
        } transition-all duration-500 ease-in-out pl-2 sm:pl-6`}
      >
        <div
          className={`w-full ${
            !selectedClass && !selectedRace ? "p-4 sm:p-28" : "lg:w-2/3"
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
              title="3. Calcul tes caractéristiques"
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
          {(Object.values(abilityScores).some((score) => score !== 10) ||
            !!background) && (
            <Step
              stepNumber={4}
              title="4. Choisir l'historique"
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
        </div>
        <div
          className={`w-full ${
            !selectedClass && !selectedRace
              ? "lg:w-0"
              : "lg:w-1/3 flex flex-col"
          } transition-all duration-500 ease-in-out`}
        >
          <div className=" pt-4 sm:pt-10 pl-2 sm:pl-7">
            {selectedRace && (
              <div className="bg-white shadow-2xl rounded-lg p-4 sm:p-6 w-full sm:min-w-96">
                {/* Character Header */}
                <div className="mb-4 sm:mb-6 text-center">
                  <h2 className="text-3xl font-medieval">
                    <span className="text-primary font-extrabold">
                      {selectedRace} {selectedClass}
                    </span>
                  </h2>
                  <div className="relative my-4">
                    <Image
                      className="rounded-full border-4 border-red-700 shadow-2xl mx-auto w-32 h-32 sm:w-[200px] sm:h-[200px]"
                      height={200}
                      width={200}
                      src={`/img/race/${selectedRace}.jpg`}
                      alt="Character Image"
                    />
                    {selectedClass && areAbilitiesCalculated && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-red-700 text-white px-4 py-1 rounded-full shadow-lg">
                          <span className="font-bold">HP: {calculateHP()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ability Scores */}
                {areAbilitiesCalculated && (
                  <div className="mt-6 sm:mt-8">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 text-center border-b-2 border-red-700 pb-2">
                      Caractéristiques
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-4">
                      {Object.entries(abilityScores).map(([ability, score]) => {
                        const modifier = Math.floor((score - 10) / 2);
                        const sign = modifier >= 0 ? "+" : "";
                        return (
                          <div
                            key={ability}
                            className="bg-gray-50 p-3 rounded-lg text-center"
                          >
                            <div className="text-sm text-gray-600 uppercase">
                              {ability.charAt(0).toUpperCase() +
                                ability.slice(1)}
                            </div>
                            <div className="text-xl font-bold text-red-700">
                              {score}
                            </div>
                            <div className="text-sm font-medium">
                              ({sign}
                              {modifier})
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Background Section */}
                {background && (
                  <div className="mt-4 sm:mt-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center border-b-2 border-red-700 pb-2">
                      {background.name}
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        {
                          label: "Compétences",
                          value: background.skills,
                          icon: "🎯",
                        },
                        {
                          label: "Équipement",
                          value: background.equipment,
                          icon: "⚔️",
                        },
                        ...(background.tools
                          ? [
                              {
                                label: "Maitrise",
                                value: background.tools,
                                icon: "🛠️",
                              },
                            ]
                          : []),
                      ].map(({ label, value, icon }) => (
                        <div key={label} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 font-semibold mb-1">
                            <span>{icon}</span>
                            <span>{label}</span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {value.join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Character Details */}
                {details.name && (
                  <div className="mt-4 sm:mt-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Détails du personnage</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Nom:</span> {details.name}
                      </p>
                      <p>
                        <span className="font-medium">Alignement:</span>{" "}
                        {details.alignment}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
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
