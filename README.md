# Our Journey

Our Journey is a mobile-first Next.js Progressive Web App for sharing a private, interactive relationship timeline with games, stories, and keepsakes.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Customization guide](#customization-guide)
- [PWA behavior](#pwa-behavior)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Security](#security)

## Features

- Password-gated entry experience
- Home tab with interactive 3D couple stage
- Personalized scrapbook memories with optional image assets
- Redeemable-style coupon deck and reasons swipe deck
- Memory match game with timer/move tracking and confetti
- Flashcard quiz flow with scoring
- Seasonal 3D story viewer loop
- Installable PWA (manifest, icons, service worker registration)

## Tech stack

- [Next.js 16](https://nextjs.org/) + React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- Three.js via `@react-three/fiber` and `@react-three/drei`

## Project structure

```text
app/                # Next.js app router entrypoints, metadata, manifest
components/         # UI building blocks and interactive experiences
components/stage/   # 3D home stage pieces
components/story/   # 3D seasonal story pieces
data/content.ts     # primary personalization and content source
hooks/              # client-side state helpers (unlock state, persistence)
public/             # static assets (icons, avatars, memories, mm cards, sw.js)
```

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+

### Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Customization guide

All end-user content is centralized in [`data/content.ts`](data/content.ts). In most cases, this is the only file you need to edit.

### Core site settings

- `SITE.partnerName` and `SITE.yourName`: names displayed throughout the app
- `SITE.appName` and `SITE.tagline`: metadata and hero text
- `SITE.password`: password gate secret (punctuation-insensitive match)
- `SITE.passwordHint`: helper text for unlock screen
- `SITE.startDate`: used to calculate “Days Together”

### Content collections

- `MEMORIES`: scrapbook cards (`photo` should reference files under `public/`)
- `COUPONS`: coupon entries displayed in the coupon deck
- `REASONS`: swipeable “reasons I love you” cards
- `STATS`: dashboard counters
- `GAME_PAIRS`: memory match game tiles
- `QUIZ_CARDS`: flashcard quiz prompts and answer options
- `SEASON_STORY`: 4-scene story loop copy and color palette
- `CHARACTERS`: names and default avatar paths for 3D models
- `STAGE_ACTIONS`: available home stage animations

### Asset locations

- Avatars: `public/avatars/`
- Scrapbook photos: `public/memories/`
- Memory match images: `public/mm/`
- PWA icons: `public/icons/`

## PWA behavior

The app includes:

- Web app manifest (`app/manifest.ts`)
- Service worker registration (`components/PwaRegister.tsx`)
- Static service worker (`public/sw.js`)
- Mobile install support via “Add to Home Screen”

## Deployment

Any host that supports Next.js can run this project.

### Production build

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` — start local dev server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run ESLint checks

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening changes.

## Security

Please report vulnerabilities according to [SECURITY.md](SECURITY.md).
