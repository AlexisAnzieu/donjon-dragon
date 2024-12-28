import { Monster } from "@/app/api/monsters/route";

export const API_URL = "https://www.dnd5eapi.co";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_BASE_URL;

export const getMonsters = async (): Promise<Monster[]> => {
  const response = await fetch(`${baseUrl}/api/monsters`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch monsters");
  }
  return data;
};

export const getMonster = async (slug: string): Promise<Monster> => {
  const response = await fetch(`${baseUrl}/api/monsters`);
  const data = await response.json();

  const monster = data.find((monster: Monster) => monster.slug === slug);

  if (!response.ok) {
    throw new Error("Failed to fetch monsters");
  }
  return monster;
};

export const searchMonsters = async ({
  slug,
}: {
  slug: string;
}): Promise<Monster[]> => {
  const response = await fetch(`${baseUrl}/api/monsters`);
  const data = await response.json();
  const monsters = data.filter((monster: Monster) =>
    monster.slug.includes(slug)
  );

  if (!response.ok) {
    throw new Error("Failed to fetch monsters");
  }
  return monsters;
};

export const getEquipments = async () => {
  const response = await fetch(`${API_URL}/api/equipment`);
  const data = await response.json();

  const equipmentList = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.results.map(async (equipment: any) => {
      return getEquipment(equipment.index);
    })
  );
  if (!response.ok) {
    throw new Error("Failed to fetch equipment");
  }
  return equipmentList;
};

export const getEquipment = async (slug: string) => {
  const response = await fetch(`${API_URL}/api/equipment/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch equipment item");
  }
  return response.json();
};
