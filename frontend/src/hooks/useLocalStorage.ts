import { useEffect, useState } from "react";

/**
 * useState that persists to localStorage under `key`. Falls back silently
 * if storage is unavailable (private browsing, SSR, etc).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable — value still works in-memory for this session
    }
  }, [key, value]);

  return [value, setValue] as const;
}
