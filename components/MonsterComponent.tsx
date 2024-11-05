/* eslint-disable @next/next/no-img-element */
import { GiShield, GiHearts, GiRunningNinja } from "react-icons/gi";

interface MonsterComponentProps {
  name: string;
  image: string;
  size: string;
  type: string;
  alignment: string;
  armorClass: number;
  hitPoints: number;
  hitDice: string;
  speed: { walk: string; swim?: string };
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  languages: string;
  challengeRating: number;
  specialAbilities: { name: string; desc: string }[];
  actions: { name: string; desc: string }[];
  legendaryActions: { name: string; desc: string }[];
}

export default function MonsterComponent({
  name,
  image,
  size,
  type,
  alignment,
  armorClass,
  hitPoints,
  hitDice,
  speed,
  strength,
  dexterity,
  constitution,
  intelligence,
  wisdom,
  charisma,
  specialAbilities,
  actions,
  legendaryActions,
}: MonsterComponentProps) {
  const abilityScores = {
    STR: strength,
    DEX: dexterity,
    CON: constitution,
    INT: intelligence,
    WIS: wisdom,
    CHA: charisma,
  };

  interface StatCircleProps {
    name: string;
    value: number;
    modifier: number;
  }

  function StatCircle({ name, value, modifier }: StatCircleProps) {
    const modifierDisplay = modifier >= 0 ? `+${modifier}` : modifier;

    return (
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center">
          <div className="text-2xl font-bold">{value}</div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-sm">
            {modifierDisplay}
          </div>
        </div>
        <div className="text-center mt-1 font-bold">{name}</div>
      </div>
    );
  }

  return (
    <div className="w-[300px] bg-white text-black rounded-lg overflow-hidden shadow-lg relative border-4 border-black print:border-2">
      <div className="p-6 relative z-10">
        <h2 className="text-3xl font-bold text-black mb-2 text-center font-serif">
          {name}
        </h2>
        <p className="text-sm text-black mb-4 text-center italic">
          {size} {type}, {alignment}
        </p>

        <img
          src={image}
          className="rounded-full mx-auto m-5"
          width="150"
          height="150"
          alt={name}
        />
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GiShield className="w-6 h-6 text-black mr-2" />
              <span className="text-sm font-semibold text-black">
                AC: {armorClass}
              </span>
            </div>
            <div className="flex items-center">
              <GiHearts className="w-6 h-6 text-black mr-2" />
              <span className="text-sm font-semibold text-black">
                HP: {hitPoints} ({hitDice})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <GiRunningNinja className="w-6 h-6 text-black mr-2" />
            <span className="text-sm font-semibold text-black">
              Speed: Walk {speed.walk}
              {speed.swim && `, Swim ${speed.swim}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {Object.entries(abilityScores).map(([ability, score]) => (
            <StatCircle
              key={ability}
              name={ability}
              value={score}
              modifier={Math.floor((score - 10) / 2)}
            />
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-black mb-2">
            Special Abilities
          </h3>
          {specialAbilities.map((ability) => (
            <div
              key={ability.name}
              className="bg-gray-100 border border-black rounded p-2 mb-2"
            >
              <h4 className="text-sm font-bold">{ability.name}</h4>
              <p className="text-xs">{ability.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-black mb-2">Actions</h3>
          {actions.map((action) => (
            <div
              key={action.name}
              className="bg-gray-100 border border-black rounded p-2 mb-2"
            >
              <h4 className="text-sm font-bold">{action.name}</h4>
              <p className="text-xs">{action.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-black mb-2">
            Legendary Actions
          </h3>
          {legendaryActions.map((legendaryAction) => (
            <div
              key={legendaryAction.name}
              className="bg-gray-100 border border-black rounded p-2 mb-2"
            >
              <h4 className="text-sm font-bold">{legendaryAction.name}</h4>
              <p className="text-xs">{legendaryAction.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
