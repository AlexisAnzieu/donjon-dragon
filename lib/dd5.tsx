export const API_URL = "https://www.dnd5eapi.co";

export const getMonsters = async () => {
  const response = await fetch(`${API_URL}/api/monsters`);
  const data = await response.json();

  const monsterList = await Promise.all(
    data.results.map(async (monster: any) => {
      return getMonster(monster.index);
    })
  );
  if (!response.ok) {
    throw new Error("Failed to fetch monsters");
  }
  return monsterList;
};

export const getMonster = async (slug: string) => {
  const response = await fetch(`${API_URL}/api/monsters/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch monster");
  }
  return response.json();
};
