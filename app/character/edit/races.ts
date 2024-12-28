//TODO: Elfe maitrise perception comme aptitude

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
  };
  sauvegardes: string[];
  skills: {
    canSelect: number;
    choices: string[];
  };
  spellsLimit: {
    minor: number;
  };
};

export type Equipment = {
  name: string;
  effects?: {
    ac: number;
  };
};

export const equipmentData: Record<string, Equipment> = {
  "Armure de cuir": {
    name: "armure de cuir",
    effects: {
      ac: 1,
    },
  },
  "Cotte de mailles": {
    name: "cotte de mailles",
    effects: {
      ac: 16,
    },
  },
  Bouclier: {
    name: "bouclier",
    effects: {
      ac: 2,
    },
  },
};
export const equipments = [
  {
    name: "Paquetage de diplomate",
    description:
      "Comprend un coffre, 2 étuis à cartes ou parchemins, des vêtements fins, une bouteille d'encre, une plume d'écriture, une lampe, deux flasques d'huile, 5 feuilles de papier, un flacon de parfum, de la cire à cacheter et du savon.",
    price: "39 po",
  },
  {
    name: "Paquetage d'artiste",
    description:
      "Comprend un sac à dos, un sac de couchage, 2 costumes, 5 bougies, 5 jours de rations, une gourde d'eau et un kit de déguisement.",
    price: "40 po",
  },
  {
    name: "Paquetage de cambrioleur",
    description:
      "Comprend un sac à dos, un sac de 1000 billes, 3 mètres de chaîne, une cloche, 5 bougies, un pied-de-biche, un marteau, 10 pitons, une lanterne à capuchon, 2 flasques d'huile, 5 jours de rations, une boite d'allume-feu et une gourde d'eau. Le sac comprend aussi 15 mètres de corde de chanvre attachée sur son côté.",
    price: "16 po",
  },
  {
    name: "Paquetage de diplomate",
    description:
      "Comprend un coffre, 2 étuis à cartes ou parchemins, des vêtements fins, une bouteille d'encre, une plume d'écriture, une lampe, deux flasques d'huile, 5 feuilles de papier, un flacon de parfum, de la cire à cacheter et du savon.",
    price: "39 po",
  },
  {
    name: "Paquetage d'ecclésiastique",
    description:
      "Comprend un sac à dos, une couverture, 10 bougies, une boite d'allume-feu, une boîte pour l'aumône, 2 bâtonnets d'encens, un encensoir, des habits de cérémonie, 2 jours de rations et une gourde d'eau.",
    price: "19 po",
  },
  {
    name: "Paquetage d'érudit",
    description:
      "Comprend un sac à dos, un livre de connaissance, une bouteille d'encre, une plume d'écriture, 10 feuilles de parchemin, un petit sac de sable et un petit couteau.",
    price: "40 po",
  },
  {
    name: "Paquetage d'explorateur",
    description:
      "Comprend un sac à dos, un sac de couchage, une gamelle, une boite d'allume-feu, 10 torches, 10 jours de rations et une gourde d'eau. Le sac comprend aussi 15 mètres de corde de chanvre attachée sur son côté.",
    price: "10 po",
  },
  {
    name: "Paquetage d'exploration souterraine",
    description:
      "Comprend un sac à dos, un pied de biche, un marteau, 10 pitons, 10 torches, une boite d'allume-feu, 10 jours de rations et une gourde d'eau. Le sac comprend aussi 15 mètres de corde de chanvre attachée sur son côté.",
    price: "12 po",
  },
];

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
    },
    sauvegardes: ["dextérité", "charisme"],
    skills: {
      canSelect: 3,
      choices: [
        "Acrobaties",
        "Athlétisme",
        "Discrétion",
        "Histoire",
        "Intuition",
        "Représentation",
        "Persuasion",
      ],
    },
    spellsLimit: {
      minor: 2,
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
    },
    sauvegardes: ["sagesse", "charisme"],
    skills: {
      canSelect: 2,
      choices: ["Histoire", "Intuition", "Médecine", "Persuasion", "Religion"],
    },
    spellsLimit: {
      minor: 3,
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
    },
    sauvegardes: ["intelligence", "sagesse"],
    skills: {
      canSelect: 2,
      choices: [
        "Arcanes",
        "Histoire",
        "Intuition",
        "Investigation",
        "Médecine",
        "Religion",
      ],
    },
    spellsLimit: {
      minor: 3,
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
    },
    sauvegardes: ["force", "constitution"],
    skills: {
      canSelect: 2,
      choices: [
        "Acrobaties",
        "Athlétisme",
        "Dressage",
        "Histoire",
        "Intimidation",
        "Intuition",
        "Perception",
        "Survie",
      ],
    },
    spellsLimit: {
      minor: 0,
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
      ["Armure de cuir, deux dagues et des outils de voleur"],
    ],
    proficiencies: {
      armures: ["Armures légères"],
      armes: [
        "Arbalète de poing",
        "Épée courte",
        "Épée longue",
        "Rapière",
        "Armes courantes",
      ],
      outils: ["Outils de voleur"],
    },
    sauvegardes: ["dextérité", "intelligence"],
    skills: {
      canSelect: 4,
      choices: [
        "Acrobaties",
        "Athlétisme",
        "Discrétion",
        "Escamotage",
        "Intimidation",
        "Intuition",
        "Investigation",
        "Perception",
        "Persuasion",
        "Représentation",
        "Tromperie",
      ],
    },
    spellsLimit: {
      minor: 0,
    },
  },
];

export type Spell = {
  name: string;
  description: string;
  duration: string;
  portée: string;
  composantes: string;
  level: number;
};

export const spells: Record<string, Spell[]> = {
  Barde: [
    {
      name: "Lumière",
      description: "Fait briller un objet comme une torche pendant 1 heure.",
      duration: "1 heure",
      portée: "Contact",
      composantes: "V, M (une luciole ou de la mousse phosphorescente)",
      level: 0,
    },
    {
      name: "Lumières dansantes",
      description:
        "Crée jusqu'à quatre lumières flottantes qui ressemblent à des lanternes ou des torches.",
      duration: "1 minute",
      portée: "36 mètres",
      composantes: "V, S, M (un bout de phosphore ou un ver luisant)",
      level: 0,
    },
    {
      name: "Main du mage",
      description:
        "Crée une main spectrale qui peut manipuler des objets à distance.",
      duration: "1 minute",
      portée: "9 mètres",
      composantes: "V, S",
      level: 0,
    },
    {
      name: "Message",
      description: "Permet de chuchoter un message à une créature distante.",
      duration: "1 round",
      portée: "36 mètres",
      composantes: "V, S, M (un petit bout de fil de cuivre)",
      level: 0,
    },
    {
      name: "Moquerie cruelle",
      description:
        "Inflige 1d4 dégâts psychiques en insultant magiquement une créature.",
      duration: "Instantanée",
      portée: "18 mètres",
      composantes: "V",
      level: 0,
    },
    {
      name: "Prestidigitation",
      description:
        "Permet de créer des effets magiques mineurs comme nettoyer, allumer une flamme, etc.",
      duration: "Jusqu'à 1 heure",
      portée: "3 mètres",
      composantes: "V, S",
      level: 0,
    },
    {
      name: "Réparation",
      description: "Répare une cassure ou une déchirure unique dans un objet.",
      duration: "Instantanée",
      portée: "Contact",
      composantes: "V, S, M (deux aimants)",
      level: 0,
    },
    {
      name: "Charme-personne",
      description:
        "Charme une créature humanoïde qui vous considère comme un ami.",
      duration: "1 heure",
      portée: "9 mètres",
      composantes: "V, S",
      level: 1,
    },
    {
      name: "Héroïsme",
      description:
        "Donne à une créature des points de vie temporaires et l'immunise contre la peur.",
      duration: "Concentration, jusqu'à 1 minute",
      portée: "Contact",
      composantes: "V, S",
      level: 1,
    },
    {
      name: "Mot de guérison",
      description:
        "Restaure 1d4 + votre modificateur de caractéristique d'incantation points de vie.",
      duration: "Instantanée",
      portée: "18 mètres",
      composantes: "V",
      level: 1,
    },
    {
      name: "Compréhension des langues",
      description: "Vous comprenez toutes les langues écrites et parlées.",
      duration: "1 heure",
      portée: "Personnelle",
      composantes: "V, S, M (une pincée de suie et de sel)",
      level: 1,
    },
    {
      name: "Détection de la magie",
      description: "Détecte la présence de magie dans un rayon de 9 mètres.",
      duration: "Concentration, jusqu'à 10 minutes",
      portée: "Personnelle",
      composantes: "V, S",
      level: 1,
    },
    {
      name: "Identification",
      description: "Détermine les propriétés d'un objet magique.",
      duration: "Instantanée",
      portée: "Contact",
      composantes: "V, S, M (une perle d'une valeur de 100 po)",
      level: 1,
    },
    {
      name: "Vague tonnante",
      description:
        "Onde de force qui repousse les créatures et émet un bruit tonnant.",
      duration: "Instantanée",
      portée: "Personnelle (cube de 4,50 mètres)",
      composantes: "V, S",
      level: 1,
    },
  ],
  Clerc: [
    {
      name: "Aspersion acide",
      description: "Lance une bulle d'acide qui inflige 1d6 dégâts d'acide.",
      duration: "Instantanée",
      portée: "18 mètres",
      composantes: "V, S",
      level: 0,
    },
    {
      name: "Flamme sacrée",
      description:
        "Rayonnement semblable à des flammes qui inflige 1d8 dégâts radiants.",
      duration: "Instantanée",
      portée: "18 mètres",
      composantes: "V, S",
      level: 0,
    },
    {
      name: "Lumière",
      description: "Fait briller un objet comme une torche pendant 1 heure.",
      duration: "1 heure",
      portée: "Contact",
      composantes: "V, M (une luciole ou de la mousse phosphorescente)",
      level: 0,
    },
    {
      name: "Protection contre les armes",
      description: "Crée une barrière magique qui donne +1 à la CA.",
      duration: "1 round",
      portée: "Personnelle",
      composantes: "V, S",
      level: 0,
    },
    {
      name: "Réparation",
      description: "Répare une cassure ou une déchirure unique dans un objet.",
      duration: "Instantanée",
      portée: "Contact",
      composantes: "V, S, M (deux aimants)",
      level: 0,
    },
    {
      name: "Résistance",
      description:
        "Le sujet peut ajouter 1d4 à un jet de sauvegarde de son choix.",
      duration: "1 minute",
      portée: "Contact",
      composantes: "V, S, M (une cape miniature)",
      level: 0,
    },
    {
      name: "Thaumaturgie",
      description:
        "Crée des effets surnaturels mineurs comme faire trembler le sol ou amplifier sa voix.",
      duration: "Jusqu'à 1 minute",
      portée: "9 mètres",
      composantes: "V",
      level: 0,
    },
    {
      name: "Bénédiction",
      description:
        "Jusqu'à trois créatures gagnent +1d4 aux jets d'attaque et de sauvegarde.",
      duration: "Concentration, jusqu'à 1 minute",
      portée: "9 mètres",
      composantes: "V, S, M (goutte d'eau bénite)",
      level: 1,
    },
    {
      name: "Soin des blessures",
      description:
        "Restaure 1d8 + votre modificateur de caractéristique d'incantation points de vie.",
      duration: "Instantanée",
      portée: "Contact",
      composantes: "V, S",
      level: 1,
    },
    {
      name: "Sanctuaire",
      description: "Protège une créature contre les attaques.",
      duration: "1 minute",
      portée: "9 mètres",
      composantes: "V, S, M (petit miroir d'argent)",
      level: 1,
    },
    {
      name: "Bouclier de la foi",
      description: "Crée un champ de protection donnant +2 à la CA.",
      duration: "Concentration, jusqu'à 10 minutes",
      portée: "18 mètres",
      composantes: "V, S, M (un petit parchemin)",
      level: 1,
    },
    {
      name: "Création ou destruction d'eau",
      description: "Crée ou détruit jusqu'à 40 litres d'eau.",
      duration: "Instantanée",
      portée: "9 mètres",
      composantes:
        "V, S, M (une goutte d'eau pour la création, quelques grains de sable pour la destruction)",
      level: 1,
    },
    {
      name: "Détection de la magie",
      description: "Détecte la présence de magie dans un rayon de 9 mètres.",
      duration: "Concentration, jusqu'à 10 minutes",
      portée: "Personnelle",
      composantes: "V, S",
      level: 1,
    },
    {
      name: "Injonction",
      description: "Force une créature à suivre un ordre d'un mot.",
      duration: "1 round",
      portée: "18 mètres",
      composantes: "V",
      level: 1,
    },
  ],
  Magicien: [
    {
      name: "Aspersion acide",
      description: "Lance une bulle d'acide qui inflige 1d6 dégâts d'acide.",
      duration: "Instantanée",
      portée: "18 mètres",
      composantes: "V, S",
      level: 0,
    },
    {
      name: "Illusion mineure",
      description:
        "Crée un son ou une image illusoire qui dure jusqu'à 1 minute.",
      duration: "1 minute",
      portée: "9 mètres",
      composantes: "S, M (un peu de laine)",
      level: 0,
    },
    {
      name: "Lumière",
      description: "Fait briller un objet comme une torche pendant 1 heure.",
      duration: "1 heure",
      portée: "Contact",
      composantes: "V, M (une luciole ou de la mousse phosphorescente)",
      level: 0,
    },
    {
      name: "Main du mage",
      description:
        "Crée une main spectrale qui peut manipuler des objets à distance.",
      duration: "1 minute",
      portée: "9 mètres",
      composantes: "V, S",
      level: 0,
    },
    {
      name: "Message",
      description: "Permet de chuchoter un message à une créature distante.",
      duration: "1 round",
      portée: "36 mètres",
      composantes: "V, S, M (un petit bout de fil de cuivre)",
      level: 0,
    },
    {
      name: "Prestidigitation",
      description:
        "Permet de créer des effets magiques mineurs comme nettoyer, allumer une flamme, etc.",
      duration: "Jusqu'à 1 heure",
      portée: "3 mètres",
      composantes: "V, S",
      level: 0,
    },
    {
      name: "Projectile magique",
      description:
        "Lance trois projectiles d'énergie infligeant 1d4+1 dégâts de force chacun.",
      duration: "Instantanée",
      portée: "36 mètres",
      composantes: "V, S",
      level: 0,
    },
    {
      name: "Rayon de givre",
      description:
        "Rayon de froid qui inflige 1d8 dégâts de froid et réduit la vitesse.",
      duration: "Instantanée",
      portée: "18 mètres",
      composantes: "V, S",
      level: 0,
    },
    {
      name: "Réparation",
      description: "Répare une cassure ou une déchirure unique dans un objet.",
      duration: "Instantanée",
      portée: "Contact",
      composantes: "V, S, M (deux aimants)",
      level: 0,
    },
    {
      name: "Armure du mage",
      description:
        "La CA de base du sujet devient 13 + son modificateur de Dextérité.",
      duration: "8 heures",
      portée: "Contact",
      composantes: "V, S, M (bout de cuir tanné)",
      level: 1,
    },
    {
      name: "Bouclier",
      description:
        "Réaction qui donne +5 à la CA et immunité contre projectile magique.",
      duration: "1 round",
      portée: "Personnelle",
      composantes: "V, S",
      level: 1,
    },
    {
      name: "Sommeil",
      description: "Fait tomber des créatures inconscientes (5d8 PV total).",
      duration: "1 minute",
      portée: "27 mètres",
      composantes: "V, S, M (sable fin)",
      level: 1,
    },
    {
      name: "Déguisement",
      description: "Change votre apparence.",
      duration: "1 heure",
      portée: "Personnelle",
      composantes: "V, S",
      level: 1,
    },
    {
      name: "Détection de la magie",
      description: "Détecte la présence de magie dans un rayon de 9 mètres.",
      duration: "Concentration, jusqu'à 10 minutes",
      portée: "Personnelle",
      composantes: "V, S",
      level: 1,
    },
    {
      name: "Identification",
      description: "Détermine les propriétés d'un objet magique.",
      duration: "Instantanée",
      portée: "Contact",
      composantes: "V, S, M (une perle d'une valeur de 100 po)",
      level: 1,
    },
    {
      name: "Mains brûlantes",
      description: "Cône de flammes infligeant 3d6 dégâts de feu.",
      duration: "Instantanée",
      portée: "Personnelle (cône de 4,50 mètres)",
      composantes: "V, S",
      level: 1,
    },
    {
      name: "Projectile magique",
      description:
        "Trois projectiles d'énergie infligeant 1d4+1 dégâts de force chacun.",
      duration: "Instantanée",
      portée: "36 mètres",
      composantes: "V, S",
      level: 1,
    },
  ],
  Guerrier: [],
  Roublard: [],
};

export const skills = {
  acrobaties: { name: "Acrobaties", ability: "dextérité" },
  arcanes: { name: "Arcanes", ability: "intelligence" },
  athlétisme: { name: "Athlétisme", ability: "force" },
  discrétion: { name: "Discrétion", ability: "dextérité" },
  dressage: { name: "Dressage", ability: "sagesse" },
  escamotage: { name: "Escamotage", ability: "dextérité" },
  histoire: { name: "Histoire", ability: "intelligence" },
  intimidation: { name: "Intimidation", ability: "charisme" },
  intuition: { name: "Intuition", ability: "sagesse" },
  investigation: { name: "Investigation", ability: "intelligence" },
  médecine: { name: "Médecine", ability: "sagesse" },
  nature: { name: "Nature", ability: "intelligence" },
  perception: { name: "Perception", ability: "sagesse" },
  persuasion: { name: "Persuasion", ability: "charisme" },
  religion: { name: "Religion", ability: "intelligence" },
  représentation: { name: "Représentation", ability: "charisme" },
  survie: { name: "Survie", ability: "sagesse" },
  tromperie: { name: "Tromperie", ability: "charisme" },
};
