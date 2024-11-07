export const races = [
  {
    name: "Elfe",
    description:
      "Les elfes sont des êtres gracieux et longévifs, souvent considérés comme les gardiens de la nature et de la magie. Ils possèdent une connexion profonde avec les forêts et les créatures qui y vivent, et leur longévité leur permet d'accumuler une grande sagesse au fil des siècles. Les elfes sont connus pour leurs sens aiguisés, leur agilité et leur maîtrise de l'arc et de la lame. Ils vivent souvent dans des communautés cachées au cœur des bois, où ils pratiquent des arts anciens et des rituels mystiques. Leur culture est riche en traditions et en légendes, et ils vénèrent des divinités liées à la nature et aux étoiles.",
    classes: [
      {
        name: "Barde - Chanteur des Astres",
        description:
          "Ce barde elfique est un poète céleste, communiant avec les étoiles et les constellations. Ils chantent des chants anciens qui influencent le destin de leurs alliés et ennemis.",
        abilities: [
          "Influence du Destin",
          "Chants de Bonne Fortune",
          "Alignement Astral",
        ],
      },
      {
        name: "Clerc - Gardien de la Sylve",
        description:
          "Clerc dédié aux anciens esprits de la forêt, protégeant la nature et les créatures qui y résident.",
        abilities: [
          "Invocation de l'Esprit Forestier",
          "Soins de la Terre",
          "Bénédiction de la Nature",
        ],
      },
      {
        name: "Magicien - Maître des Illusions",
        description:
          "Les elfes illusionnistes maîtrisent l'art de la tromperie magique, rendant leurs illusions presque réelles.",
        abilities: [
          "Voile d'Invisibilité",
          "Création d'Illusions Réelles",
          "Charme Illusoire",
        ],
      },
      {
        name: "Guerrier - Épéiste de l'Éclat Lunaire",
        description:
          "Guerrier qui s'entraîne sous la lumière de la lune, utilisant des techniques de combat gracieuses et rapides.",
        abilities: ["Danse de Lune", "Lame de Lumière", "Reflet Lunaire"],
      },
      {
        name: "Roublard - Veilleur des Ombres",
        description:
          "Maître de la furtivité, ce roublard se fond dans les ombres et attaque ses ennemis de manière furtive.",
        abilities: [
          "Pas de l'Ombre",
          "Dissimulation Nocturne",
          "Assaut Furtif",
        ],
      },
    ],
  },
  {
    name: "Halfelin",
    description:
      "Les halfelins, également connus sous le nom de hobbits, sont des petites gens agiles et joyeuses, réputées pour leur amour du confort et de la bonne chère. Ils vivent généralement dans des villages pittoresques et paisibles, entourés de champs fertiles et de jardins bien entretenus. Les halfelins sont des êtres discrets et chanceux, souvent capables de se sortir des situations les plus périlleuses grâce à leur ingéniosité et leur bonne fortune. Leur taille réduite et leur agilité naturelle en font des experts en furtivité et en évasion. Malgré leur apparence innocente, les halfelins possèdent un courage indomptable et une loyauté sans faille envers leurs proches.",
    classes: [
      {
        name: "Barde - Conteur de Village",
        description:
          "Un barde halfelin qui tisse des histoires captivantes et ensorcelle ses auditeurs.",
        abilities: [
          "Histoire Envoûtante",
          "Récit de Courage",
          "Chants de Sérénité",
        ],
      },
      {
        name: "Clerc - Guide des Champs",
        description:
          "Clerc halfelin dévoué aux esprits de la terre et des récoltes, offrant protection et abondance.",
        abilities: [
          "Bénédiction des Moissons",
          "Sérénité Terrestre",
          "Mur de Blé",
        ],
      },
      {
        name: "Magicien - Trickster des Rues",
        description:
          "Magicien de rue, utilisant des tours de passe-passe et des sorts astucieux pour distraire et tromper.",
        abilities: [
          "Sort de Diversion",
          "Illusion Mineure",
          "Changement Mineur d'Apparence",
        ],
      },
      {
        name: "Guerrier - Protecteur des Jardins",
        description:
          "Guerrier halfelin au grand cœur qui protège les siens et se bat pour la paix de son village.",
        abilities: [
          "Force des Racines",
          "Charge Compacte",
          "Détermination Protectrice",
        ],
      },
      {
        name: "Roublard - Filou du Quartier",
        description:
          "Roublard discret qui sait se faufiler partout et connaît les secrets des ruelles.",
        abilities: ["Pas Silencieux", "Dextérité Agile", "Discrétion Absolue"],
      },
    ],
  },
  {
    name: "Humain",
    description:
      "Les humains sont la race la plus polyvalente et la plus répandue dans le monde. Leur adaptabilité et leur ambition leur permettent de s'épanouir dans presque tous les environnements et de réaliser de grandes choses. Les humains sont connus pour leur détermination, leur créativité et leur capacité à surmonter les obstacles. Ils forment des sociétés complexes et diversifiées, allant des royaumes prospères aux cités-états indépendantes. Les humains sont également des explorateurs et des aventuriers, toujours en quête de nouvelles connaissances et de nouvelles terres à découvrir. Leur diversité culturelle et leurs talents variés en font des alliés précieux et des adversaires redoutables.",
    classes: [
      {
        name: "Barde - Troubadour des Royaumes",
        description:
          "Barde charismatique qui traverse les royaumes en chantant des histoires et en inspirant les foules.",
        abilities: ["Charisme Captivant", "Chanson de Force", "Poème de Paix"],
      },
      {
        name: "Clerc - Émissaire des Cieux",
        description:
          "Clerc humain consacré aux dieux protecteurs, prodiguant des bénédictions divines et des soins miraculeux.",
        abilities: [
          "Lumière Divine",
          "Guérison Sacrée",
          "Protection Spirituelle",
        ],
      },
      {
        name: "Magicien - Archimage",
        description:
          "Maître de plusieurs écoles de magie, dévoué à l'étude des arcanes pour découvrir les secrets de l'univers.",
        abilities: [
          "Connaissance Universelle",
          "Invocation de Sorts Puissants",
          "Manipulation de l'Énergie",
        ],
      },
      {
        name: "Guerrier - Champion de Bataille",
        description:
          "Guerrier d'exception, réputé pour ses exploits militaires et son courage au combat.",
        abilities: [
          "Maîtrise des Armes",
          "Résistance Acharnée",
          "Charge Puissante",
        ],
      },
      {
        name: "Roublard - Maître Espion",
        description:
          "Roublard humain expert en infiltration, manipulation, et acquisition d'informations confidentielles.",
        abilities: [
          "Espionnage Subtil",
          "Déguisement Parfait",
          "Manipulation Psychologique",
        ],
      },
    ],
  },
  {
    name: "Nain",
    description:
      "Les nains sont des êtres robustes et solides, réputés pour leur passion pour l'artisanat et la bataille. Ils vivent principalement dans des forteresses souterraines, creusées dans les montagnes, où ils exploitent les richesses minérales et forgent des armes et des armures de qualité exceptionnelle. Les nains sont des guerriers redoutables, dotés d'une grande résilience et d'une force physique impressionnante. Leur culture est marquée par un profond respect pour les ancêtres et les traditions, et ils vénèrent des divinités liées à la terre et au feu. Les nains sont également des buveurs et des fêtards, appréciant les festins et les récits épiques de leurs exploits passés.",
    classes: [
      {
        name: "Barde - Chanteur des Cavernes",
        description:
          "Barde nain qui chante dans les profondeurs, faisant résonner sa voix dans les cavernes et ravivant le courage de ses alliés.",
        abilities: [
          "Écho de la Montagne",
          "Chanson de Courage",
          "Récit Ancestral",
        ],
      },
      {
        name: "Clerc - Gardien des Ancêtres",
        description:
          "Clerc qui invoque les esprits des ancêtres nains pour guider et protéger son clan.",
        abilities: [
          "Invocation des Ancêtres",
          "Protection Spirituelle",
          "Bénédiction d'Endurance",
        ],
      },
      {
        name: "Magicien - Forgeron des Runes",
        description:
          "Magicien spécialisé dans les runes magiques, gravant des enchantements dans les armes et armures.",
        abilities: [
          "Gravure Runique",
          "Armure de Runes",
          "Invocation de Runes de Feu",
        ],
      },
      {
        name: "Guerrier - Défenseur des Halls",
        description:
          "Guerrier robuste, formé pour défendre les halls ancestraux de ses ancêtres contre toute menace.",
        abilities: [
          "Mur de Boucliers",
          "Résistance Inébranlable",
          "Force de Roc",
        ],
      },
      {
        name: "Roublard - Sapeur de Forteresse",
        description:
          "Roublard expert en sabotage et en intrusion dans les tunnels et forteresses souterraines.",
        abilities: [
          "Sabotage des Mécanismes",
          "Connaissance des Tunnels",
          "Expertise en Démolition",
        ],
      },
    ],
  },
];
