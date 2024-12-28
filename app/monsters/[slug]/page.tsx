/* eslint-disable @typescript-eslint/no-explicit-any */

import { type Monster } from "@/app/api/monsters/route";
import MonsterComponent from "@/app/monsters/MonsterComponent";
import PrintButton from "@/app/monsters/PrintButton";
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
  const monster = await getMonster(slug);
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 flex-column">
      <div className="p-8">
        <div className="text-center">
          <PrintButton elementId="MonsterComponent" />
        </div>
        <MonsterComponent key={monster.slug} {...monster} />
      </div>
    </main>
  );
}
