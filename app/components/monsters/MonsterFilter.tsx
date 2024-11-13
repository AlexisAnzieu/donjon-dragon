"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import MonsterComponent from "./MonsterComponent";
import { Monster } from "@/app/api/monsters/route";

export default function MonsterFilter({ monsters }: { monsters: Monster[] }) {
  const [filter, setFilter] = useState("");

  const filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Filter by names"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMonsters.map((monster) => (
          <MonsterComponent key={monster.slug} {...monster} />
        ))}
      </div>
    </>
  );
}
