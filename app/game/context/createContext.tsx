import {
  createContext as createReactContext,
  useContext,
  ReactNode,
  useState,
} from "react";

export interface StorageOptions<T> {
  key: string;
  defaultValue: T;
  maxItems?: number;
  onUpdate?: (value: T) => void;
}

export function createStorageContext<T>({
  key,
  defaultValue,
  maxItems,
  onUpdate,
}: StorageOptions<T>) {
  type ContextValue = {
    data: T;
    setData: (value: T | ((prev: T) => T)) => void;
  };

  const Context = createReactContext<ContextValue | undefined>(undefined);

  function Provider({ children }: { children: ReactNode }) {
    const [data, setDataInternal] = useState<T>(defaultValue);

    const setData = (valueOrUpdater: T | ((prev: T) => T)) => {
      setDataInternal((prev) => {
        const newValue =
          typeof valueOrUpdater === "function"
            ? (valueOrUpdater as (prev: T) => T)(prev)
            : valueOrUpdater;

        const finalValue =
          Array.isArray(newValue) && maxItems
            ? (newValue.slice(0, maxItems) as T)
            : newValue;

        onUpdate?.(finalValue);
        return finalValue;
      });
    };

    return (
      <Context.Provider value={{ data, setData }}>{children}</Context.Provider>
    );
  }

  function useStorageContext() {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`use${key} must be used within a ${key}Provider`);
    }
    return context;
  }

  return { Provider, useStorageContext };
}
