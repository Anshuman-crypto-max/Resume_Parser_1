# Testing Guide

## Unit and Integration

```bash
npm test
```

Use Vitest for schema validation, parser utility behavior, search query construction, and billing helper tests.

## Type Safety

```bash
npm run typecheck
```

## Lint

```bash
npm run lint
```

## E2E

```bash
npm run test:e2e
```

Playwright should cover landing page, sign-in redirect, upload validation, candidate search, ATS analyzer, comparison, billing navigation, and dashboard responsiveness.

## Accessibility

Run Playwright with axe or Lighthouse CI before production release. Critical flows should be keyboard reachable and have visible focus rings.
