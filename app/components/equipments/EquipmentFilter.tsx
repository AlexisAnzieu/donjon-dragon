"use client";

import React, { useState } from "react";

interface Equipment {
  id: number;
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

interface EquipmentFilterProps {
  equipments: Equipment[];
}

const EquipmentFilter: React.FC<EquipmentFilterProps> = ({ equipments }) => {
  const [filter, setFilter] = useState("");

  const filteredEquipments = equipments.filter((equipment) =>
    equipment.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Filter equipments"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
        {filteredEquipments.map((equipment) => (
          <div key={equipment.id} className="mb-4 p-4   ">
            {/* <EquipmentComponent equipmentData={equipment} /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentFilter;
