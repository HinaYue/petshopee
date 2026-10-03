# Pet Shop / Veterinary Clinic — Vercel + Supabase

This is the separate online version of the XAMPP/PHP project.

## Before deploying
The Supabase schema from the previous step must already be installed.

## Environment variables
Copy `.env.example` to `.env.local` for local testing. Never commit `.env.local`.

Required:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase Project URL
- `SUPABASE_SERVICE_ROLE_KEY` — server-only Supabase service role key
- `SESSION_SECRET` — a long random secret

The service-role key is used only in Next.js server code. Never rename it with `NEXT_PUBLIC_`.

## First login
With an empty `users` table, visit `/setup`. Create the first Administrator. After that, `/setup` redirects to `/login`.

## Deploy
1. Upload this folder to a GitHub repository.
2. Import that repository in Vercel.
3. Add all 3 environment variables in Vercel Project Settings -> Environment Variables.
4. Deploy.
5. Open `/setup` once to create the first administrator.

## Included online features
Dashboard with date range, owners, pets, confinement/discharge, products, categories, suppliers, inventory adjustment/history writes, Sales/POS, product stock deduction, service sales, transaction history, receipts, date-range reports, administrator account creation, and staff/admin navigation.
