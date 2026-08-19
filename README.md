# Our Journey

A mobile-first Progressive Web App — a private, interactive gift site for a partner.

## Personalize

All of the copy, dates, and numbers live in [`data/content.ts`](data/content.ts):

- `SITE.partnerName` — shown in the welcome header
- `SITE.password` — gate password (punctuation is ignored, so `02/14` matches `0214`)
- `SITE.startDate` — used to calculate **Days Together**
- `MEMORIES`, `COUPONS`, `REASONS`, `STATS` — the scrapbook, coupon book, swipe deck, and dashboard

Default password: **`0214`**

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
