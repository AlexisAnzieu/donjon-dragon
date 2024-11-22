/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Monster } from "@/app/api/monsters/route";
import MonsterComponent from "@/app/components/monsters/MonsterComponent";
import { getMonster, getMonsters } from "@/lib/dd5";

export async function generateStaticParams() {
  const monsters = await getMonsters();

  return monsters.map((monster: Monster) => ({
    slug: monster.slug,
  }));
}

export default async function Monster({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const monster: Monster = (await getMonster(slug))[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <MonsterComponent key={monster.slug} {...monster} />
    </div>
  );
}
