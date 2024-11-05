"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import MonsterComponent from "@/components/MonsterComponent";
import { API_URL } from "@/lib/dd5";

export default function MonsterFilter({ monsters }: { monsters: any[] }) {
  const [filter, setFilter] = useState("");

  const filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Filter by name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMonsters.map((monster: any) => (
          <MonsterComponent
            key={monster.index}
            name={monster.name}
            image={API_URL + monster.image}
            size={monster.size}
            type={monster.type}
            alignment={monster.alignment}
            armorClass={monster.armor_class[0].value}
            hitPoints={monster.hit_points}
            hitDice={monster.hit_dice}
            speed={monster.speed}
            strength={monster.strength}
            dexterity={monster.dexterity}
            constitution={monster.constitution}
            intelligence={monster.intelligence}
            wisdom={monster.wisdom}
            charisma={monster.charisma}
            languages={monster.languages}
            challengeRating={monster.challenge_rating}
            specialAbilities={monster.special_abilities}
            actions={monster.actions}
            legendaryActions={monster.legendary_actions}
          />
        ))}
      </div>
    </>
  );
}
