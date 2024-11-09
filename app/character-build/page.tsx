"use client";

import Image from "next/image";
import { useState, useEffect, Suspense, useRef } from "react";
import RaceSelection from "./RaceSelection";
import ClassSelection from "./ClassSelection";
import { races } from "./races";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function CharacterBuildContent() {
  const searchParams = useSearchParams();
  const characterClass = searchParams.get("characterClass");
  const race = searchParams.get("race");

  const [selectedRace, setSelectedRace] = useState<string | null>(race);
  const [selectedClass, setSelectedClass] = useState<string | null>(
    characterClass
  );

  const router = useRouter();
  const classSelectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedRace) params.set("race", selectedRace);
    if (selectedClass) params.set("characterClass", selectedClass);
    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  }, [selectedRace, selectedClass, router]);

  const handleRaceChange = (race: string | null) => {
    setSelectedRace(race);
    if (race && classSelectionRef.current) {
      classSelectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClassChange = (characterClass: string | null) => {
    setSelectedClass(characterClass);
  };

  const selectedRaceData = races.find((race) => race.name === selectedRace);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-8 pt-3 pb-32">
      <div
        className={`flex ${
          !selectedClass && !selectedRace
            ? "flex-col"
            : "flex-col-reverse lg:flex-row"
        } transition-all duration-500 ease-in-out`}
      >
        <div
          className={`w-full ${
            !selectedClass && !selectedRace ? "" : "lg:w-2/3"
          } transition-all duration-500 ease-in-out`}
        >
          {!selectedClass && !selectedRace && (
            <div className="flex flex-col justify-center items-center mt-6 text-center">
              Tu ne sais pas par où commencer ?{" "}
              <Link href="/character-quiz">
                <span className="text-primary font-bold underline hover:text-red-700">
                  Réponds aux 10 questions !
                </span>
              </Link>
            </div>
          )}
          <RaceSelection
            races={races}
            selectedRace={selectedRace}
            setSelectedRace={handleRaceChange}
          />
          {selectedRace && (
            <ClassSelection
              selectedRaceData={selectedRaceData}
              selectedClass={selectedClass}
              setSelectedClass={handleClassChange}
            />
          )}
        </div>
        <div
          ref={classSelectionRef}
          className={`w-full ${
            !selectedClass && !selectedRace
              ? "lg:w-0"
              : "lg:w-1/3 lg:sticky lg:top-0 h-screen flex flex-col"
          } transition-all duration-500 ease-in-out`}
        >
          {selectedRace && (
            <div className="mt-6 text-center text-2xl">
              Tu es un{" "}
              <span className="text-primary font-extrabold text-3xl">
                {selectedRace} {selectedClass}
              </span>
            </div>
          )}
          <div className="flex flex-col items-center mt-6">
            {selectedRace && (
              <Image
                className="rounded-full border-4 border-red-700 shadow-xl"
                height={300}
                width={300}
                src={`/img/race/${selectedRace}.jpg`}
                alt="Character Image"
              />
            )}
            {selectedClass && (
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold">Characteristics</h3>
                <ul className="list-disc list-inside">
                  <li>Strength: 10</li>
                  <li>Dexterity: 12</li>
                  <li>Constitution: 14</li>
                  <li>Intelligence: 16</li>
                  <li>Wisdom: 18</li>
                  <li>Charisma: 20</li>
                </ul>
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
