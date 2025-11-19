# MyApp

End-to-end trip planning platform with Expo (React Native) frontend, Node/Express backend, shared TypeScript models, and Docker-based dev environment.

## Structure

- `frontend/` – Expo mobile app with modular features (Explore, Trips, Favorites, People) and React Navigation tabs.
- `backend/` – Express API skeleton with health and role endpoints, Jest tests, and ESLint.
- `packages/shared/` – Shared Zod schemas/types consumed by both frontend and backend.
- `docker/` – Dockerfiles for frontend/back containers. `docker-compose.yml` wires everything with Postgres.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (for containerized dev)
- Expo Go app or iOS/Android simulators for testing.

## Scripts

At repo root:

- `npm run dev` – orchestrated dev tasks via Turbo (run after configuring turborepo tasks per package).
- `npm run lint` – run ESLint across workspaces.
- `npm run test` – run Jest suites.

### Frontend

```
cd frontend
npm run start        # expo dev server with hot reload
npm run test         # jest-expo suite
npm run lint         # expo lint
```

### Backend

```
cd backend
npm run dev          # ts-node-dev hot reload server on port 4000
npm run test         # jest + supertest
npm run lint
```

## Docker Dev Env

```
docker-compose up --build
```

This starts:

- `frontend` – Expo bundler (ports 19000/19001/19002) with hot reload via mounted volume.
- `backend` – Express API (port 4000) running ts-node-dev.
- `db` – Postgres 16 with persistent volume `db_data`.

Set environment variables in a `.env` file (see inline defaults from `docker-compose.yml`).

## Testing

- Frontend component tests with React Native Testing Library (`frontend/src/features/**/__tests__`).
- Backend API tests with Jest + Supertest (`backend/tests`).

## Next Steps

- Flesh out domain models (Trips, Places, Memberships) in `packages/shared`.
- Connect backend to Postgres (Prisma or Drizzle recommended).
- Wire frontend networking to backend via TanStack Query.
- Add CI (GitHub Actions) to lint/test/compose services automatically.