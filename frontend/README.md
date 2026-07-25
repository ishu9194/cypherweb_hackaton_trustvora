# Trustix — Phase 1: Foundation + Public Landing Page

## Run it

```bash
unzip trustix-phase1-foundation.zip
cd trustix
npm install
npm run dev
```

Open the printed `localhost` URL. Visit `/style-guide` to see every component in
the design system in one place.

```bash
npm run build   # production build, verified working — code-split into
                 # per-route + per-vendor chunks, largest chunk 220 kB / 71 kB gzip
```

## What's in this build

- **Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, React
  Router, Radix UI primitives, React Hook Form + Zod, react-hot-toast, Recharts.
- **Design system** (`src/components/ui`): ~30 components — Button, Input,
  Select, Modal, Drawer, Tabs, Accordion, DataGrid, Calendar, Timeline, Toaster,
  Skeleton, and more — all built on the Royal Blue / Deep Navy / Emerald theme
  with light + dark mode.
- **Architecture**: layouts (Main/Auth/Dashboard), route guards
  (Protected/Public), context providers (Theme/Auth), a mock-backed API service
  layer (`src/services/api`) that's one flag away from a real backend, typed
  dummy data (`src/data`), and reusable hooks.
- **Public homepage** (`src/pages/HomePage.tsx`): Hero, Search, Statistics,
  Practice Areas, Services, Why Choose Us, How It Works, Featured Lawyers,
  Success Stories, Testimonials, FAQ, Blog Preview, Newsletter, Contact, CTA
  Banner — all live components with working forms, toasts, and animations, not
  static mockups.
- **System pages**: 404, 403, 500, Maintenance, and Coming Soon (used for
  routes reserved for later phases — Find Lawyers, Practice Areas directory,
  Pricing, Blog, About, lawyer profile pages).
- Login/Register/Forgot Password and a starter Client Dashboard exist and are
  route-guarded, ready to be built out in Phase 4.

## Verified

- `tsc -b --noEmit` — clean, zero errors
- `npm run build` — succeeds, code-split per route and per major vendor lib
- `npm run dev` — boots cleanly, all entry modules transform without error

## Next phases (not in this build)

- Phase 3: Find Lawyers search/filter page, full Practice Areas directory,
  Pricing, Blog, About, Lawyer Profile pages
- Phase 4: full Client Dashboard (appointments, cases, documents, messages,
  payments)
- Phase 5: Lawyer Dashboard + Admin Panel
