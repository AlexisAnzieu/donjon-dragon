export const races: Race[] = [
  {
    name: "Elfe",
    description:
      "Les elfes sont des êtres gracieux et longévifs, souvent considérés comme les gardiens de la nature et de la magie. Ils possèdent une connexion profonde avec les forêts et les créatures qui y vivent, et leur longévité leur permet d'accumuler une grande sagesse au fil des siècles.",
    bonus: "+2 Dextérité",
    abilityScores: {
      dextérité: 2,
    },
    speed: "9m",
  },
  {
    name: "Halfelin",
    description:
      "Les halfelins, également connus sous le nom de hobbits, sont des petites gens agiles et joyeuses, réputées pour leur amour du confort et de la bonne chère. Ils vivent généralement dans des villages pittoresques et paisibles, entourés de champs fertiles et de jardins bien entretenus.",
    bonus: "+2 Dextérité",
    abilityScores: {
      dextérité: 2,
    },
    speed: "7.5m",
  },
  {
    name: "Humain",
    description:
      "Les humains sont la race la plus polyvalente et la plus répandue dans le monde. Leur adaptabilité et leur ambition leur permettent de s'épanouir dans presque tous les environnements et de réaliser de grandes choses. Les humains sont connus pour leur détermination, leur créativité et leur capacité à surmonter les obstacles.",
    bonus: "+1 à toutes les caractéristiques",
    abilityScores: {
      force: 1,
      dextérité: 1,
      constitution: 1,
      intelligence: 1,
      sagesse: 1,
      charisme: 1,
    },
    speed: "9m",
  },
  {
    name: "Nain",
    description:
      "Les nains sont des êtres robustes et solides, réputés pour leur passion pour l'artisanat et la bataille. Ils vivent principalement dans des forteresses souterraines, creusées dans les montagnes, où ils exploitent les richesses minérales et forgent des armes et des armures de qualité exceptionnelle.",
    bonus: "+2 Constitution",
    abilityScores: {
      constitution: 2,
    },
    speed: "7.5m",
  },
];
export type Race = {
  name: string;
  description: string;
  bonus: string;
  abilityScores: {
    [key: string]: number;
  };
  speed: string;
};

export const classes = [
  {
    name: "Barde",
    description:
      "Le barde utilise la musique et la poésie pour inspirer ses alliés et déstabiliser ses ennemis.",
    hitPointDice: 8,
  },
  {
    name: "Clerc",
    description:
      "Le clerc est un serviteur divin qui utilise la magie sacrée pour soigner et protéger.",
    hitPointDice: 8,
  },
  {
    name: "Magicien",
    description:
      "Le magicien maîtrise les arcanes et utilise des sorts puissants pour contrôler les forces magiques.",
    hitPointDice: 6,
  },
  {
    name: "Guerrier",
    description:
      "Le guerrier est un combattant expert, entraîné dans diverses techniques de combat et d'armement.",
    hitPointDice: 10,
  },
  {
    name: "Roublard",
    description:
      "Le roublard est un maître de la furtivité et de la tromperie, spécialisé dans les attaques sournoises.",
    hitPointDice: 8,
  },
];
