import { createStorageContext } from "./createContext";
import { Light } from "../components/LightControlModal";
import { useState, useEffect } from "react";
import { getSettings, LumiaLight } from "../../../lib/lumia";

export const LIGHT_PRESETS_KEY = "lightPresets";

export const {
  Provider: LightPresetsProvider,
  useStorageContext: useLightPresetsStorage,
} = createStorageContext<Light[]>({
  key: LIGHT_PRESETS_KEY,
  defaultValue: [],
  maxItems: 9,
});

export function useLightPresets() {
  const { data: lightPresets, setData: setLightPresets } =
    useLightPresetsStorage();
  const [isLumiaAvailable, setIsLumiaAvailable] = useState<LumiaLight[] | null>(
    null
  );

  useEffect(() => {
    checkLumiaAvailability();
  }, []);

  const checkLumiaAvailability = async () => {
    const res = await getSettings();
    setIsLumiaAvailable(res?.data?.lights || null);
  };

  const saveLightPresetsToDb = async (lights: Light[]) => {
    try {
      await fetch("/api/settings/lightPresets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: lights }),
      });
    } catch (error) {
      console.error("Error saving light presets:", error);
    }
  };

  const loadLightPresetsFromDb = async () => {
    try {
      const response = await fetch("/api/settings/lightPresets");
      if (response.ok) {
        const data = await response.json();
        setLightPresets(data.value || []);
      }
    } catch (error) {
      console.error("Error loading light presets:", error);
    }
  };

  const updateLightPresets = async (lights: Light[]) => {
    setLightPresets(lights);
    await saveLightPresetsToDb(lights);
  };

  return {
    lightPresets,
    loadLightPresets: loadLightPresetsFromDb,
    updateLightPresets,
    isLumiaAvailable,
  };
}
