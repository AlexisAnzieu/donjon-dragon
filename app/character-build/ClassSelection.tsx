import { GiHeartPlus, GiArmorVest, GiSwordsPower } from "react-icons/gi";
import Stats from "../components/Stats";
import TooltipText from "../components/TooltipText";
import { Class, classes } from "./races";

interface ClassSelectionProps {
  selectedClass: Class | null;
  setSelectedClass: (cls: Class | null) => void;
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
            Ta classe définit le choix de tes équipement de départ et ton dé de
            vie, qui sert à calculer tes points de vie (PV) de départ. Chaque
            classe utilise un dé différent : les mages lancent un dé à 8 faces
            (1d8), les guerriers un dé à 10 faces (1d10), etc. Tes PV de départ
            sont égaux au maximum du dé + ton bonus de{" "}
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
              selectedClass?.name === cls.name ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => {
              setSelectedClass(cls);
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
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 mt-auto border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center">
                  <GiHeartPlus className="w-5 h-5 mr-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {cls.hitPointDice} Points de Vie
                  </p>
                </div>
                <div className="flex items-center">
                  <GiArmorVest className="w-5 h-5 mr-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {"Maitrise d'armure: "}
                    <span className="text-gray-600">
                      {cls.proficiencies.armures.join(", ")}
                    </span>
                  </p>
                </div>
                <div className="flex items-center">
                  <GiSwordsPower className="w-5 h-5 mr-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {"Maitrise d'armes: "}
                    <span className="text-gray-600">
                      {cls.proficiencies.armes.join(", ")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
