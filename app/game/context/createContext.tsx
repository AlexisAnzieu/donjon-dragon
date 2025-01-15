import {
  createContext as createReactContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

export interface StorageOptions<T> {
  key: string;
  defaultValue: T;
  maxItems?: number;
  onUpdate?: (value: T) => void;
  validate?: (value: T) => boolean;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export function createStorageContext<T>({
  key,
  defaultValue,
  maxItems,
  onUpdate,
  validate = () => true,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: StorageOptions<T>) {
  type ContextValue = {
    data: T;
    setData: (value: T | ((prev: T) => T)) => void;
  };

  const Context = createReactContext<ContextValue | undefined>(undefined);

  function Provider({ children }: { children: ReactNode }) {
    const [data, setDataInternal] = useState<T>(defaultValue);

    useEffect(() => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = deserialize(stored);
          if (validate(parsed)) {
            setDataInternal(parsed);
          }
        }
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
      }
    }, []);

    const setData = (valueOrUpdater: T | ((prev: T) => T)) => {
      setDataInternal((prev) => {
        const newValue =
          typeof valueOrUpdater === "function"
            ? (valueOrUpdater as (prev: T) => T)(prev)
            : valueOrUpdater;

        // Handle maxItems constraint for array types
        const finalValue =
          Array.isArray(newValue) && maxItems
            ? (newValue.slice(0, maxItems) as T)
            : newValue;

        if (validate(finalValue)) {
          try {
            localStorage.setItem(key, serialize(finalValue));
            onUpdate?.(finalValue);
          } catch (error) {
            console.error(`Error saving ${key} to storage:`, error);
          }
          return finalValue;
        }

        return prev;
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
