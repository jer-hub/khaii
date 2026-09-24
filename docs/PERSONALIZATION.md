# Personalization guide

Fork this repo and customize it for your own story. In most cases you only need [`data/content.ts`](../data/content.ts) plus files under `public/`.

## 1. Core identity

Edit the `SITE` object:

| Field | Purpose |
| --- | --- |
| `partnerName` / `yourName` | Names shown in UI and 3D stage |
| `appName` | Browser title, PWA name, headers |
| `tagline` | Short line under the brand |
| `password` | Unlock phrase (punctuation-insensitive) |
| `passwordHint` | Soft hint on the lock screen |
| `startDate` | ISO date for “Days Together” |

Change the password before sharing a public deploy if you do not want visitors guessing the sample value.

## 2. Characters and stage

Update `CHARACTERS` photo paths and colors, then replace:

- `public/avatars/you.png`
- `public/avatars/partner.png`

`STAGE_ACTIONS` controls the action buttons on the home stage.

## 3. Collections

| Export | Used by |
| --- | --- |
| `MEMORIES` | Scrapbook / polaroid grid |
| `COUPONS` | Coupon book |
| `REASONS` | Swipe deck |
| `STATS` | Hero counters |
| `GAME_PAIRS` | Memory match tiles |
| `QUIZ_CARDS` | Flashcard quiz |
| `SEASON_STORY` | 3D seasonal story loop |

For photo memories, set `photo` to a public path such as `/memories/01.jpg` and drop the file in `public/memories/`.

## 4. Asset checklist

```text
public/
  avatars/          # couple portraits for the 3D stage
  memories/         # scrapbook photos
  mm/               # memory-match card art
  icons/            # PWA icons
  song.mp3          # optional home music track
```

## 5. Verify locally

```bash
npm install
npm run dev
npm run lint
npm run build
```

Visit `http://localhost:3000`, unlock with your new password, and click through every tab.
