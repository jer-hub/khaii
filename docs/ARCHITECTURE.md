# Architecture

This document explains how **Our Journey** is structured so contributors can navigate the codebase quickly.

## Overview

Our Journey is a single-page Next.js App Router client experience. After a soft password unlock, the shell switches between feature tabs (home stage, scrapbook, coupons, reasons, games, and seasonal story).

```text
Browser
  └─ app/page.tsx
       ├─ PasswordGate          (locked)
       └─ AppShell              (unlocked)
            ├─ HomeStage / MusicPlayer
            ├─ MemoryCards
            ├─ CouponBook / ReasonsDeck
            ├─ MemoryGame / FlashcardQuiz
            └─ StoryViewer
```

## Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Routing & metadata | `app/` | Root layout, fonts, PWA manifest, page entry |
| Feature UI | `components/` | Interactive experiences and chrome |
| 3D home stage | `components/stage/` | Couple stage, drag, collisions, hearts |
| 3D seasonal story | `components/story/` | Four-season loop and decor |
| Content | `data/content.ts` | Names, copy, decks, quiz, story palette |
| Client state | `hooks/` | Unlock persistence, coupons, avatars |
| Utilities | `lib/` | Password normalization / matching |
| Static assets | `public/` | Icons, avatars, photos, service worker |

## Unlock flow

1. `PasswordGate` collects input.
2. `lib/password.ts` normalizes the guess (case/punctuation insensitive).
3. On success, `hooks/useClientStore` persists unlock in `localStorage`.
4. `app/page.tsx` swaps to `AppShell`.

This gate is a **UX privacy curtain**, not cryptographic access control. Anyone with the repo or network traffic can recover the secret. Treat `SITE.password` as personalization, not a security boundary.

## Content model

Almost all visitor-facing text and personalization lives in `data/content.ts`:

- `SITE` — branding, password, shared start date
- `CHARACTERS` / `STAGE_ACTIONS` — home stage identities and animations
- `MEMORIES`, `COUPONS`, `REASONS`, `STATS` — keepsake collections
- `GAME_PAIRS`, `QUIZ_CARDS` — game content
- `SEASON_STORY` — seasonal story copy and colors

Media paths should point at files under `public/` (for example `/memories/01.jpg`).

## PWA

- Manifest: `app/manifest.ts`
- Registration: `components/PwaRegister.tsx`
- Service worker: `public/sw.js`

The service worker supports installability and basic offline caching. Prefer testing “Add to Home Screen” on a real mobile device after deploy.

## Rendering notes

- Home and story experiences use React Three Fiber (`@react-three/fiber` + `@react-three/drei`).
- Motion and transitions use Framer Motion with `reducedMotion="user"`.
- The UI is mobile-first; bottom navigation is the primary wayfinding pattern.
