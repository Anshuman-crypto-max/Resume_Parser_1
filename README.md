# Resume Parser

Resume Parser is an AI SaaS application for HR teams that extracts structured candidate data from resumes, stores searchable profiles, compares candidates, generates ATS reports, tracks analytics, and exports hiring data.

The repository now contains a Next.js 15 SaaS implementation plus the original Streamlit prototype in `app.py`.

## Stack

- Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion
- Clerk authentication with organizations
- Prisma ORM, Supabase Postgres, pgvector, Supabase Storage
- OpenAI parsing, ATS analysis, embeddings, and RAG-ready data model
- Upstash Redis rate limiting
- Stripe subscriptions and billing portal flow
- Resend email notifications
- Vitest, Playwright, GitHub Actions CI

## Features

- Landing page with hero, navbar, animated upload illustration, features, benefits, how it works, pricing, FAQ, testimonials-ready sections, footer, CTA, dark-mode tokens, SEO metadata, sitemap, and robots.
- Protected dashboard with sidebar navigation for candidates, upload, compare, ATS analyzer, analytics, settings, billing, API keys, usage, profile, and admin.
- PDF and DOCX upload endpoint with validation, duplicate detection, storage, text extraction, AI parsing, audit logs, and usage logs.
- Structured extraction schema for contact details, links, address, experience, education, skills, certifications, languages, projects, achievements, summary, companies, dates, salary, notice period, location, keywords, soft skills, and hard skills.
- Candidate search, filters, comparison, ATS scoring, analytics, API key management, Stripe checkout, and Stripe webhook support.
- Production database schema for all requested tables and operational concerns.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` and configure Clerk, Supabase, OpenAI, Upstash, Stripe, and Resend. Supabase must have the `vector` extension enabled and a private `resumes` storage bucket.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run prisma:deploy
```

## Documentation

- [Architecture](docs/architecture.md)
- [ER Diagram](docs/er-diagram.md)
- [OpenAPI](docs/openapi.yaml)
- [Deployment](docs/deployment.md)
- [Testing](docs/testing.md)
- [Developer Guide](docs/developer.md)

## Legacy Streamlit App

The previous Streamlit implementation remains in `app.py` and can still be run with:

```powershell
pip install -r requirements.txt
streamlit run app.py
```
