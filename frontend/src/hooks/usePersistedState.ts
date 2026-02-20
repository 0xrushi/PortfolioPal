import { Dispatch, SetStateAction, useEffect, useState } from "react";

type PersistedState<T> = [T, Dispatch<SetStateAction<T>>];

function usePersistedState<T>(defaultValue: T, key: string): PersistedState<T> {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) {
        return defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors (e.g. sandboxed iframes, privacy modes)
    }
  }, [key, value]);

  return [value, setValue];
}

export { usePersistedState };
