export const API_URL = "https://www.dnd5eapi.co";

export const getMonsters = async () => {
  const response = await fetch(`${API_URL}/api/monsters`);
  const data = await response.json();

  const monsterList = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
