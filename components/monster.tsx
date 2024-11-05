/* eslint-disable @next/next/no-img-element */
import { GiShield, GiHearts, GiRunningNinja } from "react-icons/gi";

export default function Component({ brightness = 1 }: { brightness?: number }) {
  const abilityScores = {
    STR: 19,
    DEX: 11,
    CON: 18,
    INT: 2,
    WIS: 12,
    CHA: 7,
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
    <div className="w-[300px]  bg-white text-black rounded-lg overflow-hidden shadow-lg relative border-4 border-black print:border-2 ">
      <div className="p-6 relative z-10">
        <h2 className="text-3xl font-bold text-black mb-2 text-center font-serif">
          Magicien
        </h2>
        <p className="text-sm text-black mb-4 text-center italic">
          Harry Potter en plus grand
        </p>

        <img
          src="https://cdn.leonardo.ai/users/13e54014-4c9d-430b-bf1d-8f8d9e5adc3b/generations/f1aba11d-dfde-44cc-8430-e77462d05ed3/Leonardo_Anime_XL_A_monochrome_magician_holds_a_sleek_wand_aga_0.jpg"
          className="rounded-full mx-auto"
          width="150"
          height="150"
          title="Gorgon"
          alt="Gorgon"
          style={{ filter: `brightness(${brightness})` }}
        />
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GiShield className="w-6 h-6 text-black mr-2" />
              <span className="text-sm font-semibold text-black">AC: 19</span>
            </div>
            <div className="flex items-center">
              <GiHearts className="w-6 h-6 text-black mr-2" />
              <span className="text-sm font-semibold text-black">HP: 114</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <GiRunningNinja className="w-6 h-6 text-black mr-2" />
            <span className="text-sm font-semibold text-black">
              Speed: 40 ft.
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
            ></StatCircle>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-black mb-2">Abilities</h3>
          <div className="bg-gray-100 border border-black rounded p-2">
            <h4 className="text-sm font-bold">Trampling Charge</h4>
            <p className="text-xs">
              If the gorgon moves at least 20 feet straight toward a creature
              and then hits it with a gore attack on the same turn, that target
              must succeed on a DC 16 Strength saving throw or be knocked prone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
