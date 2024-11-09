"use client";

const BACKGROUNDS = {
  Acolyte: {
    skills: ["Religion", "Intuition"],
    languages: 2,
    equipment: ["Symbole sacré", "Livre de prières", "5 bâtons d'encens"],
  },
  Criminel: {
    skills: ["Discrétion", "Tromperie"],
    tools: ["Outils de voleur", "Jeu au choix"],
    equipment: ["Pied de biche", "Vêtements sombres avec capuche"],
  },
  Noble: {
    skills: ["Histoire", "Persuasion"],
    languages: 1,
    equipment: ["Habits de qualité", "Chevalière", "Lettre de noblesse"],
  },
  Soldat: {
    skills: ["Athlétisme", "Intimidation"],
    tools: ["Véhicules terrestres", "Jeu au choix"],
    equipment: ["Insigne du grade", "Trophée pris sur un ennemi"],
  },
};

type BackgroundSelectionProps = {
  selectedBackground: string | null;
  onBackgroundChange: (background: string | null) => void;
};

export default function BackgroundSelection({
  selectedBackground,
  onBackgroundChange,
}: BackgroundSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(BACKGROUNDS).map(([name]) => (
          <div
            key={name}
            onClick={() => onBackgroundChange(name)}
            className={`p-4 rounded-lg cursor-pointer border-2 ${
              selectedBackground === name
                ? "border-primary bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <h3 className="font-bold text-lg mb-2">{name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
