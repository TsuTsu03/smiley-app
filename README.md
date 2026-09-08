# Smiley

Smiley is a multi-tenant dental clinic management platform for Philippine practices. It provides separate admin, dentist, and patient experiences while keeping clinic data isolated by tenant.

## What it covers

- Clinic onboarding, authentication, role-aware portals, and staff walkthroughs
- Appointment scheduling, patient records, queue management, and dentist schedules
- Patient registration, CSV import, consent records, insurance, billing, and exports
- Clinic-scoped audit logging and rate limits for sensitive routes
- Payment integration points for PayMongo checkout and webhooks
- Reminder jobs, demo-request handling, and optional AI-assisted workflows
- Public marketing, pricing, legal, and registration pages

## Local setup

Prerequisites: Node.js and npm.

```bash
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. Populate `.env.local` before exercising integrations or production-like workflows. The required and optional variables are documented in [.env.example](.env.example); provider setup and launch handoff are detailed in [SETUP.md](SETUP.md).

## Verify

```bash
npm run test
npm run build
```

Additional commands are available for integration checks, coverage, and load testing in [package.json](package.json).

## Production dependencies

The repository contains integration code, but a live deployment still requires owner-managed services and configuration:

- Supabase project, migrations, Authentication configuration, and Row Level Security verification
- PayMongo API and webhook credentials for billing
- Brevo sender and API credentials for appointment reminders
- Upstash Redis credentials for distributed rate limiting
- Optional Groq credentials for AI responses
- Vercel environment variables, cron secret, and a live-domain verification pass

Do not commit `.env.local`, service-role keys, webhook secrets, or provider tokens.

## Project layout

```text
src/app/          App Router pages and API routes
src/components/   Marketing pages, portals, and shared interface components
src/lib/          Authentication, billing, data access, email, and security helpers
src/lib/__tests__/ Unit tests for application services
supabase/         Schema and incremental database migrations
scripts/          Integration test tooling
```

## Stack

- Next.js, React, TypeScript, and Tailwind CSS
- Supabase for data, Auth, and tenant boundaries
- PayMongo, Brevo, Upstash Redis, and optional Groq integrations
