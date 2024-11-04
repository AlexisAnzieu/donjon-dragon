import { Shield, Swords, Wind } from "lucide-react";

export default function Component() {
  return (
    <div className="w-[270px] h-[400px] rounded-lg overflow-hidden shadow-lg relative">
      {/* Fancy border effect */}
      <div className="absolute inset-0 border-8 border-black rounded-lg"></div>

      {/* Content */}
      <div className="p-4 relative z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gorgon</h2>
        <p className="text-sm text-gray-600 mb-4">
          Large monstrosity, unaligned
        </p>

        {/* Attributes */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-gray-700 mr-2" />
            <span className="text-sm font-semibold text-gray-800">AC: 19</span>
          </div>
          <div className="flex items-center">
            <Swords className="w-5 h-5 text-gray-700 mr-2" />
            <span className="text-sm font-semibold text-gray-800">
              HP: 114 (12d10 + 48)
            </span>
          </div>
          <div className="flex items-center">
            <Wind className="w-5 h-5 text-gray-700 mr-2" />
            <span className="text-sm font-semibold text-gray-800">
              Speed: 40 ft.
            </span>
          </div>
        </div>

        {/* Ability Scores */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((ability) => (
            <div
              key={ability}
              className="rounded p-2 text-center border-2 border-black"
            >
              <span className="text-xs font-bold text-gray-700">{ability}</span>
              <p className="text-sm font-semibold text-gray-800">
                {Math.floor(Math.random() * 10) + 10}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
