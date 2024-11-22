"use client";

import { useState } from "react";
import { Monster } from "@/app/api/monsters/route";
import { useRouter } from "next/navigation";

export default function MonsterFilter({ monsters }: { monsters: Monster[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<keyof Monster>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredMonsters = monsters
    .filter((monster) =>
      monster.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  const handleSort = (field: keyof Monster) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="overflow-x-auto">
      <input
        type="text"
        placeholder="Filter by names"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th
              onClick={() => handleSort("name")}
              className="cursor-pointer p-2 border"
            >
              Name{" "}
              {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("type")}
              className="cursor-pointer p-2 border"
            >
              Type{" "}
              {sortField === "type" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("size")}
              className="cursor-pointer p-2 border"
            >
              Size{" "}
              {sortField === "size" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              onClick={() => handleSort("alignment")}
              className="cursor-pointer p-2 border"
            >
              Alignment{" "}
              {sortField === "alignment" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th className="p-2 border">Stats</th>
          </tr>
        </thead>
        <tbody>
          {filteredMonsters.map((monster) => (
            <tr
              key={monster.slug}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/monsters/${monster.slug}`)}
            >
              <td className="p-2 border font-medium">{monster.name}</td>
              <td className="p-2 border">{monster.type}</td>
              <td className="p-2 border">{monster.size}</td>
              <td className="p-2 border">{monster.alignment}</td>
              <td className="p-2 border">
                <div className="text-sm">
                  <p>HP: {monster.hit_points}</p>
                  <p>AC: {monster.armor_class}</p>
                  <p>CR: {monster.challenge_rating}</p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
