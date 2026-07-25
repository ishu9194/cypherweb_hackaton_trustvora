import { useEffect, useState } from "react";
import { BREAKPOINTS } from "@/constants/app.constants";

/** Subscribes to a raw media query string, e.g. "(min-width: 768px)". */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);
    setMatches(mediaQueryList.matches);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/** Convenience hook: true once viewport is at or above a named Tailwind breakpoint. */
export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
}

/** True on small/mobile viewports (below the `md` breakpoint). */
export function useIsMobile(): boolean {
  return !useBreakpoint("md");
}
