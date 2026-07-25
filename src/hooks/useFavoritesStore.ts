import { useSyncExternalStore } from "react";

const STORAGE_KEY = "trustora_favorite_lawyers";
const listeners = new Set<() => void>();

function readInitial(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

let favorites = readInitial();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  } catch {
    // ignore storage failures (private browsing etc.)
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return favorites;
}

/** Shared favorites set — any component using this hook stays in sync automatically. */
export function useFavoritesStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);

  return {
    favorites: snapshot,
    isFavorited: (id: string) => snapshot.has(id),
    toggleFavorite: (id: string) => {
      const next = new Set(favorites);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      favorites = next;
      persist();
    },
  };
}
