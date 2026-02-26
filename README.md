# WPT Site

Current implementation snapshot for the `wpt-site` codebase.

Status date: 2026-02-26

## What This README Covers

This document describes what is implemented in code right now, including
live routes, integrated modules, and known gaps.

## Stack

- Vite + React 19 + TypeScript
- React Router
- Material UI + TailwindCSS
- Framer Motion
- `@react-three/fiber` + `@react-three/drei` (3D technical scene)
- `react-i18next` for translations
- Playwright + axe-core + Lighthouse CI

## Local Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

Quality commands:

```bash
npm run lint
npm run test:e2e
npm run test:a11y
npm run perf:lighthouse
npm run ci:quality
```

## Implemented Routes

- `/`
  - Home hero, brand sections in `Waste -> Power -> Technology` order
  - Case study block and applications block
  - Embedded impact calculator section
- `/technology`
  - Intro section
  - Scroll-linked 3D system walkthrough (`TechnologyScrollRig`)
  - Multi-section technical explanation (`TechnologyDescriptionScroll`)
- `/applications`
  - Toggle between B2G and B2B tracks
  - Dedicated content blocks for overview, case studies, and specifications
- `/docs`
  - Interactive three-pillar document view
  - Certificates gallery with zoom dialog
  - Links to brochures and brand book
- `/press`
  - Source-indexed press listing with external links
- `/about/history`
  - Timeline view with animated progression
- `/privacy-policy`
- `/terms-of-use`
- `/accessibility`
- `/technology-debug`
- `/technology-body-debug`

## Assets Currently Wired

- Brand logos in `public/`
- Press images in `public/`
- Technical vectors in `public/vectors/`
- PDFs and certificates in `public/docs/`
- 3D model: `src/assets/assembly/machinecluj-transformed.glb`
- Local fonts: Stack Sans and Figtree in `src/assets/fonts/`

## Current Gaps and In-Progress Areas

- Navigation links exist for routes that are not defined:
  - `/contact`
  - `/calculator`
  - `/case-studies`
- Language selector UI lists multiple locales, but only `en` translations are
  loaded in `src/i18n/index.ts`.
- Compliance pages read translation keys that are not present in
  `src/i18n/locales/en.json`.
- The impact calculator logic is currently embedded in
  `src/components/ImpactCalculator.tsx`; there is no separate
  `/utils/calculator.ts` module yet.

## Quality/CI Setup

- Playwright smoke tests: `tests/smoke.spec.ts`
- Playwright accessibility checks (axe): `tests/a11y.spec.ts`
- Lighthouse assertions configured in `lighthouserc.json`
- GitHub Actions workflow: `.github/workflows/quality.yml`

## Deployment Notes

- `vercel.json` defines security headers, including CSP, HSTS, and
  `X-Frame-Options`.
