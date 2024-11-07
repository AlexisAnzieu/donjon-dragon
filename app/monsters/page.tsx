import { getMonsters } from "@/lib/dd5";
import MonsterFilter from "../components/monsters/MonsterFilter";
import type { Monster } from "../api/monsters/route";

export default async function Monsters() {
  // const monsters: Monster[] = await getMonsters();

  // if (!monsters) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* <MonsterFilter monsters={monsters} /> */}
    </div>
  );
}
