import { getMonsters } from "@/lib/dd5";
import type { Monster } from "../api/monsters/route";
import MonstersTable from "./MonsterTable";

export default async function Monsters() {
  const monsters: Monster[] = await getMonsters();

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <MonstersTable monsters={monsters} />
    </div>
  );
}
