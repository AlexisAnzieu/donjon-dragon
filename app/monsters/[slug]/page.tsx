/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Monster } from "@/app/api/monsters/route";
import MonsterComponent from "@/app/components/monsters/MonsterComponent";
import PrintButton from "@/app/components/PrintButton";
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
    <div className="container mx-auto p-10">
      <PrintButton />
      <MonsterComponent key={monster.slug} {...monster} />
    </div>
  );
}
