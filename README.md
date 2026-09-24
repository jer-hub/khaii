# Our Journey

[![CI](https://github.com/jer-hub/khaii/actions/workflows/ci.yml/badge.svg)](https://github.com/jer-hub/khaii/actions/workflows/ci.yml)
[![Live demo](https://img.shields.io/badge/demo-khaii.vercel.app-black)](https://khaii.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

Mobile-first Next.js Progressive Web App for a private, interactive relationship timeline — scrapbook memories, coupons, games, and a live 3D couple stage.

**Live site:** [https://khaii.vercel.app](https://khaii.vercel.app)

## About

**Our Journey** is a gift-style web app you can fork and personalize. It unlocks behind a soft password gate, then opens a tabbed keepsake experience: an interactive 3D home stage, polaroid scrapbook, redeemable coupons, “reasons I love you” cards, memory match, a flashcard quiz, and a looping four-season 3D story — installable as a PWA on phones.

> **GitHub About description** (also set on the repository):
> Mobile-first Next.js PWA for a private relationship timeline — scrapbook, games, coupons, and a 3D couple stage.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Documentation](#documentation)
- [Customization](#customization)
- [PWA behavior](#pwa-behavior)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Features

- Password-gated entry experience
- Home tab with interactive 3D couple stage and optional music
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
app/                  # App Router entry, layout, metadata, manifest
components/           # UI and interactive experiences
components/stage/     # 3D home stage pieces
components/story/     # 3D seasonal story pieces
data/content.ts       # primary personalization and content source
docs/                 # architecture and personalization guides
hooks/                # unlock state, persistence, avatars
lib/                  # password helpers
public/               # icons, avatars, memories, mm cards, sw.js, audio
.github/              # issue/PR templates and CI
```

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+

### Local development

```bash
git clone https://github.com/jer-hub/khaii.git
cd khaii
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

## Documentation

| Doc | Description |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | App layers, unlock flow, PWA, rendering notes |
| [docs/PERSONALIZATION.md](docs/PERSONALIZATION.md) | Step-by-step fork & customize guide |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to propose changes |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community expectations |

## Customization

All end-user content is centralized in [`data/content.ts`](data/content.ts). See the full walkthrough in [docs/PERSONALIZATION.md](docs/PERSONALIZATION.md).

### Quick reference

- `SITE.*` — names, app title, tagline, password, start date
- `MEMORIES` / `COUPONS` / `REASONS` / `STATS` — keepsake collections
- `GAME_PAIRS` / `QUIZ_CARDS` — game content
- `SEASON_STORY` — seasonal story copy and palette
- `CHARACTERS` / `STAGE_ACTIONS` — 3D stage identities and animations

### Asset locations

- Avatars: `public/avatars/`
- Scrapbook photos: `public/memories/`
- Memory match images: `public/mm/`
- PWA icons: `public/icons/`
- Home music: `public/song.mp3`

## PWA behavior

The app includes:

- Web app manifest (`app/manifest.ts`)
- Service worker registration (`components/PwaRegister.tsx`)
- Static service worker (`public/sw.js`)
- Mobile install support via “Add to Home Screen”

## Deployment

Any host that supports Next.js can run this project. The public demo is deployed on [Vercel](https://vercel.com/).

1. Push this repository to GitHub.
2. Import the repo in Vercel (or your preferred host).
3. Use the default `npm run build` output.
4. After deploy, verify unlock, tabs, media, and PWA install on a phone.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start local dev server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint checks |

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening changes. Use the issue and pull request templates under `.github/`.

## Security

Please report vulnerabilities according to [SECURITY.md](SECURITY.md).

The on-site password is a soft gate for the gift experience, not server-side authentication. Do not store real credentials or private personal data in the repository.

## License

Released under the [MIT License](LICENSE).
