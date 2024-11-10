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
import BackgroundSelection from "./BackgroundSelection";
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
  };

  const handleClassChange = (characterClass: string | null) => {
    setSelectedClass(characterClass);
  };

  const onScoresChange = (scores: Record<AbilityScoreKey, number>) => {
    setAreAbilitiesCalculated(true);
    setAbilityScores(scores);
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
  const [background, setBackground] = useState<string | null>(null);
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
    <div className="min-h-screen bg-gray-100 text-gray-800 px-8 pt-3 pb-32">
      <div
        className={`flex ${
          !selectedClass && !selectedRace
            ? "flex-col"
            : "flex-col-reverse lg:flex-row"
        } transition-all duration-500 ease-in-out pl-6`}
      >
        <div
          className={`w-full ${
            !selectedClass && !selectedRace ? "p-28" : "lg:w-2/3"
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
          {Object.values(abilityScores).some((score) => score !== 10) && (
            <Step
              stepNumber={4}
              title="4. Choisir l'historique"
              content={
                <BackgroundSelection
                  selectedBackground={background}
                  onBackgroundChange={setBackground}
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
          } transition-all duration-500 ease-in-out pt-10`}
        >
          <div className="sticky top-0">
            <div className="flex flex-col items-center mt-6 text-center">
              {selectedRace && (
                <div className="bg-white shadow-lg rounded-lg p-6 min-w-96">
                  <div className="mb-2 text-2xl">
                    Tu es un{" "}
                    <span className="text-primary font-extrabold text-3xl">
                      {selectedRace} {selectedClass}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <Image
                      className="rounded-full border-4 border-red-700 shadow-xl"
                      height={200}
                      width={200}
                      src={`/img/race/${selectedRace}.jpg`}
                      alt="Character Image"
                    />
                  </div>
                  {selectedClass && areAbilitiesCalculated && (
                    <div className="mt-4">
                      <h4 className="font-bold text-lg">
                        Points de vie: {calculateHP()}
                      </h4>
                    </div>
                  )}
                  {areAbilitiesCalculated && (
                    <>
                      <h3 className="text-xl font-bold pt-5">
                        Caractéristiques
                      </h3>
                      <ul className="list-disc list-inside">
                        {Object.entries(abilityScores).map(
                          ([ability, score]) => {
                            const modifier = Math.floor((score - 10) / 2);
                            const sign = modifier >= 0 ? "+" : "";

                            return (
                              <li key={ability}>
                                {ability.charAt(0).toUpperCase() +
                                  ability.slice(1)}{" "}
                                : {score} ({sign}
                                {modifier})
                              </li>
                            );
                          }
                        )}
                      </ul>

                      {background && (
                        <div className="mt-2">
                          <h4 className="font-bold">
                            Historique: {background}
                          </h4>
                        </div>
                      )}
                      {details.name && (
                        <div className="mt-2">
                          <h4 className="font-bold">Nom: {details.name}</h4>
                          <p>Alignement: {details.alignment}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
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
