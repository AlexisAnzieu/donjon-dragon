/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Monster } from "@/app/api/monsters/route";
import MonsterComponent from "@/app/components/monsters/MonsterComponent";
import { getMonster } from "@/lib/dd5";
import { notFound } from "next/navigation";

interface MonsterPageProps {
  params: {
    slug: string;
  };
}

export default async function Monster({ params }: MonsterPageProps) {
  const { slug } = params;
  const monsterData = await getMonster(slug);

  if (!monsterData?.length) {
    notFound();
  }

  const monster: Monster = monsterData[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <MonsterComponent key={monster.slug} {...monster} />
    </div>
  );
}
