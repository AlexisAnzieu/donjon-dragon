export const monsters = [
  {
    name: "Anachorète de Talos",
    slug: "anachorete-de-talos",
    size: "M",
    type: "humanoïde",
    alignment: "neutre mauvais",
    armor_class: "13",
    hit_points: 58,
    hit_dice: "9d8+18",
    hit_points_roll: "9d8+18",
    speed: "9m",
    abilities: [
      { name: "STR", value: 16, modifier: "+3" },
      { name: "DEX", value: 13, modifier: "+1" },
      { name: "CON", value: 14, modifier: "+2" },
      { name: "INT", value: 9, modifier: "-1" },
      { name: "WIS", value: 15, modifier: "+2" },
      { name: "CHA", value: 12, modifier: "+1" },
    ],
    skills: ["Nature +1", "Discrétion +3", "Survie +4"],
    senses: ["vision dans le noir 18m", "Perception passive 12"],
    languages: ["Commun", "Orque"],
    challenge_rating: 3,
    special_abilities: [
      {
        "Sorts innés":
          "1/jour : Augure, Bénédiction, Éclair (8d6 dégâts), Réanimation\n3/jour : Vague tonnante",
      },
    ],
    actions: [
      {
        "Gantelet griffu":
          "Attaque d'arme au corps à corps : +5 pour toucher, portée 1,5 m, une cible. Touché : 5 (1d4 + 3) dégâts tranchants.",
      },
      {
        "Défense forme sanglier":
          "Attaque d'arme au corps à corps : +5 pour toucher, portée 1,5 m, une cible. Touché : 6 (1d6 + 3) dégâts tranchants.",
      },
    ],
    legendary_actions: [],
    description:
      "Ces reclus religieux reçoivent des pouvoirs de lancement de sorts de Talos, le dieu des tempêtes. Leurs ancêtres humains se sont croisés avec des orcs, et maintenant tous les anachorètes de Talos sont des demi-orcs.",
    imageUrl:
      "https://static.wikia.nocookie.net/forgottenrealms/images/b/bc/Anchorite_of_Talos.png",
    saving_throws: {},
    damage_resistances: [],
    damage_immunities: [],
    condition_immunities: [],
    xp: 700,
    proficiency_bonus: ["+2"],
  },
  {
    name: "Don-Jon Raskin",
    slug: "don-jon-raskin",
    size: "M",
    type: "humanoïde",
    alignment: "loyal neutre",
    armor_class: "16",
    hit_points: 93,
    hit_dice: "11d8+44",
    hit_points_roll: "11d8+44",
    speed: "9m",
    abilities: [
      { name: "STR", value: 18, modifier: "+4" },
      { name: "DEX", value: 15, modifier: "+2" },
      { name: "CON", value: 18, modifier: "+4" },
      { name: "INT", value: 11, modifier: "+0" },
      { name: "WIS", value: 11, modifier: "+0" },
      { name: "CHA", value: 15, modifier: "+2" },
    ],
    skills: ["Athlétisme +7", "Intimidation +5"],
    senses: ["Perception passive 10"],
    languages: ["Commun"],
    challenge_rating: 5,
    actions: [
      {
        "Attaques multiples":
          "Don-Jon effectue trois attaques avec son épée longue.",
      },
      {
        "Épée longue":
          "Attaque d'arme au corps à corps : +7 pour toucher, allonge 1,50 m, une cible. Touché : 8 (1d8+4) dégâts tranchants.",
      },
    ],
    legendary_actions: [],
    description:
      "Un maître d'armes expérimenté et propriétaire de taverne, Don-Jon est un ancien aventurier reconverti.",
    imageUrl:
      "https://static.wikia.nocookie.net/forgottenrealms/images/8/89/Don-jon_raskin.JPG",
    saving_throws: {
      STR: "+7",
      CON: "+7",
    },
    damage_resistances: [],
    damage_immunities: [],
    condition_immunities: [],
    xp: 1800,
    proficiency_bonus: ["+3"],
  },
  {
    name: "Falcon le Chasseur",
    slug: "falcon-le-chasseur",
    size: "M",
    type: "humanoïde",
    alignment: "neutre",
    armor_class: "14",
    hit_points: 84,
    hit_dice: "13d8+26",
    hit_points_roll: "13d8+26",
    speed: "9m",
    abilities: [
      { name: "STR", value: 11, modifier: "+0" },
      { name: "DEX", value: 18, modifier: "+4" },
      { name: "CON", value: 14, modifier: "+2" },
      { name: "INT", value: 11, modifier: "+0" },
      { name: "WIS", value: 13, modifier: "+1" },
      { name: "CHA", value: 11, modifier: "+0" },
    ],
    skills: ["Discrétion +7", "Perception +4", "Survie +4"],
    senses: ["Perception passive 14"],
    languages: ["Commun"],
    challenge_rating: 4,
    actions: [
      {
        "Attaques multiples":
          "Falcon effectue deux attaques avec son arc long.",
      },
      {
        "Arc long":
          "Attaque d'arme à distance : +7 pour toucher, portée 45/180 m, une cible. Touché : 8 (1d8+4) dégâts perforants.",
      },
    ],
    legendary_actions: [],
    description: "Un chasseur solitaire expert en archerie et en pistage.",
    imageUrl:
      "https://static.wikia.nocookie.net/forgottenrealms/images/2/27/Falcon_the_Hunter.jpeg",
    saving_throws: {
      DEX: "+7",
    },
    damage_resistances: [],
    damage_immunities: [],
    condition_immunities: [],
    xp: 1100,
    proficiency_bonus: ["+2"],
  },
  {
    name: "Gorthok",
    slug: "gorthok",
    size: "TG",
    type: "monstruosité",
    alignment: "chaotique neutre",
    armor_class: "17",
    hit_points: 147,
    hit_dice: "14d12+56",
    hit_points_roll: "14d12+56",
    speed: "15m",
    abilities: [
      { name: "STR", value: 23, modifier: "+6" },
      { name: "DEX", value: 14, modifier: "+2" },
      { name: "CON", value: 18, modifier: "+4" },
      { name: "INT", value: 6, modifier: "-2" },
      { name: "WIS", value: 12, modifier: "+1" },
      { name: "CHA", value: 16, modifier: "+3" },
    ],
    skills: ["Intimidation +7"],
    senses: ["Vision dans le noir 18m", "Perception passive 11"],
    languages: ["Primordial"],
    challenge_rating: 8,
    special_abilities: [
      {
        "Charge foudroyante":
          "Si Gorthok se déplace d'au moins 6 mètres en ligne droite vers une créature puis la touche avec une attaque de Coup de Corne lors du même tour, celle-ci subit 18 (4d8) dégâts de foudre supplémentaires.",
      },
    ],
    actions: [
      {
        "Attaques multiples":
          "Gorthok effectue deux attaques: une avec ses sabots et une avec ses cornes.",
      },
      {
        Sabots:
          "Attaque d'arme au corps à corps : +10 pour toucher, allonge 1,50 m, une cible. Touché : 18 (2d10+7) dégâts contondants.",
      },
      {
        "Coup de Corne":
          "Attaque d'arme au corps à corps : +10 pour toucher, allonge 3 m, une cible. Touché : 16 (2d8+7) dégâts perforants plus 9 (2d8) dégâts de foudre.",
      },
    ],
    legendary_actions: [],
    description:
      "Une créature bestiale massive invoquée par la foudre, connue comme l'Éveilleur de Tempête.",
    imageUrl:
      "https://5e.tools/img/bestiary/DIP/Gorthok%20the%20Thunder%20Boar.webp",
    saving_throws: {},
    damage_resistances: ["foudre"],
    damage_immunities: [],
    condition_immunities: [],
    xp: 3900,
    proficiency_bonus: ["+3"],
  },
  {
    name: "Gnome des Roches Reclus",
    slug: "gnome-des-roches-reclus",
    size: "P",
    type: "humanoïde",
    alignment: "neutre",
    armor_class: "10",
    hit_points: 7,
    hit_dice: "2d6",
    hit_points_roll: "2d6",
    speed: "7.5m",
    abilities: [
      { name: "STR", value: 6, modifier: "-2" },
      { name: "DEX", value: 11, modifier: "+0" },
      { name: "CON", value: 10, modifier: "+0" },
      { name: "INT", value: 15, modifier: "+2" },
      { name: "WIS", value: 10, modifier: "+0" },
      { name: "CHA", value: 13, modifier: "+1" },
    ],
    skills: ["Arcana +5", "Histoire +5", "Investigation +5"],
    senses: ["Vision dans le noir 18m", "Perception passive 10"],
    languages: ["Commun", "Gnome"],
    challenge_rating: 1 / 4,
    special_abilities: [
      {
        "Ruse gnome":
          "Le gnome obtient un avantage aux jets de sauvegarde d'Intelligence, Sagesse et Charisme contre la magie.",
      },
      {
        Sorts:
          "Le gnome est un lanceur de sorts de niveau 2. Sa caractéristique est l'Intelligence. Il a les sorts suivants préparés :\nSorts connus : 2\nEmplacements de sorts : 2\nSorts préparés : Lumière, Prestidigitation",
      },
    ],
    actions: [
      {
        "Rayon de givre":
          "Attaque de sort à distance : +4 pour toucher, portée 18 m, une cible. Touché : 4 (1d8) dégâts de froid et la vitesse de la cible est réduite de 3 mètres jusqu à la fin du prochain tour du gnome.",
      },
      {
        "Projectile magique - Niveau 1":
          "Le gnome crée trois projectiles magiques. Chaque projectile peut cibler une créature différente et inflige 3 (1d4+2) dégâts de force dans un rayon de 36m.",
      },
    ],
    legendary_actions: [],
    description:
      "Un gnome des roches érudit qui préfère la solitude et l'étude à la compagnie.",
    imageUrl:
      "https://static.wikia.nocookie.net/le-monde-des-royaumes-oublies/images/3/32/Gnome_des_roches_5E.jpg/revision/latest?cb=20231010070218&path-prefix=fr",
    saving_throws: {},
    damage_resistances: [],
    damage_immunities: [],
    condition_immunities: [],
    xp: 50,
    proficiency_bonus: ["+2"],
  },
];
