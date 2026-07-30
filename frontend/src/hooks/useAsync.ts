import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// Global in-memory cache for Stale-While-Revalidate (SWR) behavior
const asyncCache = new Map<string, { data: any; timestamp: number }>();

export function clearAsyncCache() {
  asyncCache.clear();
}

/** Runs `fn` on mount / whenever `deps` change with SWR caching. Exposes { data, isLoading, error, refetch }. */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = [],
  cacheKey?: string
): UseAsyncState<T> & { refetch: () => void } {
  // Infer cacheKey from fn string representation if not explicitly provided
  const key = cacheKey || fn.toString().replace(/\s+/g, "").slice(0, 150);

  const [state, setState] = useState<UseAsyncState<T>>(() => {
    const cached = asyncCache.get(key);
    if (cached) {
      return { data: cached.data as T, isLoading: false, error: null };
    }
    return { data: null, isLoading: true, error: null };
  });

  const fnRef = useRef(fn);
  fnRef.current = fn;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const cached = asyncCache.get(key);

    // If no cached data, show loading; if cached data exists, revalidate silently
    if (!cached) {
      setState((s) => ({ ...s, isLoading: true, error: null }));
    }

    fnRef.current()
      .then((data) => {
        if (!cancelled) {
          asyncCache.set(key, { data, timestamp: Date.now() });
          setState({ data, isLoading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            isLoading: false,
            error: s.data ? null : (err instanceof Error ? err.message : "Something went wrong"),
          }));
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick, key]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, refetch };
}

export default useAsync;
