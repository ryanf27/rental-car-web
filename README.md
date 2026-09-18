# Noir Motor Club

A cinematic luxury rental car portfolio built with React, TypeScript, Vite, and Tailwind CSS. The public showroom uses local optimized imagery; the live inventory, account, reservation, and booking history routes use Supabase.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set your Supabase project URL and publishable key. Apply the migrations in `supabase/migrations` to a new project before using the reservation flow.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

The checkout screen is a demonstration flow and does not charge a payment method. Connect a payment provider and server-side confirmation before accepting real reservations.
