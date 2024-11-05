/* eslint-disable @typescript-eslint/no-explicit-any */
import { getEquipments } from "@/lib/dd5";
import EquipmentFilter from "../components/EquipmentFilter";

export default async function Equipments() {
  const equipments = await getEquipments();

  return (
    <div className="gap-4">
      <EquipmentFilter equipments={equipments} />
    </div>
  );
}
