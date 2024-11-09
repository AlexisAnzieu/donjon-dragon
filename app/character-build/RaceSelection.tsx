import { races } from "./races";

interface RaceSelectionProps {
  selectedRace: string | null;
  setSelectedRace: (race: string | null) => void;
}

export default function RaceSelection({
  selectedRace,
  setSelectedRace,
}: RaceSelectionProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mt-6 text-center text-primary">
        Ta Race
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-6">
        {races.map((race) => (
          <div
            key={race.name}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
              selectedRace === race.name ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => {
              setSelectedRace(race.name);
            }}
          >
            <div className="p-4">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {race.name}
              </h2>
              <div className="h-50 overflow-y-auto">
                <p className="text-gray-600">{race.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
