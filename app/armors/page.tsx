"use client";
import { Armor, armors } from "./armors";
import { useState } from "react";

type SortKey = keyof Pick<Armor, "name" | "cost" | "armorClass">;

export default function Armors() {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  const armorsByType = armors.reduce((acc, armor) => {
    if (!acc[armor.type]) {
      acc[armor.type] = [];
    }
    acc[armor.type].push(armor);
    return acc;
  }, {} as Record<string, Armor[]>);

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleSort = (key: SortKey) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const ArmorTable = ({ armors }: { armors: Armor[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white/95 backdrop-blur-sm">
        <thead>
          <tr>
            {[
              { key: "name", label: "Nom" },
              { key: "cost", label: "Prix (po)" },
              { key: "armorClass", label: "Classe d'armure" },
              { key: "", label: "Force minimum" },
              { key: "", label: "Discrétion" },
              { key: "", label: "Poids (kg)" },
            ].map(({ key, label }) => (
              <th
                key={label}
                onClick={() => key && handleSort(key as SortKey)}
                className={`whitespace-nowrap px-3 py-2 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-bold tracking-wider text-gray-800 bg-gray-100/90 ${
                  key
                    ? "cursor-pointer transition-colors hover:bg-gray-200/90"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {label}
                  {key && (
                    <span className="text-gray-500">
                      {getSortIcon(key as SortKey)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...armors]
            .sort((a, b) => {
              if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
              }
              if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
              }
              return 0;
            })
            .map((armor, index) => (
              <tr
                key={armor.name}
                className={`
                  transition-colors duration-150
                  ${index % 2 === 0 ? "bg-white/95" : "bg-gray-50/95"}
                  hover:bg-blue-50/90
                `}
              >
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                  {armor.name}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
                  {armor.cost}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
                  {armor.armorClass}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
                  {armor.strength || "—"}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
                  {armor.stealthDisadvantage ? "Désavantage" : "—"}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
                  {armor.weight}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 bg-[url('/subtle-pattern.png')]">
      <div className="container mx-auto px-2 py-4 sm:p-8 max-w-7xl">
        <h1 className="text-2xl sm:text-5xl font-bold mb-4 sm:mb-8 text-gray-800">
          Armures
        </h1>

        {Object.entries(armorsByType).map(([type, typeArmors]) => (
          <div key={type} className="mb-6 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-gray-700 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-gray-300"></span>
              {type}
            </h2>
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200/50">
              <ArmorTable armors={typeArmors} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
