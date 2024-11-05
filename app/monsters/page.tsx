import { API_URL, getMonsters } from "@/lib/dd5";
import MonsterComponent from "@/components/MonsterComponent";

export default async function Monsters() {
  const monsters = await getMonsters();

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {monsters?.map((monster: any) => (
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
    </div>
  );
}
