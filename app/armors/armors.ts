export interface Armor {
  name: string;
  type: "Légère" | "Intermédiaire" | "Lourde" | "Bouclier";
  cost: number;
  armorClass: string; // Changed from number to string
  strength?: number;
  stealthDisadvantage: boolean;
  weight: number;
}

export const armors: Armor[] = [
  // Armures Légères
  {
    name: "Matelassée",
    type: "Légère",
    cost: 5,
    armorClass: "11 + modificateur de Dex",
    stealthDisadvantage: true,
    weight: 4,
  },
  {
    name: "Cuir",
    type: "Légère",
    cost: 10,
    armorClass: "11 + modificateur de Dex",
    stealthDisadvantage: false,
    weight: 5,
  },
  {
    name: "Cuir clouté",
    type: "Légère",
    cost: 45,
    armorClass: "12 + modificateur de Dex",
    stealthDisadvantage: false,
    weight: 6.5,
  },
  // Armures Intermédiaires
  {
    name: "Peau",
    type: "Intermédiaire",
    cost: 10,
    armorClass: "12 + modificateur de Dex (max 2)",
    stealthDisadvantage: false,
    weight: 6,
  },
  {
    name: "Chemise de mailles",
    type: "Intermédiaire",
    cost: 50,
    armorClass: "13 + modificateur de Dex (max 2)",
    stealthDisadvantage: false,
    weight: 10,
  },
  {
    name: "Écailles",
    type: "Intermédiaire",
    cost: 50,
    armorClass: "14 + modificateur de Dex (max 2)",
    stealthDisadvantage: true,
    weight: 22.5,
  },
  {
    name: "Cuirasse",
    type: "Intermédiaire",
    cost: 400,
    armorClass: "14 + modificateur de Dex (max 2)",
    stealthDisadvantage: false,
    weight: 10,
  },
  {
    name: "Demi-plate",
    type: "Intermédiaire",
    cost: 750,
    armorClass: "15 + modificateur de Dex (max 2)",
    stealthDisadvantage: true,
    weight: 18.1,
  },
  // Armures Lourdes
  {
    name: "Broigne",
    type: "Lourde",
    cost: 30,
    armorClass: "14",
    stealthDisadvantage: true,
    weight: 18.1,
  },
  {
    name: "Cotte de mailles",
    type: "Lourde",
    cost: 75,
    armorClass: "16",
    strength: 13,
    stealthDisadvantage: true,
    weight: 24.9,
  },
  {
    name: "Clibanion",
    type: "Lourde",
    cost: 200,
    armorClass: "17",
    strength: 15,
    stealthDisadvantage: true,
    weight: 27.2,
  },
  {
    name: "Harnois",
    type: "Lourde",
    cost: 1500,
    armorClass: "18",
    strength: 15,
    stealthDisadvantage: true,
    weight: 29.5,
  },
  // Bouclier
  {
    name: "Bouclier",
    type: "Bouclier",
    cost: 10,
    armorClass: "+2",
    stealthDisadvantage: false,
    weight: 2.7,
  },
];
