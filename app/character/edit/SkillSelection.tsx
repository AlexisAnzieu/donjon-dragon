import { useCharacter } from "./characterContext";

export default function SkillSelection() {
  const { selectedClass, selectedSkills, background, handleSkillChange } =
    useCharacter();

  const isSkillSelected = (skill: string) =>
    selectedSkills.includes(skill) || background?.skills.includes(skill);

  const isSkillDisabled = (skill: string) =>
    background?.skills.includes(skill) ||
    (!selectedSkills.includes(skill) &&
      selectedSkills.length >= (selectedClass?.skills?.canSelect || 0));

  const getSkillCardClassName = (skill: string) => {
    const baseClasses =
      "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105";
    const selectableClass = isSkillSelected(skill) ? "ring-2 ring-primary" : "";
    const disabledClass = isSkillDisabled(skill)
      ? "opacity-50 cursor-not-allowed"
      : "";
    const cursorClass = background?.skills.includes(skill)
      ? "cursor-not-allowed"
      : "cursor-pointer";

    return `${baseClasses} ${selectableClass}  ${cursorClass} ${disabledClass}`;
  };

  const canSelectMoreSkills = () =>
    selectedSkills.length < (selectedClass?.skills?.canSelect || 0);

  const handleSkillToggle = (skill: string) => {
    if (background?.skills.includes(skill)) return;

    const isCurrentlySelected = selectedSkills.includes(skill);
    if (!isCurrentlySelected && !canSelectMoreSkills()) return;

    const updatedSkills = isCurrentlySelected
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    handleSkillChange(updatedSkills);
  };

  return (
    <>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 max-w-4xl mx-auto">
        <div className="flex items-center">
          <div className="text-sm text-blue-700">
            Choisis {selectedClass?.skills.canSelect} compétences qui définiront
            les domaines dans lesquels ton personnage excelle. Certaines sont
            déjà cochés car ils sont déjà inclus dans ton historique.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-4">
        {selectedClass?.skills.choices.map((skill) => (
          <div
            key={skill}
            className={getSkillCardClassName(skill)}
            onClick={() =>
              !background?.skills.includes(skill) && handleSkillToggle(skill)
            }
          >
            <div className="p-4 flex-grow flex flex-col">
              <h2 className="text-lg font-bold text-primary mb-2">
                {skill}
                {background?.skills.includes(skill) && ` (${background.name})`}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
