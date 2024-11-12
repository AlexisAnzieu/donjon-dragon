"use client";

import { useCharacter } from "./characterContext";

export type Background = {
  name: string;
  tools?: string[];
  skills: string[];
  equipment: string[];
  description: string;
};

const BACKGROUNDS: Background[] = [
  {
    name: "Acolyte",
    tools: ["Langue supplémentaire"],
    skills: ["Religion", "Intuition"],
    equipment: [
      "Symbole sacré",
      "Livre de prières",
      "5 bâtons d'encens",
      "Habit de cérémonie",
      "Bourse de 15 pièces d'or",
    ],
    description:
      "Ayant passé votre vie dans un temple, vous servez de lien entre les dieux et les mortels, menant rites et cérémonies sacrées pour guider les fidèles. Vous bénéficiez du respect des membres de votre foi et pouvez demander assistance dans les temples affiliés, tant que vous respectez leurs règles.",
  },
  {
    name: "Artiste",
    skills: ["Représentation", "Acrobaties"],
    tools: ["Outils de peintre", "Instruments de musique au choix"],
    equipment: [
      "Instrument de musique",
      "Tenue de spectacle",
      "Bourse de 15 pièces d'or",
    ],
    description:
      "Vous avez captivé les foules et attiré le regard de nombreux admirateurs et mécènes. Votre art vous permet de gagner le soutien financier ou moral de ceux qui apprécient votre travail, et de recevoir l’hospitalité dans les cercles artistiques.",
  },
  {
    name: "Criminel",
    skills: ["Discrétion", "Tromperie"],
    tools: ["Outils de voleur", "Jeu au choix"],
    equipment: [
      "Pied de biche",
      "Vêtements sombres avec capuche",
      "Bourse de 15 pièces d'or",
    ],
    description:
      "À travers des activités illicites, vous avez développé des relations étroites dans le monde du crime. Vous pouvez obtenir des informations sur les réseaux criminels locaux et accéder à des ressources pour mener à bien vos activités.",
  },
  {
    name: "Sage",
    tools: ["Langue supplémentaire"],
    skills: ["Arcanes", "Histoire"],
    equipment: [
      "Bouteille d'encre",
      "Plume",
      "Petit couteau",
      "Bourse de 10 pièces d'or",
    ],
    description:
      "Vous avez passé des années à étudier dans des bibliothèques ou des archives. Vous avez un accès privilégié aux sources de connaissances et êtes en mesure de consulter des documents, notamment ceux peu accessibles au grand public.",
  },
  {
    name: "Soldat",
    skills: ["Athlétisme", "Intimidation"],
    tools: ["Véhicules terrestres", "Jeu au choix"],
    equipment: [
      "Insigne de grade",
      "Une dague pris sur un ennemi",
      "Jeu de cartes",
      "Bourse de 10 pièces d'or",
    ],
    description:
      "Vous avez servi dans les rangs d’une armée et avez établi des liens durables avec vos camarades. Vous pouvez compter sur l’aide de soldats alliés pour des informations, du soutien logistique, ou même une assistance en combat.",
  },
];

function BackgroundSelection() {
  const { handleBackgroundChange, background: selectedBackground } =
    useCharacter();

  return (
    <>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 max-w-4xl mx-auto">
        <div className="flex items-center">
          <div className="text-sm text-blue-700">
            {` Ton historique représente ton passé, ce qui a façonné ton personnage
            avant qu'il ne devienne un aventurier. Il te donne accès à des
            compétences, de l'équipement et des maitrises liées à ton
            passé.`}
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-6 max-w-4xl mx-auto mt-4">
        {BACKGROUNDS.map((background) => (
          <div
            key={background.name}
            onClick={() => handleBackgroundChange(background)}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col h-full ${
              selectedBackground?.name === background.name
                ? "ring-2 ring-primary"
                : ""
            }`}
          >
            <div className="p-4 flex-grow flex flex-col">
              <h2 className="text-2xl font-bold text-primary mb-2">
                {background.name}
              </h2>
              <div className="flex-grow">
                <p className="text-gray-600">{background.description}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-100 mt-auto">
              <p className="text-sm text-gray-700">
                <strong>Compétences :</strong> {background.skills.join(", ")}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Équipement :</strong> {background.equipment.join(", ")}
              </p>
              <p className="text-sm text-gray-700">
                {background.tools ? (
                  <>
                    <strong>Maitrise :</strong> {background.tools.join(", ")}
                  </>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BackgroundSelection;
