# Trustix

Trustix is a full-stack application made up of two projects:

- **`backend/`** – A Fastify + TypeScript API using Prisma/PostgreSQL for user profiles, verification claims, and a trust-scoring engine.
- **`frontend/`** – A React + TypeScript + Vite single-page app (Trustix) for browsing lawyers, bookings, dashboards, and auth flows.

## Project Structure

```
trustix/
├── backend/          # Fastify API server
│   ├── prisma/        # Prisma schema
│   ├── src/
│   │   ├── app.ts         # Server entry point
│   │   ├── routes/        # API route handlers
│   │   ├── schemas/       # Zod request validation schemas
│   │   ├── services/      # Business logic (e.g. trust engine)
│   │   └── lib/           # Shared utilities (Prisma client, etc.)
│   ├── .env.example
│   └── package.json
│
├── frontend/         # React + Vite client
│   ├── src/
│   │   ├── components/    # UI, auth, booking, lawyer, layout components
│   │   ├── pages/          # Route-level pages
│   │   ├── layouts/        # Page layouts (Auth, Main, Dashboard)
│   │   ├── context/        # React context (Auth, Theme)
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API client layer
│   │   ├── data/           # Static/mock data
│   │   └── lib/            # Utilities
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18+
- npm
- A PostgreSQL database (e.g. [Supabase](https://supabase.com))

## Getting Started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in DATABASE_URL and JWT_SECRET
npm run db:generate    # generate Prisma client
npm run db:push        # push schema to your database
npm run dev             # start the dev server (default: http://localhost:3000)
```

**Backend scripts**

| Script | Description |
|---|---|
| `npm run dev` | Start the API in watch mode |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run lint` | Lint with oxlint |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:studio` | Open Prisma Studio |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev   # start the Vite dev server (default: http://localhost:5173)
```

**Frontend scripts**

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint with oxlint |

## Environment Variables

Backend (`backend/.env`, based on `.env.example`):

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `PORT` | Port the API listens on (default `3000`) |

> ⚠️ Never commit `.env` files. `.env` is already listed in `.gitignore`.

## Notes

- The backend exposes a health check at `GET /health` and all API routes under `/api`.
- Prisma's generated client output is git-ignored; run `npm run db:generate` after installing dependencies.
