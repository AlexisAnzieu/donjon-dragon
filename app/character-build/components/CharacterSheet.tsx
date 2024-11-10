import Image from "next/image";
import { Background } from "../BackgroundSelection";
import { AbilityScoreKey } from "../AbilityScores";

interface CharacterSheetProps {
  selectedRace: string | null;
  selectedClass: string | null;
  areAbilitiesCalculated: boolean;
  abilityScores: Record<AbilityScoreKey, number>;
  background: Background | null;
  calculateHP: () => string | null;
  details: {
    name: string;
    alignment: string;
    personality: string;
    ideals: string;
    bonds: string;
    flaws: string;
  };
}

export default function CharacterSheet({
  selectedRace,
  selectedClass,
  areAbilitiesCalculated,
  abilityScores,
  background,
  calculateHP,
  details,
}: CharacterSheetProps) {
  if (!selectedRace) return null;

  return (
    <div className="bg-white shadow-2xl rounded-lg p-4 sm:p-6 w-full sm:min-w-96">
      {/* Character Header */}
      <div className="mb-4 sm:mb-6 text-center">
        <h2 className="text-3xl font-medieval">
          <span className="text-primary font-extrabold">
            {selectedRace} {selectedClass}
          </span>
        </h2>
        <div className="relative my-4">
          <Image
            className="rounded-full border-4 border-red-700 shadow-2xl mx-auto w-32 h-32 sm:w-[200px] sm:h-[200px]"
            height={200}
            width={200}
            src={`/img/race/${selectedRace}.jpg`}
            alt="Character Image"
          />
          {selectedClass && areAbilitiesCalculated && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-red-700 text-white px-4 py-1 rounded-full shadow-lg">
                <span className="font-bold">HP: {calculateHP()}</span>
              </div>
            </div>
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
              { label: "Compétences", value: background.skills, icon: "🎯" },
              { label: "Équipement", value: background.equipment, icon: "⚔️" },
              ...(background.tools
                ? [{ label: "Maitrise", value: background.tools, icon: "🛠️" }]
                : []),
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
                <p className="text-sm text-gray-700">{value.join(", ")}</p>
              </div>
            ))}
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
