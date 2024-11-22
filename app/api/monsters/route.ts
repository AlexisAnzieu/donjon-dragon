import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export type Monster = Prisma.MonsterGetPayload<{
  include: {
    abilities: true;
    special_abilities: true;
    actions: true;
    legendary_actions: true;
  };
}> & {
  skills: string[];
  senses: string[];
  languages: string[];
  damage_immunities: string[];
  condition_immunities: string[];
  damage_resistances: string[];
  damage_vulnerabilities: string[];
  proficiency_bonus: string[];
  saving_throws: Record<string, string>;
};

export async function GET() {
  const monsters = await prisma.monster.findMany({
    include: {
      abilities: true,
      special_abilities: true,
      actions: true,
      legendary_actions: true,
    },
  });

  return new Response(JSON.stringify(monsters), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const { slug } = await request.json();

  const monsters = await prisma.monster.findMany({
    include: {
      abilities: true,
      special_abilities: true,
      actions: true,
      legendary_actions: true,
    },
    where: {
      slug,
    },
  });

  return new Response(JSON.stringify(monsters), {
    headers: { "Content-Type": "application/json" },
  });
}
