import Image from "next/image";
import { Background } from "../BackgroundSelection";
import { AbilityScoreKey } from "../AbilityScores";
import { GiSkills, GiSwordman, GiToolbox } from "react-icons/gi";
import { Race } from "../races";
import TooltipText from "@/app/components/TooltipText";

interface CharacterSheetProps {
  selectedRace: Race | null;
  selectedClass: string | null;
  areAbilitiesCalculated: boolean;
  abilityScores: Record<AbilityScoreKey, number>;
  background: Background | null;
  calculateHP: () => number | null;
  calculateAC: () => number;
  calculateInitiative: () => number;
  details: {
    name: string;
    alignment: string;
    personality: string;
    ideals: string;
    bonds: string;
    flaws: string;
  };
  selectedEquipment: string[] | null;
}

export default function CharacterSheet({
  selectedRace,
  selectedClass,
  areAbilitiesCalculated,
  abilityScores,
  background,
  calculateHP,
  calculateAC,
  calculateInitiative,
  details,
  selectedEquipment,
}: CharacterSheetProps) {
  if (!selectedRace) return null;

  return (
    <div className="bg-white shadow-2xl rounded-lg p-4 sm:p-6 w-full sm:min-w-96">
      {/* Character Header */}
      <div className="mb-4 sm:mb-6 text-center">
        <h2 className="text-3xl font-medieval">
          <span className="text-primary font-extrabold">
            {selectedRace.name} {selectedClass}
          </span>
        </h2>
        <div className="relative my-4">
          <Image
            className="rounded-full border-4 border-red-700 shadow-2xl mx-auto w-32 h-32 sm:w-[200px] sm:h-[200px]"
            height={200}
            width={200}
            src={`/img/race/${selectedRace.name}.jpg`}
            alt="Character Image"
          />
          {selectedClass && areAbilitiesCalculated && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className="bg-red-700 text-white px-4 py-1 rounded-full shadow-lg">
                <span className="font-bold">PV: {calculateHP()}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <div className="flex-1 max-w-[120px] bg-gray-50 rounded-lg p-3 text-center">
            <TooltipText text="Vitesse">
              <div>
                Détermine la distance que votre personnage peut parcourir en un
                tour
              </div>
            </TooltipText>
            <div className="text-red-700 text-xl font-bold">
              {selectedRace.speed}
            </div>
          </div>

          {areAbilitiesCalculated && (
            <>
              <div className="flex-1 max-w-[120px] bg-gray-50 rounded-lg p-3 text-center">
                <TooltipText text="CA">
                  <div>
                    {` Classe d'Armure, une mesure de la capacité d'un personnage à
                    éviter d'être touché lors d'un combat.`}
                  </div>
                </TooltipText>
                <div className="text-red-700 text-xl font-bold">
                  {calculateAC()}
                </div>
              </div>

              <div className="flex-1 max-w-[120px] bg-gray-50 rounded-lg p-3 text-center">
                <TooltipText text="Initiative">
                  <div>
                    {` L'initiative détermine l'ordre des tours de combat.`}
                  </div>
                </TooltipText>
                <div className="text-red-700 text-xl font-bold">
                  {calculateInitiative()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ability Scores */}
      {areAbilitiesCalculated && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-center border-b-2 border-red-700 pb-2">
            Caractéristiques
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-4">
            {Object.entries(abilityScores).map(([ability, score]) => {
              const modifier = Math.floor((score - 10) / 2);
              const sign = modifier >= 0 ? "+" : "";
              return (
                <div
                  key={ability}
                  className="bg-gray-50 p-3 rounded-lg text-center"
                >
                  <div className="text-sm text-gray-600 uppercase">
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}
                  </div>
                  <div className="text-xl font-bold text-red-700">{score}</div>
                  <div className="text-sm font-medium">
                    ({sign}
                    {modifier})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Background Section */}
      {background && (
        <div className="mt-4 sm:mt-6">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center border-b-2 border-red-700 pb-2">
            {background.name}
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                label: "Compétences",
                value: background.skills,
                icon: <GiSkills />,
              },
              ...(background.tools
                ? [
                    {
                      label: "Maitrise",
                      value: background.tools,
                      icon: <GiToolbox />,
                    },
                  ]
                : []),
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  {icon}
                  <span>{label}</span>
                </div>
                <p className="text-sm text-gray-700">{value.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Section */}
      {background && (
        <div className="mt-4 sm:mt-6">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center border-b-2 border-red-700 pb-2 flex items-center justify-center gap-2">
            <GiSwordman />
            Équipements
          </h3>
          <div className="space-y-4">
            {background?.equipment && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm ">
                <div className="font-semibold mb-2">{`Équipements d'historique`}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {background.equipment?.map(
                    (equipment, index) =>
                      equipment && (
                        <div
                          key={index}
                          className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                        >
                          <span className="text-sm text-gray-700">
                            {equipment}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="font-semibold mb-3 ">Équipements de classe</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedEquipment?.map(
                  (equipment, index) =>
                    equipment && (
                      <div
                        key={index}
                        className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                      >
                        <span className="text-sm text-gray-700">
                          {equipment}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character Details */}
      {details.name && (
        <div className="mt-4 sm:mt-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-bold mb-2">Détails du personnage</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Nom:</span> {details.name}
            </p>
            <p>
              <span className="font-medium">Alignement:</span>{" "}
              {details.alignment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
