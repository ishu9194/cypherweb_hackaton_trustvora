import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/** Runs `fn` on mount / whenever `deps` change. Exposes { data, isLoading, error, refetch }. */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = []
): UseAsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    fnRef.current()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Something went wrong",
          });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, refetch };
}

export default useAsync;
