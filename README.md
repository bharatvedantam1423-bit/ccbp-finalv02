# NxtWave — The Wave (particle hero)

A scroll-driven hero where each section's photo is rebuilt as ~210k glittering 3D particles
(Three.js). Particles dissolve and re-form into the next section's image as you scroll.

## Run locally

The page reads image pixels in the browser, so it must be served over HTTP (opening the file
directly with `file://` will not work):

```bash
npx serve .
```

Then open the printed URL (e.g. http://localhost:3000).

## Deploy (Vercel)

This is a static site with no build step (`index.html` + `beats/` at the repo root).

1. In Vercel, **Add New → Project** and import this GitHub repository.
2. Framework Preset: **Other**. Leave Build Command and Output Directory empty; Root Directory is `./`.
3. Deploy. Every push to the production branch redeploys automatically.

`vercel.json` adds caching for the images in `beats/` and a couple of basic security headers.
It also works unchanged on GitHub Pages or Netlify.

## Files

- `index.html` — page, styles and the particle engine (Three.js r128 and Lenis load from CDN)
- `vercel.json` — Vercel headers and URL settings
- `beats/` — one image + one depth map per section
  - `hero.webp` / `d-hero.webp` — 1 · AI changed tech hiring
  - `hall.webp` / `d-hall.webp` — 2 · Everyone's scrolling
  - `mentor.webp` / `d-mentor.webp` — 3 · Fundamentals + AI
  - `handshake.webp` / `d-handshake.webp` — 4 · Projects that prove it
  - `phone.webp` / `d-phone.webp` — 5 · Then the message
  - `family.webp` / `d-family.webp` — 6 · An offer letter
  - `crowd.webp` / `d-crowd.webp` — 7 · Join the 16,000+

## Tuning

Per-section position, crop focus, depth relief, brightness and sampling resolution live in the
`SEC` array near the top of the script in `index.html`.

The "Explore programmes" button links to `#programmes` — point it at the real page before launch.
