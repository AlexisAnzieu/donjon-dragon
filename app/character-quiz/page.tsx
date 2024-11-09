"use client";

import { useState } from "react";
import { questions } from "./question";
import { useRouter } from "next/navigation";

export default function Quiz() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [scores, setScores] = useState<Record<string, number>>({
    Elfe: 0,
    Halfelin: 0,
    Humain: 0,
    Nain: 0,
    Barde: 0,
    Clerc: 0,
    Magicien: 0,
    Guerrier: 0,
    Roublard: 0,
  });

  const [scoreHistory, setScoreHistory] = useState<Record<string, number>[]>(
    []
  );

  const handleAnswer = (answerScores: Record<string, number>) => {
    setScoreHistory((prevHistory) => [...prevHistory, scores]);

    setScores((prevScores) => {
      const newScores = { ...prevScores };
      Object.entries(answerScores).forEach(([key, value]) => {
        newScores[key] = (newScores[key] || 0) + value;
      });
      return newScores;
    });

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const recommendedRace = Object.entries(scores)
        .filter(([key]) => ["Elfe", "Halfelin", "Humain", "Nain"].includes(key))
        .reduce((a, b) => (a[1] > b[1] ? a : b))[0];

      const recommendedClass = Object.entries(scores)
        .filter(([key]) =>
          ["Barde", "Clerc", "Magicien", "Guerrier", "Roublard"].includes(key)
        )
        .reduce((a, b) => (a[1] > b[1] ? a : b))[0];

      router.push(
        `/character-build?race=${recommendedRace}&characterClass=${recommendedClass}`
      );
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setScores(scoreHistory[scoreHistory.length - 1]);
      setScoreHistory((prevHistory) => prevHistory.slice(0, -1));
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="max-w-2xl mx-auto min-h-screen bg-gray-100 text-gray-800 p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary">
          Découvre ton personnage
        </h1>
        <h2 className="text-xl font-semibold mb-6 text-center text-secondary">
          en répondant aux 10 questions
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          {currentQuestion > 0 && (
            <>
              <div className="absolute top-4 right-4 text-gray-500">
                {currentQuestion} / {questions.length}
              </div>
              <button
                className="top-4 pb-6 bg-primary hover:bg-secondary hover:text-red-700 transition-all duration-300 transform flex items-center"
                onClick={handlePrevious}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {"Question précédente"}
              </button>
            </>
          )}
          <h2 className="text-xl mb-4">
            Question {currentQuestion + 1}:{" "}
            {questions[currentQuestion].question}
          </h2>
          <div className="space-y-4">
            {questions[currentQuestion].answers.map((answer, index) => (
              <div
                onClick={() => handleAnswer(answer.scores)}
                key={index}
                className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-primary hover:text-red-700 transition-all duration-300 hover:cursor-pointer"
              >
                <div className="w-full text-left text-lg font-semibold">
                  {answer.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
