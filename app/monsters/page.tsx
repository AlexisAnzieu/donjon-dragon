/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMonsters } from "@/lib/dd5";
import MonsterFilter from "../components/monsters/MonsterFilter";

export default async function Monsters() {
  const monsters = await getMonsters();

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <MonsterFilter monsters={monsters} />
    </div>
  );
}
