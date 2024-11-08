"use client";

import Image from "next/image";
import { useState } from "react";
import RaceSelection from "./RaceSelection";
import ClassSelection from "./ClassSelection";
import { races } from "./races";
import { useSearchParams } from "next/navigation";

export default function CharacterBuild() {
  const searchParams = useSearchParams();
  const characterClass = searchParams.get("characterClass");
  const race = searchParams.get("race");

  const [selectedRace, setSelectedRace] = useState<string | null>(race);
  const [selectedClass, setSelectedClass] = useState<string | null>(
    characterClass
  );

  const selectedRaceData = races.find((race) => race.name === selectedRace);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="flex flex-col-reverse lg:flex-row">
        <div className="w-full lg:w-2/3">
          <RaceSelection
            races={races}
            selectedRace={selectedRace}
            setSelectedRace={setSelectedRace}
            setSelectedClass={setSelectedClass}
          />
          {selectedRace && (
            <ClassSelection
              selectedRaceData={selectedRaceData}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
            />
          )}
          <div className="mt-6 text-center">
            <button
              className="bg-primary text-white py-2 text-2xl px-4 rounded shadow-lg transform transition-transform hover:scale-105 bg-red-700"
              onClick={() => {
                setSelectedRace(null);
                setSelectedClass(null);
              }}
            >
              ou refais le test ?
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/3 lg:sticky lg:top-0 h-screen flex flex-col ">
          {selectedRace && (
            <div className="mt-6 text-center text-2xl">
              Tu es un{" "}
              <span className="text-primary font-extrabold text-3xl">
                {selectedRace} {selectedClass}
              </span>
            </div>
          )}
          <div className="flex flex-col items-center mt-6">
            <Image
              className="rounded-full border-4 border-red-700 shadow-xl"
              height={300}
              width={300}
              src={`/img/race/${selectedRace}.jpg`}
              alt="Character Image"
            />
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
          </div>
        </div>
      </div>
    </div>
  );
}
