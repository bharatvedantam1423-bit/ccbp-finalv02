# NxtWave — homepage

Opens on a scroll-driven particle hero where each photo is rebuilt as ~210k glittering 3D
particles (Three.js) that dissolve and re-form as you scroll, followed by the programmes cards and
the rest of the NxtWave homepage (from the CCBP-v02 build).

## Page structure

1. **The Wave** — the particle hero (7 scroll screens, dark).
2. **Programmes** — "Three programmes. One is yours." Three cards (Academy, Intensive, NIAT);
   hover (desktop) or tap (mobile) a card to expand it. The hero's "Explore programmes" button
   scrolls here.
3. From the CCBP-v02 build, unchanged: **Recognised by** · **Awards & Recognitions** (scroll-scrubbed
   film) · **National Level Recognition** · **3,000+ companies** logo ticker · **Taught by people who
   have done the job** (pinned, scroll-scrubbed film) · **Career Transformations** · **Masterclasses** ·
   **Learner's Experiences** · **We train you for what companies hire for** · **Why Top Companies
   Prefer NxtWave Students** · **Investors** · **Recognized by Leading Media** · footer.

Also from v02: the **navbar** (fixed over the particle hero, fades out when the white sections
start, as it did over the v02 hero), the **WhatsApp** button, and the **Design notes** switch
(bottom-left; the rationale per section lives in the `NOTES` array at the end of `index.html`).

One Lenis instance drives scrolling for the whole page. Over the particle hero it uses the hero's
slower feel; from the programmes section down it uses the v02 settings (see the "page chrome" script).

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

- `index.html` — page, v02 section styles and scripts, and the particle engine (Three.js r128 from CDN)
- `programmes.css`, `programmes.js` — section 2 styles and card behaviour (all styles scoped to `.programmes`)
- `career/` — styles and scripts for the lower sections (scoped to `.cs`, `.mc`, `.nr`, `.ft`)
- `vendor/` — Lenis, GSAP + ScrollTrigger, Three.js r170 (National Recognition backdrop), self-hosted fonts
- `assets/` — section 2 images (see `assets/README.md`) and the v02 images, logos and films
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
`SEC` array near the top of the particle script in `index.html`.

Lower-section content: logo ticker `NAMES`, Career Transformations `PEOPLE` / `REVIEWS` (in
`index.html`), hiring-team cards (`career/script.js`), masterclass mentors (`career/masterclass.js`),
media and footer course tracks (`career/media-footer.js`).

The "Explore programmes" button scrolls to the programmes section. The three "Explore Academy /
Intensive / NIAT" buttons still link to `#` — point them at the real pages before launch.
Also placeholder in the v02 sections: the Career Transformations names, photos, quotes and packages,
and the nav's "Hire With Us", "About Us" and "Login" links (they do nothing yet).
