/* eslint-disable @next/next/no-img-element */
import { Monster } from "@/app/api/monsters/route";
import { GiShield, GiHearts, GiRunningNinja } from "react-icons/gi";

export default function MonsterComponent(monster: Monster) {
  interface StatCircleProps {
    name: string;
    value: number;
    modifier: string;
  }

  function StatCircle({ name, value, modifier }: StatCircleProps) {
    return (
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center">
          <div className="text-2xl font-bold">{value}</div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-sm">
            {modifier}
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
          {monster.name}
        </h2>
        <p className="text-sm text-black mb-4 text-center italic">
          {monster.size} {monster.type}, {monster.alignment}
        </p>

        <img
          src={monster.imageUrl || ""}
          className="rounded-full mx-auto m-5"
          width="150"
          height="150"
          alt={monster.name}
        />
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GiShield className="w-6 h-6 text-black mr-2" />
              <span className="text-sm font-semibold text-black">
                CA: {monster.armor_class}
              </span>
            </div>
            <div className="flex items-center">
              <GiHearts className="w-6 h-6 text-black mr-2" />
              <span className="text-sm font-semibold text-black">
                PV: {monster.hit_points} ({monster.hit_dice})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <GiRunningNinja className="w-6 h-6 text-black mr-2" />
            <span className="text-sm font-semibold text-black">
              Vitesse: {monster.speed}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {monster.abilities.map((a) => (
            <StatCircle
              key={a.name}
              name={a.name}
              value={a.value}
              modifier={a.modifier}
            />
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-black mb-2">
            Capacités Spéciales
          </h3>
          {monster.special_abilities.map((ability) => (
            <div
              key={ability.name}
              className="bg-gray-100 border border-black rounded p-2 mb-2"
            >
              <h4 className="text-sm font-bold">{ability.name}</h4>
              <p className="text-xs">{ability.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-black mb-2">Actions</h3>
          {monster.actions.map((action) => (
            <div
              key={action.name}
              className="bg-gray-100 border border-black rounded p-2 mb-2"
            >
              <h4 className="text-sm font-bold">{action.name}</h4>
              <p className="text-xs">{action.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-black mb-2">
            Actions Légendaires
          </h3>
          {monster.legendary_actions.map((legendaryAction) => (
            <div
              key={legendaryAction.name}
              className="bg-gray-100 border border-black rounded p-2 mb-2"
            >
              <h4 className="text-sm font-bold">{legendaryAction.name}</h4>
              <p className="text-xs">{legendaryAction.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
