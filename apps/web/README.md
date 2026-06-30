# Web App

The production Next.js 15 App Router application lives at the repository root for Vercel compatibility. This workspace package exposes web-specific scripts so the repository still follows the requested `apps/web` monorepo shape without duplicating application files.

Vercel settings:

- Framework preset: Next.js
- Root directory: repository root
- Build command: `npm run build`
- Output: `.next`
