import React from "react";
import { Class, classes } from "@/app/character-build/races";

interface EquipmentComponentProps {
  selectedClass: Class | null;
  selectedEquipment: string[] | null;
  setSelectedEquipment: (equipment: string[] | null) => void;
}

interface EquipmentChoiceProps {
  choices: string[];
  choiceIndex: number;
  selectedItem: string | undefined;
  onSelect: (choiceIndex: number, item: string) => void;
}

const EquipmentChoice: React.FC<EquipmentChoiceProps> = ({
  choices,
  choiceIndex,
  selectedItem,
  onSelect,
}) => (
  <div className="transform hover:scale-[1.01] transition-all duration-300">
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-all">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Lot nº{choiceIndex + 1}
      </h3>
      <div className="space-y-2">
        {choices.map((item, itemIndex) => (
          <div
            key={itemIndex}
            onClick={() => onSelect(choiceIndex, item)}
            className={`p-3 rounded-lg transition-all duration-200 cursor-pointer
              ${
                selectedItem === item
                  ? "bg-blue-50 border-l-4 border-blue-400"
                  : "bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50"
              }`}
          >
            <p
              className={`font-medium ${
                selectedItem === item ? "text-blue-700" : "text-slate-600"
              }`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EquipmentSelection: React.FC<EquipmentComponentProps> = ({
  selectedClass,
  selectedEquipment,
  setSelectedEquipment,
}) => {
  const equipmentData = classes.find(
    (c) => c.name === selectedClass?.name
  )?.equipment;

  const defaultEquipment = React.useMemo(
    () => equipmentData?.filter((e) => e.length === 1).map((e) => e[0]) ?? [],
    [equipmentData]
  );

  React.useEffect(() => {
    if (defaultEquipment && !selectedEquipment) {
      setSelectedEquipment(defaultEquipment);
    }
  }, [setSelectedEquipment, defaultEquipment, selectedEquipment]);

  const handleEquipmentSelection = (
    choiceIndex: number,
    selectedItem: string
  ) => {
    const newEquipment = [...(selectedEquipment || [])];
    newEquipment[choiceIndex + defaultEquipment.length] = selectedItem;
    setSelectedEquipment(newEquipment);
  };

  return (
    <div className="overflow-hidden h-full p-8">
      <div className="space-y-8 max-w-6xl mx-auto">
        {!!defaultEquipment.length && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800">
              Équipement par défaut de classe
            </h3>

            <div className="flex pt-5 gap-5">
              {defaultEquipment.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg transition-all duration-200  bg-slate-50 border border-slate-200 "
                >
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipmentData?.map((choices, choiceIndex) =>
            choices.length > 1 ? (
              <EquipmentChoice
                key={choiceIndex}
                choices={choices}
                choiceIndex={choiceIndex}
                selectedItem={
                  selectedEquipment?.[choiceIndex + defaultEquipment.length]
                }
                onSelect={handleEquipmentSelection}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentSelection;
