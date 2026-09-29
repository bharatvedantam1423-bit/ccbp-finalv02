# NxtWave — homepage

Opens on a scroll-driven particle hero. Each photo is rebuilt as ~210k glittering 3D particles
(Three.js), and a depth map pushes them forward and back so the picture has real volume when it
tilts. In a transition every particle flies from its place in one photo to its place in the next,
and the photo itself fades in exactly where they land (a depth-lifted copy of the image, placed and
cropped like the particles and added onto the dark page so its backdrop disappears). After it come
the programmes cards and the rest of the NxtWave homepage (from the CCBP-v02 build).

## Page structure

1. **The Wave** — the particle hero (7 scroll screens, dark): the promise, the companies that
   hire, the curriculum that moves with them, the mentors, the building, the reward, the invitation.
2. **Programmes** — "Three programmes. One is yours." Three cards (Academy, Intensive, NIAT);
   hover (desktop) or tap (mobile) a card to expand it. The hero's "Explore programmes" button
   scrolls here. The resting and collapsed cards are the earlier build; the open card follows the
   Figma file (CCBP-v02, node 1030:488): both halves white, the photo fading up into white, and one
   blue pill instead of the two resting buttons. While the pointer is over an open card it turns
   toward the cursor and the layers travel by different amounts — photo, then logo, then panel —
   so they read at different depths (`--nx/--ny/--rx/--ry`, eased in `programmes.js`).

   The file repeats the Academy copy on all three cards; each card keeps its own here, and the CTA
   reads Explore Academy / Intensive / NIAT.
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

- `index.html` — page, v02 section styles and scripts, and the particle engine
- `programmes.css`, `programmes.js` — section 2 styles and card behaviour (all styles scoped to `.programmes`)
- `career/` — styles and scripts for the lower sections (scoped to `.cs`, `.mc`, `.nr`, `.ft`)
- `vendor/` — Lenis, GSAP + ScrollTrigger, Three.js r128 (particle hero) and r170 (National Recognition
  backdrop), self-hosted fonts; nothing but Google Fonts loads from another site
- `assets/` — section 2 images (see `assets/README.md`) and the v02 images, logos and films;
  `assets/logos-wall/` holds the white logo silhouettes the hero's screen-2 ticker runs
- `vercel.json` — Vercel headers and URL settings
- `beats/` — one image + one depth map per section
  - `hero.webp` / `d-hero.webp` — 1 · AI changed tech hiring
  - `story2.webp` / `d-story2.webp` — 2 · 3,000+ companies: we know who's hiring (the student alone,
    cropped tight; the wall of logos above him is a live ticker, not part of the picture)
  - `story3.webp` / `d-story3.webp` — 3 · Always current: the curriculum moves with the market
  - `story4.webp` / `d-story4.webp` — 4 · Taught by doers: people who still do the job
  - `story5.webp` / `d-story5.webp` — 5 · Involve, learn, grow: you build (cropped in from the
    generated plate's black left band, so the two of them fill the slot)
  - `story6.webp` / `d-story6.webp` — 6 · The real reward: the first offer changes more than a salary
  - `story7.webp` / `d-story7.webp` — 7 · Join the 16,000+

  Screen 2's wall is a ticker: three rows of the real company logos running over the particles
  (`assets/logos-wall/`, made from the same files the logo section below uses, each reduced to one
  white silhouette and normalised on optical size, so a long wordmark does not read twice as big as
  a compact one). Nothing is generated, so no garbled lettering. The rows fade up once the screen
  is in view, a beat after the picture.

  Each of 2-6 carries a `keep` side in `SEC`: the picture is pushed clear of that screen's own
  headline before it takes whatever room is left, so the words never land on a face however wide
  the window is (the headline is nowrap and stays one size while the picture's slot grows).

  Photos 2–7 were generated in Magnific on a pure black background so they blend into the page.
  Depth maps come from Depth Anything V2 (Base), inverted so darker = nearer, which is what the
  particle engine expects.

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
