import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  discoverWLEDDevices,
  WLEDDevice,
  sendColorCommand,
  getHealthColor,
} from "../../../lib/wled";
import { Token } from "@prisma/client";
import { groupBy } from "lodash";

interface WLEDContextType {
  devices: WLEDDevice[];
  isDiscovering: boolean;
  rediscoverDevices: () => Promise<void>;
  updateEnemyHealth: (tokens: Token[]) => void;
}

const WLEDContext = createContext<WLEDContextType | null>(null);

export function WLEDProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<WLEDDevice[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);

  const discoverDevices = async () => {
    setIsDiscovering(true);
    try {
      const discovered = await discoverWLEDDevices();
      setDevices(discovered);
    } catch (error) {
      console.error("Error discovering WLED devices:", error);
    } finally {
      setIsDiscovering(false);
    }
  };

  useEffect(() => {
    discoverDevices();
  }, []);

  const updateEnemyHealth = async (tokens: Token[]) => {
    if (devices.length === 0) return;

    // Only consider enemy tokens and group by type
    const tokensByType = groupBy(
      tokens.filter((token) => token.type === "enemies"),
      "type"
    );

    // Get the first enemy token to determine color
    const enemyTokens = tokensByType["enemies"] || [];
    if (enemyTokens.length === 0) return;

    const firstEnemy = enemyTokens[0];
    if (!firstEnemy.hitPoint || !firstEnemy.maxHitPoint) return;

    const color = getHealthColor(firstEnemy.hitPoint, firstEnemy.maxHitPoint);
    const healthPercentage =
      (firstEnemy.hitPoint / firstEnemy.maxHitPoint) * 100;

    // Update all connected WLED devices with the color and fill percentage
    await Promise.all(
      devices.map((device) => sendColorCommand(device, color, healthPercentage))
    );
  };

  return (
    <WLEDContext.Provider
      value={{
        devices,
        isDiscovering,
        rediscoverDevices: discoverDevices,
        updateEnemyHealth,
      }}
    >
      {children}
    </WLEDContext.Provider>
  );
}

export function useWLED() {
  const context = useContext(WLEDContext);
  if (!context) {
    throw new Error("useWLED must be used within a WLEDProvider");
  }
  return context;
}
