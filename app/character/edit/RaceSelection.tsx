import { races } from "./races";
import TooltipText from "../../components/TooltipText";
import Stats from "../../components/Stats";
import { useCharacter } from "./characterContext";

export default function RaceSelection() {
  const { handleRaceChange, selectedRace } = useCharacter();

  return (
    <>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 max-w-4xl mx-auto">
        <div className="flex items-center">
          <div className="text-sm text-blue-700">
            Le choix de ta race influencera les capacités de tes{" "}
            <TooltipText text="caractéristiques">
              <Stats />
            </TooltipText>{" "}
            qui définiront ton style de jeu.
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-4">
        {races.map((race) => (
          <div
            key={race.name}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col h-full ${
              selectedRace?.name === race.name ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => {
              handleRaceChange(race);
            }}
          >
            <div className="p-4 flex-grow flex flex-col">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {race.name}
              </h2>
              <div className="flex-grow">
                <p className="text-gray-600">{race.description}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-100 mt-auto">
              <p className="text-sm text-gray-700">{race.bonus}</p>
              <p className="text-sm text-gray-700">
                <strong>Vitesse:</strong> {race.speed}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
