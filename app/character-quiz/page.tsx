"use client";

import { useState } from "react";
import Quiz from "./Quiz";
import RaceSelection from "./RaceSelection";
import ClassSelection from "./ClassSelection";
import { races } from "./races";

export default function Character() {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState<boolean>(true);

  const selectedRaceData = races.find((race) => race.name === selectedRace);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      {showQuiz ? (
        <Quiz
          setShowQuiz={setShowQuiz}
          setSelectedRace={setSelectedRace}
          setSelectedClass={setSelectedClass}
        />
      ) : (
        <>
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
          {selectedClass && (
            <div className="mt-6 text-center text-2xl">
              Tu es un{" "}
              <span className="text-primary font-extrabold text-3xl">
                {selectedRace} {selectedClass}
              </span>
            </div>
          )}
          <div className="mt-6 text-center">
            <button
              className="bg-primary text-white py-2 text-2xl px-4 rounded shadow-lg transform transition-transform hover:scale-105 bg-red-700"
              onClick={() => {
                setSelectedRace(null);
                setSelectedClass(null);
                setShowQuiz(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              ou refais le test ?
            </button>
          </div>
        </>
      )}
    </div>
  );
}
