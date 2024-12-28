"use client";

import TooltipText from "../TooltipText";
import Stats from "./Stats";
import { useCharacter } from "./characterContext";

// Types
export type AbilityScoreKey =
  | "force"
  | "dextérité"
  | "constitution"
  | "intelligence"
  | "sagesse"
  | "charisme";

export type RollDetail = {
  rolls: number[];
  total: number;
  racialBonus?: string;
};

// Constants
export const DEFAULT_ABILITY_SCORES: Record<AbilityScoreKey, number> = {
  force: 10,
  dextérité: 10,
  constitution: 10,
  intelligence: 10,
  sagesse: 10,
  charisme: 10,
};

// Utility functions
const rollDice = (sides: number) => Math.floor(Math.random() * sides) + 1;
const rollMultipleDice = (count: number, sides: number) =>
  Array.from({ length: count }, () => rollDice(sides));
const calculateModifier = (value: number) => {
  const modifier = Math.floor((value - 10) / 2);
  return modifier > 0 ? `+${modifier}` : `${modifier}`;
};

// UI Components
const InfoPanel = () => (
  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 max-w-4xl mx-auto">
    <div className="flex items-center">
      <div className="text-sm text-blue-700">
        Les{" "}
        <TooltipText text="caractéristique">
          <Stats />
        </TooltipText>{" "}
        sont les attributs fondamentaux qui définissent votre personnage.
        Couvrant les aspects physiques et mentaux, elles déterminent ses
        capacités naturelles dans toutes les situations de jeu. Chaque action,
        du combat à la négociation, dépend de ces caractéristiques. Plus le
        score est élevé, plus votre personnage excelle dans ce domaine
        particulier.
      </div>
    </div>
  </div>
);

const AbilityScore = ({
  ability,
  value,
  rollDetail,
}: {
  ability: string;
  value: number;
  rollDetail: RollDetail | null;
}) => (
  <div className="flex flex-col p-2 bg-gray-100 rounded">
    <div className="flex items-center justify-between">
      <span className="capitalize">{ability}</span>
      <span className="font-bold">
        {value} ({calculateModifier(value)})
      </span>
    </div>
    {rollDetail && (
      <div className="text-sm text-gray-600 mt-1">
        Dés: [{rollDetail.rolls.slice(0, 3).join(", ")},
        <span className="text-red-600">{" " + rollDetail.rolls[3]}</span>]
        {rollDetail.racialBonus ? (
          <span className="text-green-600"> + {rollDetail.racialBonus}</span>
        ) : null}
      </div>
    )}
  </div>
);

const CalculationDetails = () => (
  <div className="grid mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-4xl mx-auto">
    <h3 className="font-bold mb-2">Détail du calcul</h3>
    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
      <li>Lancer 4 dés à 6 faces (d6)</li>
      <li>Retirer le résultat le plus bas</li>
      <li>Additionner les 3 dés restants</li>
      <li>
        {
          "Le modificateur entre parenthèses est calculé ainsi: (somme des dés - 10) ÷ 2, arrondi à l'inférieur"
        }
      </li>
      <li>Les bonus raciaux sont automatiquement ajoutés au total</li>
    </ul>
  </div>
);

// Main component
export default function AbilityScores() {
  const {
    handleScoresChange,
    abilityScores,
    rollDetails,
    setRollDetails,
    selectedRace,
  } = useCharacter();

  const rollAbility = () => {
    const rolls = rollMultipleDice(4, 6).sort((a, b) => b - a);
    const total = rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
    return { rolls, total };
  };

  const rollAllScores = () => {
    const newScores = {} as Record<AbilityScoreKey, number>;
    const newRollDetails = {} as Record<AbilityScoreKey, RollDetail>;

    Object.keys(DEFAULT_ABILITY_SCORES).forEach((ability) => {
      const rollResult = rollAbility();
      newScores[ability as AbilityScoreKey] = rollResult.total;
      newRollDetails[ability as AbilityScoreKey] = {
        ...rollResult,
        racialBonus: selectedRace?.abilityScores?.[ability as AbilityScoreKey]
          ? `${selectedRace.abilityScores[ability as AbilityScoreKey]} (race ${
              selectedRace.name
            })`
          : undefined,
      };
    });

    if (selectedRace?.abilityScores) {
      Object.entries(selectedRace.abilityScores).forEach(([ability, bonus]) => {
        if (ability in newScores) {
          newScores[ability as AbilityScoreKey] += bonus;
        }
      });
    }

    setRollDetails(newRollDetails);
    handleScoresChange(newScores);
  };

  return (
    <div className="space-y-4">
      <InfoPanel />
      <div className="flex justify-center">
        <button
          onClick={rollAllScores}
          className="bg-primary text-white px-4 py-2 rounded bg-red-700"
        >
          Lancer les dés (4d6)
        </button>
      </div>
      {Object.values(abilityScores).some((value) => value !== 10) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-4">
            {Object.entries(abilityScores).map(([ability, value]) => (
              <AbilityScore
                key={ability}
                ability={ability}
                value={value}
                rollDetail={rollDetails[ability as AbilityScoreKey]}
              />
            ))}
          </div>{" "}
          <CalculationDetails />
        </>
      )}
    </div>
  );
}
