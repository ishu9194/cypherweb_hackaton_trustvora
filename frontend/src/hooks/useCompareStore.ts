import { useSyncExternalStore } from "react";

const STORAGE_KEY = "trustix_compare_lawyers";
const MAX_COMPARE = 3;
const listeners = new Set<() => void>();

function readInitial(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

let compareList = readInitial();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
  } catch {
    // ignore storage failures
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return compareList;
}

/** Shared compare-list store, capped at MAX_COMPARE lawyers. */
export function useCompareStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);

  return {
    compareList: snapshot,
    isCompared: (id: string) => snapshot.includes(id),
    isFull: snapshot.length >= MAX_COMPARE,
    toggleCompare: (id: string) => {
      compareList = snapshot.includes(id) ? snapshot.filter((item) => item !== id) : [...snapshot, id].slice(0, MAX_COMPARE);
      persist();
    },
    clearCompare: () => {
      compareList = [];
      persist();
    },
  };
}
