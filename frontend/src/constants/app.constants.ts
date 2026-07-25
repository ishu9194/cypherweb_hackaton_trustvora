import { ROUTES } from "./routes.constants";

export const APP_NAME = "Trustix";
export const APP_TAGLINE = "Find Trusted Lawyers. Get Legal Help. Anytime. Anywhere.";

export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: ROUTES.home },
  { label: "Find Lawyers", href: ROUTES.findLawyers },
  { label: "Practice Areas", href: ROUTES.practiceAreas },
  { label: "Services", href: ROUTES.services },
  { label: "Pricing", href: ROUTES.pricing },
  { label: "Blog", href: ROUTES.blog },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
];

/** Keys used for localStorage persistence. Centralized to avoid typos/collisions. */
export const STORAGE_KEYS = {
  theme: "trustix_theme",
  authToken: "trustix_auth_token",
  authUser: "trustix_auth_user",
} as const;

/** Tailwind-aligned breakpoints, kept in sync with the `useMediaQuery` hook. */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
