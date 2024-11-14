"use client";

import { useEffect, Suspense, useState } from "react";
import RaceSelection from "./RaceSelection";
import ClassSelection from "./ClassSelection";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AbilityScores from "./AbilityScores";
import BackgroundSelection from "./BackgroundSelection";
import { classes, races } from "./races";
import Step from "./Step";
import CharacterSheet from "./components/CharacterSheet";
import EquipmentSelection from "./EquipmentSelection";
import SkillSelection from "./SkillSelection";
import { CharacterProvider, useCharacter } from "./characterContext";
import Details from "./Details";

function CharacterBuildContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    abilityScores,
    selectedRace,
    selectedClass,
    background,
    selectedSkills,
    areAbilitiesCalculated,
    handleRaceChange,
    handleClassChange,
    selectedEquipment,
    activeStep,
    setActiveStep,
    loadCharacter,
    saveCharacter,
    characterId,
    games,
    details,
  } = useCharacter();

  const characterClassParam = searchParams.get("characterClass");
  const raceParam = searchParams.get("race");
  const characterIdParam = searchParams.get("id");
  const gameId = searchParams.get("gameId");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (characterIdParam) {
      loadCharacter(characterIdParam);
      setActiveStep(null);
      setIsLoading(false);
      return;
    }
    const classFromParam =
      classes.find((cls) => cls.name === characterClassParam) || null;
    const raceFromParam = races.find((r) => r.name === raceParam) || null;
    if (classFromParam) handleClassChange(classFromParam);
    if (raceFromParam) handleRaceChange(raceFromParam);
    if (classFromParam && raceFromParam) setActiveStep(3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateUrlParams = () => {
      const params = new URLSearchParams();

      if (characterId) {
        params.set("id", characterId);
        window.location.replace(`?${params.toString()}`);
      } else {
        if (gameId) params.set("gameId", gameId);
        if (selectedRace) params.set("race", selectedRace.name);
        if (selectedClass) params.set("characterClass", selectedClass.name);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    };

    if (!characterIdParam) {
      updateUrlParams();
    }
  }, [
    selectedRace,
    selectedClass,
    router,
    characterIdParam,
    gameId,
    characterId,
  ]);

  const isCharacterComplete = () => {
    return (
      selectedRace &&
      selectedClass &&
      background &&
      selectedSkills.length === selectedClass?.skills.canSelect &&
      areAbilitiesCalculated &&
      selectedEquipment?.filter(Boolean).length ===
        classes.find((c) => c.name === selectedClass?.name)?.equipment.length &&
      details.name
    );
  };

  const handleSave = async () => {
    await saveCharacter(gameId);
  };

  if (characterId && isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold">Chargement du personnage...</div>
      </div>
    );
  }

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
          {games.length > 0 && (
            <Link href={`/game/${games[0]}`} className="p-10">
              <button className="flex items-center gap-2 text-primary hover:text-primary-dark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Retour à la session de jeu
              </button>
            </Link>
          )}
          {!selectedClass && !selectedRace && (
            <div className="flex flex-col justify-center items-center text-center mb-4">
              Tu ne sais pas par où commencer ?{" "}
              <Link
                href={`/character-quiz${gameId ? `?gameId=${gameId}` : ""}`}
              >
                <span className="text-primary font-bold underline hover:text-red-700">
                  Réponds aux 10 questions !
                </span>
              </Link>
            </div>
          )}
          <Step
            stepNumber={1}
            title="1. Choisis une Race"
            content={<RaceSelection />}
            isFilled={!!selectedRace}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
          {selectedRace && (
            <Step
              stepNumber={2}
              title="2. Choisis une Classe"
              content={<ClassSelection />}
              isFilled={!!selectedClass}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}
          {selectedClass && (
            <Step
              stepNumber={3}
              title="3. Choisis ton Historique"
              content={<BackgroundSelection />}
              isFilled={!!background}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}
          {background && selectedClass && (
            <Step
              stepNumber={4}
              title="4. Choisis tes compétences"
              content={<SkillSelection />}
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
              content={<AbilityScores />}
              isFilled={areAbilitiesCalculated}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}
          {Object.values(abilityScores).some((score) => score !== 10) && (
            <Step
              stepNumber={6}
              title="6. Choisis tes équipements"
              content={<EquipmentSelection />}
              isFilled={
                selectedEquipment?.filter(Boolean).length ===
                classes.find((c) => c.name === selectedClass?.name)?.equipment
                  .length
              }
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}
          {selectedEquipment?.filter(Boolean).length ===
            classes.find((c) => c.name === selectedClass?.name)?.equipment
              .length && (
            <Step
              stepNumber={7}
              title="7. Définir la personnalité"
              content={<Details />}
              isFilled={!!details.name}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}

          {isCharacterComplete() && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSave}
                className="bg-primary hover:bg-primary-dark font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-110 flex items-center gap-3 text-lg border-2 border-green-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
                </svg>
                Sauvegarde ton personnage
              </button>
            </div>
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
            <CharacterSheet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CharacterBuild() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CharacterProvider>
        <CharacterBuildContent />
      </CharacterProvider>
    </Suspense>
  );
}
