# Deployment Guide

## 1. Provision Services

Create accounts and projects for Vercel, Supabase, Clerk, Upstash Redis, Stripe, OpenAI, and Resend.

## 2. Supabase

Enable Postgres and Storage. Create a private bucket named `resumes`. Enable the `vector` extension:

```sql
create extension if not exists vector;
```

Set `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_RESUME_BUCKET`.

## 3. Clerk

Create a Clerk app, enable email/password, email verification, forgot password, Google OAuth, and organizations. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `CLERK_WEBHOOK_SECRET`.

## 4. Stripe

Create free trial, monthly, and yearly prices. Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, price IDs, and the webhook secret. Point Stripe webhooks at `/api/webhooks/stripe`.

## 5. Vercel

Import the GitHub repository, add all environment variables from `.env.example`, and set build command:

```bash
npm run build
```

Before first production deploy, run:

```bash
npm run prisma:deploy
```

## 6. CI/CD

The included GitHub workflow runs lint, typecheck, tests, Prisma generate, and build on push and pull requests.
