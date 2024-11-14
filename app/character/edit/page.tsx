"use client";

import { useEffect, Suspense } from "react";
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

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
        <svg
          className="animate-spin h-10 w-10 text-primary"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <div className="text-xl font-semibold">Chargement en cours...</div>
      </div>
    </div>
  );
}

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
    isLoading,
  } = useCharacter();

  const characterClassParam = searchParams.get("characterClass");
  const raceParam = searchParams.get("race");
  const characterIdParam = searchParams.get("id");
  const gameId = searchParams.get("gameId");

  useEffect(() => {
    if (characterIdParam) {
      loadCharacter(characterIdParam);
      setActiveStep(null);
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

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className={`flex ${
              !selectedClass && !selectedRace
                ? "flex-col"
                : "flex-col lg:flex-row gap-8"
            }`}
          >
            {/* Left column */}
            <div
              className={`w-full ${
                !selectedClass && !selectedRace ? "p-4" : "lg:w-2/3"
              }`}
            >
              {games.length > 0 && (
                <div className="mb-6">
                  <Link href={`/game/${games[0]}`}>
                    <button className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors duration-200">
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
                      <span className="font-medium">
                        Retour à la session de jeu
                      </span>
                    </button>
                  </Link>
                </div>
              )}

              {!characterIdParam && !selectedClass && !selectedRace && (
                <div className="bg-white rounded-xl p-6 shadow-sm mb-8 border border-gray-100">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <h2 className="text-xl font-semibold">
                      Nouveau dans D&D ?
                    </h2>
                    <p className="text-gray-600">
                      Tu ne sais pas par où commencer ?
                    </p>
                    <Link
                      href={`/character-quiz${
                        gameId ? `?gameId=${gameId}` : ""
                      }`}
                      className="block"
                    >
                      <span className="inline-block bg-red-800 text-white  px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary-dark hover:scale-105 transform transition-all duration-200 ">
                        ✨ Réponds au quizz ✨
                      </span>
                    </Link>
                  </div>
                </div>
              )}

              <div className="space-y-6">
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
                      classes.find((c) => c.name === selectedClass?.name)
                        ?.equipment.length
                    }
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                  />
                )}
                {selectedEquipment?.filter(Boolean).length &&
                  selectedEquipment?.filter(Boolean).length ===
                    classes.find((c) => c.name === selectedClass?.name)
                      ?.equipment.length && (
                    <Step
                      stepNumber={7}
                      title="7. Définis ta personnalité"
                      content={<Details />}
                      isFilled={!!details.name}
                      activeStep={activeStep}
                      setActiveStep={setActiveStep}
                    />
                  )}
              </div>

              {isCharacterComplete() && (
                <div className="mt-12 mb-8">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full bg-green-200 hover:bg-primary-dark font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H5V5H15V9Z" />
                    </svg>
                    Sauvegarde ton personnage
                  </button>
                </div>
              )}
            </div>

            {selectedRace && (
              <div
                className={`w-full ${
                  !selectedClass && !selectedRace ? "lg:w-0" : "lg:w-1/3"
                }`}
              >
                <div className="lg:top-8 transition-all duration-500 ease-in-out">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <CharacterSheet />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
