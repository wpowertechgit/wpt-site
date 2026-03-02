# WPT Site

Current implementation snapshot for the `wpt-site` codebase.

Status date: 2026-02-26

## What This README Covers

This document describes what is implemented in code right now, including
live routes, integrated modules, and known gaps.

## Stack

- Vite + React 19 + TypeScript
- React Router
- Material UI
- Framer Motion
- `@react-three/fiber` + `@react-three/drei` (3D technical scene)
- `react-i18next` for translations
- Playwright + axe-core + Lighthouse CI
- Zustand for global storing
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

Playwright commands automatically skip when the `tests/` directory or a
target spec file is not present. This keeps CI green while the site is
maintained without a committed browser test suite.

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
- `/calculator`
- `/contact`

## Assets Currently Wired

- Brand logos in `public/`
- Press images in `public/`
- Technical vectors in `public/vectors/`
- PDFs and certificates in `public/docs/`
- Fallback Technology page for phone and desktop screen sizes `public/fallbackDesktop` & `public/fallbackMobile`
- Local fonts: Stack Sans and Figtree in `src/assets/fonts/`
- Assets for waste types `public/wasteTypes`

## Quality/CI Setup

- Playwright pipeline is optional and self-skips when `tests/` is absent
- `npm run test:e2e` runs the full Playwright suite when present
- `npm run test:a11y` runs `tests/a11y.spec.ts` when present
- Lighthouse assertions configured in `lighthouserc.json`
- GitHub Actions workflow: `.github/workflows/quality.yml`

## Deployment Notes

- `vercel.json` defines security headers, including CSP, HSTS, and
  `X-Frame-Options`.
