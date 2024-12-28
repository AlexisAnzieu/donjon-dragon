export type WeaponProperty =
  | "polyvalente"
  | "finesse"
  | "légère"
  | "lancer"
  | "à deux mains"
  | "munitions"
  | "chargement"
  | "lourde"
  | "allonge"
  | "spéciale";

export type WeaponDamageType = "contondant" | "perforant" | "tranchant" | "";

export interface Weapon {
  name: string;
  price: {
    value: number;
    unit: "pa" | "po" | "pc";
  };
  damage: {
    dice: string;
    type: WeaponDamageType;
  };
  weight: number;
  properties: {
    name: WeaponProperty;
    value?: string;
  }[];
  category:
    | "corps-à-corps courantes"
    | "distance courantes"
    | "corps-à-corps de guerre"
    | "distance de guerre";
}

export const weapons: Weapon[] = [
  {
    name: "Bâton",
    price: { value: 2, unit: "pa" },
    damage: { dice: "1d6", type: "contondant" },
    weight: 2,
    properties: [{ name: "polyvalente", value: "1d8" }],
    category: "corps-à-corps courantes",
  },
  {
    name: "Dague",
    price: { value: 2, unit: "po" },
    damage: { dice: "1d4", type: "perforant" },
    weight: 0.5,
    properties: [
      { name: "finesse" },
      { name: "légère" },
      { name: "lancer", value: "6/18" },
    ],
    category: "corps-à-corps courantes",
  },
  {
    name: "Gourdin",
    price: { value: 1, unit: "pa" },
    damage: { dice: "1d4", type: "contondant" },
    weight: 1,
    properties: [{ name: "légère" }],
    category: "corps-à-corps courantes",
  },
  {
    name: "Hachette",
    price: { value: 5, unit: "po" },
    damage: { dice: "1d6", type: "tranchant" },
    weight: 1,
    properties: [{ name: "légère" }, { name: "lancer", value: "6/18" }],
    category: "corps-à-corps courantes",
  },
  {
    name: "Javelines",
    price: { value: 5, unit: "pa" },
    damage: { dice: "1d6", type: "perforant" },
    weight: 1,
    properties: [{ name: "lancer", value: "9/36" }],
    category: "corps-à-corps courantes",
  },
  {
    name: "Lance",
    price: { value: 1, unit: "po" },
    damage: { dice: "1d6", type: "perforant" },
    weight: 1.5,
    properties: [
      { name: "lancer", value: "6/18" },
      { name: "polyvalente", value: "1d8" },
    ],
    category: "corps-à-corps courantes",
  },
  {
    name: "Marteau léger",
    price: { value: 2, unit: "po" },
    damage: { dice: "1d4", type: "contondant" },
    weight: 1,
    properties: [{ name: "légère" }, { name: "lancer", value: "6/18" }],
    category: "corps-à-corps courantes",
  },
  {
    name: "Masse d'armes",
    price: { value: 5, unit: "po" },
    damage: { dice: "1d6", type: "contondant" },
    weight: 2,
    properties: [],
    category: "corps-à-corps courantes",
  },
  {
    name: "Massue",
    price: { value: 2, unit: "pa" },
    damage: { dice: "1d8", type: "contondant" },
    weight: 5,
    properties: [{ name: "à deux mains" }],
    category: "corps-à-corps courantes",
  },
  {
    name: "Serpe",
    price: { value: 1, unit: "po" },
    damage: { dice: "1d4", type: "tranchant" },
    weight: 1,
    properties: [{ name: "légère" }],
    category: "corps-à-corps courantes",
  },
  {
    name: "Arbalète légère",
    price: { value: 25, unit: "po" },
    damage: { dice: "1d8", type: "perforant" },
    weight: 2.5,
    properties: [
      { name: "munitions", value: "24/96" },
      { name: "chargement" },
      { name: "à deux mains" },
    ],
    category: "distance courantes",
  },
  {
    name: "Arc court",
    price: { value: 25, unit: "po" },
    damage: { dice: "1d6", type: "perforant" },
    weight: 1,
    properties: [
      { name: "munitions", value: "24/96" },
      { name: "à deux mains" },
    ],
    category: "distance courantes",
  },
  {
    name: "Fléchettes",
    price: { value: 5, unit: "pc" },
    damage: { dice: "1d4", type: "perforant" },
    weight: 0.1,
    properties: [{ name: "finesse" }, { name: "lancer", value: "6/18" }],
    category: "distance courantes",
  },
  {
    name: "Fronde",
    price: { value: 1, unit: "pa" },
    damage: { dice: "1d4", type: "contondant" },
    weight: 0,
    properties: [{ name: "munitions", value: "9/36" }],
    category: "distance courantes",
  },
  {
    name: "Cimeterre",
    price: { value: 25, unit: "po" },
    damage: { dice: "1d6", type: "tranchant" },
    weight: 1.5,
    properties: [{ name: "finesse" }, { name: "légère" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Coutille",
    price: { value: 20, unit: "po" },
    damage: { dice: "1d10", type: "tranchant" },
    weight: 3,
    properties: [
      { name: "lourde" },
      { name: "allonge" },
      { name: "à deux mains" },
    ],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Épée à deux mains",
    price: { value: 50, unit: "po" },
    damage: { dice: "2d6", type: "tranchant" },
    weight: 3,
    properties: [{ name: "lourde" }, { name: "à deux mains" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Épée courte",
    price: { value: 10, unit: "po" },
    damage: { dice: "1d6", type: "perforant" },
    weight: 1,
    properties: [{ name: "finesse" }, { name: "légère" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Épée longue",
    price: { value: 15, unit: "po" },
    damage: { dice: "1d8", type: "tranchant" },
    weight: 1.5,
    properties: [{ name: "polyvalente", value: "1d10" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Fléau",
    price: { value: 10, unit: "po" },
    damage: { dice: "1d8", type: "contondant" },
    weight: 1,
    properties: [],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Fouet",
    price: { value: 2, unit: "po" },
    damage: { dice: "1d4", type: "tranchant" },
    weight: 1.5,
    properties: [{ name: "finesse" }, { name: "allonge" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Hache à deux mains",
    price: { value: 30, unit: "po" },
    damage: { dice: "1d12", type: "tranchant" },
    weight: 3.5,
    properties: [{ name: "lourde" }, { name: "à deux mains" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Hache d'armes",
    price: { value: 10, unit: "po" },
    damage: { dice: "1d8", type: "tranchant" },
    weight: 2,
    properties: [{ name: "polyvalente", value: "1d10" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Hallebarde",
    price: { value: 20, unit: "po" },
    damage: { dice: "1d10", type: "tranchant" },
    weight: 3,
    properties: [
      { name: "lourde" },
      { name: "allonge" },
      { name: "à deux mains" },
    ],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Lance d'arçon",
    price: { value: 10, unit: "po" },
    damage: { dice: "1d12", type: "perforant" },
    weight: 3,
    properties: [{ name: "allonge" }, { name: "spéciale" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Marteau de guerre",
    price: { value: 15, unit: "po" },
    damage: { dice: "1d8", type: "contondant" },
    weight: 1,
    properties: [{ name: "polyvalente", value: "1d10" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Merlin",
    price: { value: 10, unit: "po" },
    damage: { dice: "2d6", type: "contondant" },
    weight: 5,
    properties: [{ name: "lourde" }, { name: "à deux mains" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Morgenstern",
    price: { value: 15, unit: "po" },
    damage: { dice: "1d8", type: "perforant" },
    weight: 2,
    properties: [],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Pic de guerre",
    price: { value: 5, unit: "po" },
    damage: { dice: "1d8", type: "perforant" },
    weight: 1,
    properties: [],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Pique",
    price: { value: 5, unit: "po" },
    damage: { dice: "1d10", type: "perforant" },
    weight: 9,
    properties: [
      { name: "lourde" },
      { name: "allonge" },
      { name: "à deux mains" },
    ],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Rapière",
    price: { value: 25, unit: "po" },
    damage: { dice: "1d8", type: "perforant" },
    weight: 1,
    properties: [{ name: "finesse" }],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Trident",
    price: { value: 5, unit: "po" },
    damage: { dice: "1d6", type: "perforant" },
    weight: 2,
    properties: [
      { name: "lancer", value: "6/18" },
      { name: "polyvalente", value: "1d8" },
    ],
    category: "corps-à-corps de guerre",
  },
  {
    name: "Arbalète de poing",
    price: { value: 75, unit: "po" },
    damage: { dice: "1d6", type: "perforant" },
    weight: 1.5,
    properties: [
      { name: "munitions", value: "9/36" },
      { name: "légère" },
      { name: "chargement" },
    ],
    category: "distance de guerre",
  },
  {
    name: "Arbalète lourde",
    price: { value: 50, unit: "po" },
    damage: { dice: "1d10", type: "perforant" },
    weight: 9,
    properties: [
      { name: "munitions", value: "30/120" },
      { name: "lourde" },
      { name: "chargement" },
      { name: "à deux mains" },
    ],
    category: "distance de guerre",
  },
  {
    name: "Arc long",
    price: { value: 50, unit: "po" },
    damage: { dice: "1d8", type: "perforant" },
    weight: 1,
    properties: [
      { name: "munitions", value: "45/180" },
      { name: "lourde" },
      { name: "à deux mains" },
    ],
    category: "distance de guerre",
  },
  {
    name: "Filet",
    price: { value: 1, unit: "po" },
    damage: { dice: "-", type: "" },
    weight: 1.5,
    properties: [{ name: "spéciale" }, { name: "lancer", value: "1.5/4.5" }],
    category: "distance de guerre",
  },
  {
    name: "Sarbacane",
    price: { value: 10, unit: "po" },
    damage: { dice: "1", type: "perforant" },
    weight: 0.5,
    properties: [
      { name: "munitions", value: "7.5/30" },
      { name: "chargement" },
    ],
    category: "distance de guerre",
  },
];
