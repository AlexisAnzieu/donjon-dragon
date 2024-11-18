import { Spell, spells } from "./races";
import { useCharacter } from "./characterContext";

export default function SpellSelection() {
  const { selectedClass, selectedSpells, handleSpellChange } = useCharacter();

  if (!selectedClass?.cantrips) return null;

  const availableSpells = spells[selectedClass.name] || [];

  const isSpellSelected = (spell: Spell) =>
    selectedSpells.some((s) => s.name === spell.name);

  const canSelectMoreSpells = () =>
    selectedSpells.length < (selectedClass?.cantrips?.canSelect || 0);

  const isSpellDisabled = (spell: Spell) =>
    !isSpellSelected(spell) && !canSelectMoreSpells();

  const getSpellCardClassName = (spell: Spell) => {
    const baseClasses =
      "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 p-2";
    const selectableClass = isSpellSelected(spell) ? "ring-2 ring-primary" : "";
    const disabledClass = isSpellDisabled(spell)
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";

    return `${baseClasses} ${selectableClass} ${disabledClass}`;
  };

  const handleSpellToggle = (spell: Spell) => {
    if (isSpellDisabled(spell)) return;
    handleSpellChange(spell);
  };

  return (
    <>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 max-w-4xl mx-auto">
        <div className="flex items-center">
          <div className="text-sm text-blue-700">
            En tant que {selectedClass.name}, tu peux choisir{" "}
            {selectedClass.cantrips.canSelect} sorts mineurs.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-4">
        {availableSpells.map((spell) => (
          <div
            key={spell.name}
            onClick={() => handleSpellToggle(spell)}
            className={getSpellCardClassName(spell)}
          >
            <h3 className="text-lg font-semibold mb-2">{spell.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{spell.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Durée: {spell.duration}</span>
                <span>Portée: {spell.portée}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
