"use client";

import { useState } from "react";

export default function Character() {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const races = [
    {
      name: "Elfe",
      description:
        "Êtres gracieux et longévifs avec une profonde connexion à la nature et à la magie. Connus pour leurs sens aiguisés et leur maîtrise de l'arc et de la lame.",
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
        "Petites gens agiles avec un amour pour le confort et un talent pour la discrétion. Leur attitude joyeuse et leur chance les sortent souvent de situations dangereuses.",
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
          abilities: [
            "Pas Silencieux",
            "Dextérité Agile",
            "Discrétion Absolue",
          ],
        },
      ],
    },
    {
      name: "Humain",
      description:
        "Polyvalents et ambitieux, les humains sont la race la plus adaptable et la plus répandue. Leur détermination et leur créativité mènent à de grandes réalisations.",
      classes: [
        {
          name: "Barde - Troubadour des Royaumes",
          description:
            "Barde charismatique qui traverse les royaumes en chantant des histoires et en inspirant les foules.",
          abilities: [
            "Charisme Captivant",
            "Chanson de Force",
            "Poème de Paix",
          ],
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
        "Gens robustes et solides avec une passion pour l'artisanat et la bataille. Leur résilience et leur force en font des alliés et des ennemis redoutables.",
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

  const selectedRaceData = races.find((race) => race.name === selectedRace);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Choisis ta race
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {races.map((race) => (
          <div
            key={race.name}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
              selectedRace === race.name ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => {
              setSelectedRace(race.name);
              setSelectedClass(null);
            }}
          >
            <div className="p-4">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {race.name}
              </h2>
              <div className="h-32 overflow-y-auto">
                <p className="text-gray-600">{race.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedRace && (
        <>
          <h2 className="text-2xl font-bold mt-6 text-center text-primary">
            Choisis ta classe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-4">
            {selectedRaceData?.classes.map((cls) => (
              <div
                key={cls.name}
                className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  selectedClass === cls.name ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedClass(cls.name)}
              >
                <div className="p-4">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {cls.name}
                  </h3>
                  <div className="h-32 overflow-y-auto">
                    <p className="text-gray-600">{cls.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {selectedClass && (
        <p className="mt-6 text-center text-xl">
          Tu es un{" "}
          <span className="text-primary font-bold">
            {selectedRace} {selectedClass}
          </span>
        </p>
      )}
    </div>
  );
}
