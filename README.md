# Trackix

AI-flavored expense and budget tracking with a separate Express API and Next.js client.

## Prerequisites

- Node.js 20+
- MongoDB running locally (or set `MONGODB_URI`)

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API listens on `http://localhost:5000`. The first boot ensures an admin user when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `.env`.

## Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

App runs at `http://localhost:3000`. Point `NEXT_PUBLIC_API_URL` at the API (`http://localhost:5000/api`).

## Defaults

- Register a standard user from `/register`, or sign in as the configured admin to open `/admin`.

## Structure

- `backend` — Express, Mongoose, JWT access + refresh, role-based admin routes.
- `frontend` — Next.js App Router, Tailwind, Framer Motion, Recharts, layered animated backdrop.
