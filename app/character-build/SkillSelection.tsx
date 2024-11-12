import { Class } from "./races";
import { useEffect } from "react";

interface SkillSelectionProps {
  selectedClass: Class;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export default function SkillSelection({
  selectedClass,
  selectedSkills,
  onSkillsChange,
}: SkillSelectionProps) {
  useEffect(() => {
    // Reset skills if they exceed the new class's limit
    if (selectedSkills.length > selectedClass.skills.canSelect) {
      onSkillsChange([]);
    }
  }, [selectedClass, selectedSkills.length, onSkillsChange]);

  const handleSkillToggle = (skill: string) => {
    const isSelected = selectedSkills.includes(skill);

    if (isSelected) {
      onSkillsChange(selectedSkills.filter((s) => s !== skill));
    } else if (selectedSkills.length < selectedClass.skills.canSelect) {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  return (
    <>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 max-w-4xl mx-auto">
        <div className="flex items-center">
          <div className="text-sm text-blue-700">
            Choisis {selectedClass.skills.canSelect} compétences qui définiront
            les domaines dans lesquels ton personnage excelle.
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-4">
        {selectedClass.skills.choices.map((skill) => (
          <div
            key={skill}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
              selectedSkills.includes(skill) ? "ring-2 ring-primary" : ""
            } ${
              !selectedSkills.includes(skill) &&
              selectedSkills.length >= selectedClass.skills.canSelect
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => handleSkillToggle(skill)}
          >
            <div className="p-4 flex-grow flex flex-col">
              <h2 className="text-xl font-bold text-primary mb-2">{skill}</h2>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
