# Our Journey

A mobile-first Progressive Web App — a private, interactive gift site for a partner.

## Personalize

All of the copy, dates, and numbers live in [`data/content.ts`](data/content.ts):

- `SITE.partnerName` — shown in the welcome header
- `SITE.password` — gate password (punctuation is ignored, so `02/14` matches `0214`)
- `SITE.startDate` — used to calculate **Days Together**
- `MEMORIES`, `COUPONS`, `REASONS`, `STATS` — the scrapbook, coupon book, swipe deck, and dashboard
- `GAME_PAIRS` — tiles for the **Memory match** game (Home → Play with me)
- `QUIZ_CARDS` — questions and choices for the **Flashcard quiz**
- `STORY_SCENES` — scenes for the **Our story** viewer
- `CHARACTERS` — names and default head photos for the 3D couple on Home (`public/avatars/`)
- `STAGE_ACTIONS` — the five animations (wave, hug, dance, kiss, jump)

Default password: **`0214`**

## Home stage

The Home tab has a live 3D couple. Drag them around the floor, tap a head (or use Photo · Me / My Love) to set a face — it saves in `localStorage` — and tap **Wave / Hug / Dance / Kiss / Jump**. You can also drop an image file onto the left or right half of the stage.

## Play with me

From Home, three extra experiences open as nested views (the bottom tab bar stays at four items; the story viewer hides it):

- **Memory match** — 4×4 pair game with flip animation, moves, timer, and confetti
- **Flashcard quiz** — multiple-choice cards that flip to the answer, then a score
- **Our story** — autoplay scene viewer with pause, skip, and a progress bar


## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## PWA

The app is installable:

- Web app manifest (`Our Journey`, standalone display, cream/rose theme)
- Icons in `public/icons/`
- Production service worker at `public/sw.js`

On a phone: open the site → browser menu → **Add to Home Screen**.
