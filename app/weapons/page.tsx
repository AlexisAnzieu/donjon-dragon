"use client";
import { Weapon, weapons } from "./weapons";
import { useState } from "react";

type SortKey = keyof Pick<Weapon, "name"> | "price";

const convertToCopper = (price: Weapon["price"]) => {
  switch (price.unit) {
    case "po":
      return price.value * 100;
    case "pa":
      return price.value * 10;
    case "pc":
      return price.value;
  }
};

export default function Weapons() {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  // Group weapons by category
  const weaponsByCategory = weapons.reduce((acc, weapon) => {
    if (!acc[weapon.category]) {
      acc[weapon.category] = [];
    }
    acc[weapon.category].push(weapon);
    return acc;
  }, {} as Record<string, Weapon[]>);

  const formatProperties = (weapon: Weapon) => {
    return weapon.properties
      .map((prop) => (prop.value ? `${prop.name} (${prop.value})` : prop.name))
      .join(", ");
  };

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

  const WeaponTable = ({ weapons }: { weapons: Weapon[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white/95 backdrop-blur-sm">
        <thead>
          <tr>
            {[
              { key: "name", label: "Nom" },
              { key: "price", label: "Prix" },
              { key: "", label: "Dégâts" },
              { key: "", label: "Propriétés" },
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
          {[...weapons]
            .sort((a, b) => {
              if (sortConfig.key === "price") {
                const priceA = convertToCopper(a.price);
                const priceB = convertToCopper(b.price);
                return sortConfig.direction === "asc"
                  ? priceA - priceB
                  : priceB - priceA;
              }
              if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
              }
              if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
              }
              return 0;
            })
            .map((weapon, index) => (
              <tr
                key={weapon.name}
                className={`
                  transition-colors duration-150
                  ${index % 2 === 0 ? "bg-white/95" : "bg-gray-50/95"}
                  hover:bg-blue-50/90
                `}
              >
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                  {weapon.name}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{`${weapon.price.value} ${weapon.price.unit}`}</td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{`${weapon.damage.dice} ${weapon.damage.type}`}</td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
                  {formatProperties(weapon)}
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
          Armes
        </h1>

        {Object.entries(weaponsByCategory).map(
          ([category, categoryWeapons]) => (
            <div key={category} className="mb-6 sm:mb-12">
              <h2 className="text-xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-gray-700 flex items-center gap-3">
                <span className="w-8 h-0.5 bg-gray-300"></span>
                {category}
              </h2>
              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200/50">
                <WeaponTable weapons={categoryWeapons} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
