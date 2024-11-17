import Image from "next/image";
import { AbilityScoreKey } from "../AbilityScores";
import { GiSwordman } from "react-icons/gi";
import { skills, equipments } from "../races";
import TooltipText from "@/app/components/TooltipText";
import { useCharacter } from "../characterContext";

function CharacterSheet() {
  const {
    selectedRace,
    selectedClass,
    areAbilitiesCalculated,
    abilityScores,
    background,
    calculateHP,
    calculateAC,
    calculateInitiative,
    selectedEquipment,
    selectedSkills,
    details,
  } = useCharacter();

  const getEquipmentDescription = (itemName: string) => {
    return equipments.find(
      (e) => e.name.toLowerCase() === itemName.toLowerCase()
    )?.description;
  };

  if (!selectedRace) return null;

  return (
    <div>
      {/* Character Header */}
      <div className="mb-4 sm:mb-6 text-center">
        <div className="relative space-y-2">
          <h1 className="text-4xl  tracking-wider">
            <span className="bg-gradient-to-r from-red-700 to-red-900 text-transparent bg-clip-text font-extrabold">
              {details.name}
            </span>
          </h1>
          <h2 className="text-3xl">
            <span className="relative">
              <span className="bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text font-bold">
                {selectedRace.name} {selectedClass?.name}
              </span>
            </span>
          </h2>
          <h3 className="text-xl text-gray-600 italic font-light">
            {background?.name}
          </h3>
        </div>
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
        <>
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
                    <div className="text-xl font-bold text-red-700">
                      {score}
                    </div>
                    <div className="text-sm font-medium">
                      ({sign}
                      {modifier})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold mb-3 text-center border-b-2 border-red-700 pb-2">
              Compétences
            </h3>
            <div className="grid grid-cols-4 gap-1">
              {Object.entries(skills).map(([skill, ability]) => {
                const baseScore =
                  abilityScores[ability.ability as AbilityScoreKey];
                const modifier = Math.floor((baseScore - 10) / 2);
                const hasProficiency =
                  selectedSkills.includes(ability.name) ||
                  background?.skills.includes(ability.name);
                const finalModifier = hasProficiency ? modifier + 2 : modifier;
                const sign = finalModifier >= 0 ? "+" : "";
                return (
                  <div
                    key={skill}
                    className={`bg-gray-50 p-2 rounded-lg text-center ${
                      hasProficiency ? "border border-red-700" : ""
                    }`}
                  >
                    <div className="text-xs text-gray-600 uppercase truncate">
                      {skill.charAt(0).toUpperCase() + skill.slice(1)}
                    </div>
                    <div className="text-sm font-bold text-red-700">
                      {sign}
                      {finalModifier}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {selectedClass && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-3 text-center border-b-2 border-red-700 pb-2">
            Jets de Sauvegarde
          </h3>
          <div className="grid grid-cols-6 gap-1">
            {Object.entries(abilityScores).map(([ability, score]) => {
              const baseModifier = Math.floor((score - 10) / 2);
              const hasBonus = selectedClass.sauvegardes.includes(ability);
              const modifier = hasBonus ? baseModifier + 2 : baseModifier;
              const sign = modifier >= 0 ? "+" : "";
              return (
                <div
                  key={ability}
                  className={`bg-gray-50 p-2 rounded-lg text-center ${
                    hasBonus ? "border border-red-700" : ""
                  }`}
                >
                  <div className="text-xs text-gray-600 uppercase truncate">
                    {ability.charAt(0).toUpperCase() + ability.slice(1)}
                  </div>
                  <div className="text-sm font-bold text-red-700">
                    {sign}
                    {modifier}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedClass && (
        <div className="mt-4 sm:mt-6">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center border-b-2 border-red-700 pb-2">
            Maitrises
          </h3>
          {background && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 font-semibold mb-3 border-b border-gray-200 pb-2">
                <span>Maitrise {background.name}</span>
              </div>
              <p className="text-sm text-gray-700">
                {background.tools?.join(", ")}
              </p>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 font-semibold mb-3 border-b border-gray-200 pb-2">
              <span>Maitrise {selectedClass.name}</span>
            </div>
            <div className="space-y-3">
              {Object.entries(selectedClass.proficiencies).map(
                ([key, proficiencies]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-gray-600 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)} :{" "}
                    </span>
                    <span className="text-sm text-gray-700">
                      {proficiencies.join(", ")}
                    </span>
                  </div>
                )
              )}
            </div>
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
                <div className="font-semibold mb-2">
                  Équipements {background.name}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {background.equipment?.map(
                    (equipment, index) =>
                      equipment && (
                        <div
                          key={index}
                          className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                        >
                          {getEquipmentDescription(equipment) ? (
                            <TooltipText text={equipment}>
                              <>
                                <div className="font-medium">{equipment}</div>
                                <div className="text-sm text-slate-500">
                                  {getEquipmentDescription(equipment)}
                                </div>
                              </>
                            </TooltipText>
                          ) : (
                            <span className="text-sm text-gray-700">
                              {equipment}
                            </span>
                          )}
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="font-semibold mb-3">
                Équipements {selectedClass?.name}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedEquipment?.map(
                  (equipment, index) =>
                    equipment && (
                      <div
                        key={index}
                        className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                      >
                        {getEquipmentDescription(equipment) ? (
                          <TooltipText text={equipment}>
                            <>
                              <div className="font-medium">{equipment}</div>
                              <div className="text-sm text-slate-500">
                                {getEquipmentDescription(equipment)}
                              </div>
                            </>
                          </TooltipText>
                        ) : (
                          <span className="text-sm text-gray-700">
                            {equipment}
                          </span>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterSheet;
