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

export type Class = {
  name: string;
  description: string;
  hitPointDice: number;
  equipment: string[][];
  proficiencies: {
    armures: string[];
    armes: string[];
    outils: string[];
    sauvegardes: string[];
    compétences: string[];
  };
};
export const classes: Class[] = [
  {
    name: "Barde",
    description:
      "Le barde utilise la musique et la poésie pour inspirer ses alliés et déstabiliser ses ennemis.",
    hitPointDice: 8,
    equipment: [
      ["Rapière", "épée longue", "arme courante au choix"],
      ["Paquetage de diplomate", "paquetage d'artiste"],
      ["Luth", "instrument de musique au choix"],
      ["Armure de cuir"],
      ["Dague"],
    ],
    proficiencies: {
      armures: ["Armures légères"],
      armes: [
        "Armes courantes",
        "Arbalète de poing",
        "Épée courte",
        "Épée longue",
        "Rapière",
      ],
      outils: ["Trois instruments de musique au choix"],
      sauvegardes: ["Dextérité", "Charisme"],
      compétences: ["Trois compétences au choix"],
    },
  },
  {
    name: "Clerc",
    description:
      "Le clerc est un serviteur divin qui utilise la magie sacrée pour soigner et protéger.",
    hitPointDice: 8,
    equipment: [
      ["Masse d'armes", "marteau de guerre (si maîtrise)"],
      ["Armure d'écailles", "armure de cuir", "cotte de mailles (si maîtrise)"],
      ["Arbalète légère et 20 carreaux", "une arme courante au choix"],
      ["Paquetage d'ecclésiastique", "paquetage d'explorateur"],
      ["Bouclier"],
      ["Symbole sacré"],
    ],
    proficiencies: {
      armures: ["Armures légères", "Armures intermédiaires", "Boucliers"],
      armes: ["Armes courantes"],
      outils: ["Aucun"],
      sauvegardes: ["Sagesse", "Charisme"],
      compétences: [
        "Histoire",
        "Intuition",
        "Médecine",
        "Persuasion",
        "Religion",
      ],
    },
  },
  {
    name: "Magicien",
    description:
      "Le magicien maîtrise les arcanes et utilise des sorts puissants pour contrôler les forces magiques.",
    hitPointDice: 6,
    equipment: [
      ["Bâton de combat", "Dague"],
      ["Sacoche à composantes", "Focaliseur arcanique"],
      ["Paquetage d'érudit", "Paquetage d'explorateur"],
      ["Grimoire"],
    ],
    proficiencies: {
      armures: ["Aucune"],
      armes: ["Dagues", "Dards", "Bâton", "Frondes"],
      outils: ["Aucun"],
      sauvegardes: ["Intelligence", "Sagesse"],
      compétences: [
        "Arcane",
        "Histoire",
        "Intuition",
        "Investigation",
        "Religion",
      ],
    },
  },
  {
    name: "Guerrier",
    description:
      "Le guerrier est un combattant expert, entraîné dans diverses techniques de combat et d'armement.",
    hitPointDice: 10,
    equipment: [
      ["Cotte de mailles", "Armure de cuir, arc long et 20 flèches"],
      ["Une arme de guerre et un bouclier", "Deux armes de guerre"],
      ["Arbalète légère et 20 carreaux", "Deux hachettes"],
      ["Paquetage d'exploration souterraine", "Paquetage d'explorateur"],
    ],
    proficiencies: {
      armures: [
        "Armures légères",
        "Armures intermédiaires",
        "Armures lourdes",
        "Boucliers",
      ],
      armes: ["Armes courantes", "Armes de guerre"],
      outils: ["Aucun"],
      sauvegardes: ["Force", "Constitution"],
      compétences: [
        "Acrobaties",
        "Athlétisme",
        "Intimidation",
        "Perception",
        "Survie",
      ],
    },
  },
  {
    name: "Roublard",
    description:
      "Le roublard est un maître de la furtivité et de la tromperie, spécialisé dans les attaques sournoises.",
    hitPointDice: 8,
    equipment: [
      ["Rapière", "épée courte"],
      ["Arc court et carquois de 20 flèches", "épée courte"],
      [
        "Paquetage de cambrioleur",
        "paquetage d'exploration souterraine",
        "paquetage d'explorateur",
      ],
      ["Armure de cuir", "Deux dagues", "Outils de voleur"],
    ],
    proficiencies: {
      armures: ["Armures légères"],
      armes: ["Arbalète de poing", "Épée courte", "Épée longue", "Rapière"],
      outils: ["Outils de voleur"],
      sauvegardes: ["Dextérité", "Intelligence"],
      compétences: [
        "Acrobaties",
        "Discrétion",
        "Escamotage",
        "Investigation",
        "Perception",
      ],
    },
  },
];
