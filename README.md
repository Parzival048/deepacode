# deepacode

Smart Multi-Cloud Recommendation & Cost Optimization Platform

A production-grade SaaS platform where businesses enter infrastructure requirements and receive intelligent recommendations for **AWS, Azure, and GCP**—including recommended services, cost estimation, and a cloud adoption roadmap.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v3**
- **Supabase** (PostgreSQL, Auth, RLS)
- **React Hook Form** + **Zod**
- **Recharts** (ready for analytics)
- **Stripe** (payment integration ready)

## Getting started

### 1. Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key  
- `NEXT_PUBLIC_APP_URL` – App URL (e.g. `http://localhost:3000`)  
- Optional: Stripe keys for payments

### 2. Database

The Supabase project already has the cloud platform schema applied (requirements, recommendations, cloud_services, cases, payments, analytics_events, RLS). To seed the cloud services knowledge base, run the SQL in `supabase/seed_cloud_services.sql` in the Supabase SQL editor.

If you use a **new** Supabase project, create a `profiles` table that extends `auth.users` (id, name, phone, role) and add a trigger to insert a row into `profiles` on `auth.users` insert so new signups get a profile with `role = 'user'`.

### 3. Create users (optional)

- **Admin:** `node --env-file=.env.local scripts/create-admin.mjs`
- **Enterprise plan user:** `node --env-file=.env.local scripts/create-enterprise-user.mjs` — creates a user with `subscription_plan: enterprise` and a succeeded payment record; report page shows Full architecture design, Migration plan, and Priority support sections.

### 4. Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Core modules

| Module | Description |
|--------|-------------|
| **Auth** | Supabase Auth, role-based access (user / admin), session middleware |
| **Requirement collection** | Prompt input + guided questionnaire, saved to DB |
| **Cloud knowledge base** | Tables for AWS/Azure/GCP services (see `cloud_services`) |
| **Recommendation engine** | Analyzes requirements, suggests provider, services, cost, roadmap |
| **Cost estimation** | Monthly cost breakdown per service |
| **Adoption roadmap** | Step-by-step infrastructure setup guide |
| **Historical cases** | Store/detect similar cases (table: `cases`) |
| **Payments** | Subscription plans; checkout API placeholder for Stripe |
| **Admin** | Dashboard, analytics, cloud services management (admin role only) |

## Pages

- `/` – Landing  
- `/login`, `/register` – Auth  
- `/dashboard` – User dashboard, list of requirements  
- `/requirements/new` – Requirement form (prompt + questionnaire)  
- `/recommendations/[id]` – Recommendation report (provider, cost, roadmap)  
- `/payment` – Subscription plans  
- `/payment/success` – Post-payment success  
- `/admin` – Admin dashboard (admin only)  
- `/admin/analytics` – Analytics (admin only)  
- `/admin/cloud-services` – Cloud services list (admin only)  

## Security

- Row Level Security (RLS) on all cloud platform tables  
- Auth-protected routes via middleware  
- Admin routes protected in layout (profile.role === 'admin')  

## Stripe

Checkout is wired to `/api/checkout?plan=pro|enterprise`. Replace the placeholder in `src/app/api/checkout/route.ts` with a real Stripe Checkout Session and redirect to `session.url`.
