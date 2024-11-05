import React from "react";

interface EquipmentData {
  name: string;
  tool_category: string;
  equipment_category: {
    name: string;
  };
  cost: {
    quantity: number;
    unit: string;
  };
  weight: number;
  desc: string[];
}

interface EquipmentComponentProps {
  equipmentData: EquipmentData;
}

const EquipmentComponent: React.FC<EquipmentComponentProps> = ({
  equipmentData,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 flex-grow">
        <h1 className="text-2xl font-bold text-gray-800">
          {equipmentData.name}
        </h1>
        <p className="text-gray-600">{equipmentData.tool_category}</p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">Details</h2>
          <p className="text-gray-600">
            Category: {equipmentData.equipment_category.name}
          </p>
          <p className="text-gray-600">
            Cost: {equipmentData.cost.quantity} {equipmentData.cost.unit}
          </p>
          <p className="text-gray-600">Weight: {equipmentData.weight} lbs</p>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">Description</h2>
          {equipmentData.desc.map((description, index) => (
            <p key={index} className="text-gray-600">
              {description}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquipmentComponent;
