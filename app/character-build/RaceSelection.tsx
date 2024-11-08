interface Race {
  name: string;
  description: string;
  classes: Class[];
}

interface Class {
  name: string;
  description: string;
}

interface RaceSelectionProps {
  races: Race[];
  selectedRace: string | null;
  setSelectedRace: (race: string | null) => void;
  setSelectedClass: (cls: string | null) => void;
}

export default function RaceSelection({
  races,
  selectedRace,
  setSelectedRace,
  setSelectedClass,
}: RaceSelectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-6">
        {races.map((race) => (
          <div
            key={race.name}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
              selectedRace === race.name ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => {
              setSelectedRace(race.name);
              setSelectedClass(null);
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
