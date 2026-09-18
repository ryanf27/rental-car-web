# Noir Motor Club

A cinematic rental-car portfolio built with React, TypeScript, Vite, and CSS. The six-car fleet is editable in `src/data/fleet.ts`; inquiries are stored in a small libSQL database. This is a demonstration site: it does not take payments or guarantee vehicle availability.

## Local development

```bash
npm install
npm run dev
```

Local development uses `data/noir.db` automatically. The database and `inquiries` table are created on the first request. To use Turso locally, copy `.env.example` to `.env` and set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`. Never prefix these server credentials with `VITE_`.

## Deploy to Vercel

Import the repository as a Vite project. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in the Vercel project environment. The `/api/inquiries` function creates the schema when first called and writes validated inquiries. The fleet is maintained in source control and needs no database seed command. Static route rewrites are in `vercel.json`.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
