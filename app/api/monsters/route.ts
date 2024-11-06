import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export type Monster = Prisma.MonsterGetPayload<{
  include: {
    abilities: true;
    special_abilities: true;
    actions: true;
    legendary_actions: true;
  };
}>;

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
