import Stats from "../components/Stats";
import TooltipText from "../components/TooltipText";
import { classes } from "./races";

interface ClassSelectionProps {
  selectedClass: string | null;
  setSelectedClass: (cls: string | null) => void;
}

export default function ClassSelection({
  selectedClass,
  setSelectedClass,
}: ClassSelectionProps) {
  return (
    <>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 max-w-4xl mx-auto">
        <div className="flex items-center">
          <div className="text-sm text-blue-700">
            Ta classe définit ton dé de vie, qui sert à calculer tes points de
            vie (PV) de départ. Chaque classe utilise un dé différent : les
            mages lancent un dé à 8 faces (1d8), les guerriers un dé à 10 faces
            (1d10), etc. Tes PV de départ sont égaux au maximum du dé + ton
            bonus de{" "}
            <TooltipText text="Constitution">
              <Stats bonus="Constitution" />
            </TooltipText>{" "}
            (qui peut être négatif).
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-4">
        {classes.map((cls) => (
          <div
            key={cls.name}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col h-full ${
              selectedClass === cls.name ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => {
              setSelectedClass(cls.name);
            }}
          >
            <div className="p-4 flex-grow flex flex-col">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {cls.name}
              </h2>
              <div className="flex-grow">
                <p className="text-gray-600">{cls.description}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-100 mt-auto">
              <p className="text-sm text-gray-700">1d{cls.hitPointDice}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
