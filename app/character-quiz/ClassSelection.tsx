interface Class {
  name: string;
  description: string;
  abilities: string[];
}

interface Race {
  name: string;
  description: string;
  classes: Class[];
}

interface ClassSelectionProps {
  selectedRaceData: Race | undefined;
  selectedClass: string | null;
  setSelectedClass: (cls: string | null) => void;
}

export default function ClassSelection({
  selectedRaceData,
  selectedClass,
  setSelectedClass,
}: ClassSelectionProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mt-6 text-center text-primary">
        Choisis ta classe
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-4">
        {selectedRaceData?.classes.map((cls) => (
          <div
            key={cls.name}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
              selectedClass === cls.name ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedClass(cls.name)}
          >
            <div className="p-4">
              <h3 className="text-xl font-bold text-primary mb-2">
                {cls.name}
              </h3>
              <div className="h-32 overflow-y-auto">
                <p className="text-gray-600">{cls.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
