import { useState } from "react";
import { questions } from "./question";

interface QuizProps {
  setShowQuiz: (show: boolean) => void;
  setSelectedRace: (race: string | null) => void;
  setSelectedClass: (cls: string | null) => void;
}

export default function Quiz({
  setShowQuiz,
  setSelectedRace,
  setSelectedClass,
}: QuizProps) {
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

  const handleAnswer = (answerScores: Record<string, number>) => {
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

      setSelectedRace(recommendedRace);
      setSelectedClass(`${recommendedClass}`);
      setShowQuiz(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Découvre ton personnage
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl mb-4">
          Question {currentQuestion + 1}: {questions[currentQuestion].question}
        </h2>
        <div className="space-y-4">
          {questions[currentQuestion].answers.map((answer, index) => (
            <button
              key={index}
              className="w-full p-3 text-left rounded bg-gray-50 hover:bg-primary hover:text-red-700 transition-colors"
              onClick={() => handleAnswer(answer.scores)}
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
