import { Spell, spells } from "./races";
import { useCharacter } from "./characterContext";

export default function SpellSelection() {
  const { selectedClass, selectedSpells, handleSpellChange } = useCharacter();

  if (!selectedClass?.spellsLimit) return null;

  const availableSpells = spells[selectedClass.name] || [];

  const isSpellSelected = (spell: Spell) =>
    selectedSpells.some((s) => s.name === spell.name);

  const canSelectMoreSpells = () =>
    selectedSpells.length < (selectedClass?.spellsLimit?.minor || 0);

  const isSpellDisabled = (spell: Spell) =>
    !isSpellSelected(spell) && !canSelectMoreSpells();

  const getSpellCardClassName = (spell: Spell) => {
    const baseClasses =
      "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col h-full";
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
            {selectedClass.spellsLimit.minor} sorts mineurs.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-4">
        {availableSpells
          .filter((spell) => spell.level === 0)
          .map((spell) => (
            <div
              key={spell.name}
              onClick={() => handleSpellToggle(spell)}
              className={getSpellCardClassName(spell)}
            >
              <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-xl font-bold text-primary mb-2">
                  {spell.name}
                </h2>
                <div className="flex-grow">
                  <p className="text-gray-600">{spell.description}</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 mt-auto border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-700">
                      Durée:{" "}
                      <span className="text-gray-600">{spell.duration}</span>
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-700">
                      Portée:{" "}
                      <span className="text-gray-600">{spell.portée}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
