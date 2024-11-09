"use client";

const CLASS_EQUIPMENT: Record<ClassType, ClassEquipment> = {
  Guerrier: {
    weapons: ["Épée longue", "Hache de bataille", "Lance et bouclier"],
    armor: ["Cotte de mailles", "Armure de cuir"],
    packs: ["Pack d'exploration", "Pack d'aventurier"],
  },
  Rôdeur: {
    weapons: ["Arc long", "Épées courtes (2)", "Épée longue"],
    armor: ["Armure de cuir", "Armure d'écailles"],
    packs: ["Pack d'exploration", "Pack de survie"],
  },
  Magicien: {
    weapons: ["Dague", "Bâton", "Arbalète légère"],
    equipment: ["Focaliseur arcanique", "Grimoire"],
    packs: ["Pack d'érudit", "Pack d'explorateur"],
  },
  Clerc: {
    weapons: ["Masse", "Marteau de guerre", "Arbalète légère"],
    armor: ["Cotte de mailles", "Armure d'écailles"],
    equipment: ["Symbole sacré", "Bouclier"],
    packs: ["Pack de prêtre", "Pack d'explorateur"],
  },
};

type ClassType = "Guerrier" | "Rôdeur" | "Magicien" | "Clerc";

type ClassEquipment = {
  weapons: string[];
  armor?: string[];
  equipment?: string[];
  packs: string[];
};

type EquipmentSelectionProps = {
  selectedClass: ClassType | null;
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
};

export default function EquipmentSelection({
  selectedClass,
  selectedEquipment,
  onEquipmentChange,
}: EquipmentSelectionProps) {
  if (!selectedClass || !CLASS_EQUIPMENT[selectedClass]) return null;

  const toggleEquipment = (item: string) => {
    if (selectedEquipment.includes(item)) {
      onEquipmentChange(selectedEquipment.filter((e) => e !== item));
    } else {
      onEquipmentChange([...selectedEquipment, item]);
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(CLASS_EQUIPMENT[selectedClass]).map(
        ([category, items]) => (
          <div key={category} className="space-y-2">
            <h3 className="font-bold capitalize">{category}</h3>
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleEquipment(item)}
                  className={`p-2 rounded ${
                    selectedEquipment.includes(item)
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
