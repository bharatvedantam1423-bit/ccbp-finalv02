# NxtWave — The Wave (homepage)

Static site, no build step: `index.html` + `programmes.css/js` + `career/*` + `assets/` + `beats/` + `vendor/`.
Deployed on Vercel from GitHub (`bharatvedantam1423-bit/ccbp-finalv02`). The live site is the
`final-v01-bharat-changes` branch; this redesign is the branch `redesign-lower-sections` (V1, final).

## Run it

The page reads image pixels and fetches its video, so it must be served over HTTP (not `file://`):

```
npx serve .          # or: python -m http.server 3000
```

Open http://localhost:3000. Test at 1440×900, 1024×768 and 390×844, and with reduced motion on.

## Ground rules for changes

- The hero (`#hero`, particle engine) and section 2 (`#programmes`) are untouched by the redesign. Leave them alone unless asked.
- Copy is fixed: every heading, line, name, number and alt text matches the live site. Change layout and motion, not words.
- Colours and fonts are fixed: Outfit 600 headings with the blue mesh gradient (`--head-grad` in `:root`), Inter body,
  `--sub-ink #3b4a63`, navy panel `#060f22 → #143479 → #0e41ab`, radii `--r-xs 8 / --r-sm 12 / --r-md 16 / --r-lg 24`.
- "NxtWave Learner's Experiences" was removed on purpose (markup, CSS, JS and `assets/learner-experiences/`). Don't bring it back.
- Animate with `transform` and `opacity` (and masks). Avoid animating `font-size`, `height`, `filter: blur()` or anything that reflows while scrolling; it shows up as jank.
- Every motion has a `prefers-reduced-motion: reduce` fallback. Keep it that way.

## Page order (below the programmes)

| # | Section | id | Files | What it does |
|---|---|---|---|---|
| 3 | Awards & Recognitions | `#recognition` | `career/awards.css/js` | Heading + recognised-by strip. Navy stage pins and opens to full width; scroll steps through 5 awards. Large name cross-fades over a fixed-size index with a sliding marker. Trophy pictures (`assets/awards/t-*.webp`) share the plinth's canvas and are stacked exactly on `plinth.webp`, revealed bottom-up by a mask (`@property --rc-m`). Press photos: one even row, cut corner. |
| 3b | 3,000+ companies | `#hiring-network` | `career/hiring-companies.css/js` | Count runs up to 3,000. Four logo rows (Web Animations) on a plane that stands up as it scrolls in; scroll speed pushes the drift. |
| 5 | Taught by people… | `#team` | inline CSS + inline script in `index.html` | Original build, unchanged: pinned stage, `assets/mentors-v3.mp4` scrubbed by scroll (frames cached to canvas). |
| 6 | Career Transformations | `#career-transformations` | `career/career-transformations.css/js` | Original build, unchanged: pinned heading, staggered arch wall of text/video testimonials, View All. |
| 6b | Masterclasses | `#masterclasses` | `career/masterclass.css/js` | Sticky intro left; film tilts flat as it rises; mentor cards stand up; company ticker. |
| 7 | We train you for what companies hire for | `#what-companies-look-for` | `career/we-train-section.css/js` | Sticky heading left, stacking deck right (sticky slots, `--ctg-sink`, transform only, rests before release). |
| 8 | Why Top Companies Prefer NxtWave Students | `#hiring-teams` | `career/style.css` + `career/script.js` | Coverflow (`--d`, `--ad` per card), auto-advance 4.2 s while visible, arrows/swipe/keys, YouTube modal. Portraits use `--r-lg`. |
| 9 | Backed by Leading Global Investors | `#investors` | `career/investors.css` | Heading left, three coin medallions in one row; flip in (`.inv-row.is-in`), gentle turn + sheen. |
| 10 | Recognized by Leading Media | `#featured-in-media` | `career/media-footer.css/js` | Press board flips in; bento stories open (curtain + settle); stepping ticker; View More. |
| — | Footer | `#footer` | `career/media-footer.css/js` | Content unchanged; card rises in (`--ft-in`). |

## Shared pieces

- `career/motion.js` — `window.NWMotion`: one rAF loop for every scroll-linked scene (`scene({el, read, write})`,
  all reads before writes), `progress(el, from, to)`, `pin(el)`, `once(el, fn)`, smoothed scroll velocity.
  Also: `[data-head]` heading wipe, investors `.is-in`, footer `--ft-in`. Load order: after GSAP/ScrollTrigger, before section scripts.
- `career/motion.css` — the `[data-head]` heading wipe (`@property --wipe` mask).
- Lenis drives smooth scroll (`window.NW.lenis`); `scrollY` is always current. ScrollTrigger is synced to it at the bottom of `index.html`.
- The letter-by-letter heading sweep (GSAP) at the end of `career/media-footer.js` runs on the programmes, mentors and Career Transformations headings only.
- Design notes panel (bottom-left switch) reads `NOTES` in the inline script; entries show only for ids on the page.

## Gotchas

- Page-head `<style>` blocks hold layout overrides for several sections ("PAGE LAYOUT" block). A stray `}` there silently drops the next rule — check brace balance after editing.
- Headless Chromium (Playwright) can't decode the H.264 mentors film; screenshots show that section empty. Real Chrome/Edge are fine.
- The repo is checked out on Windows with CRLF line endings.
- Hiring-partner and masterclass videos are YouTube embeds (`youtube-nocookie.com`); Career Transformations videos are local MP4s in `assets/career-transformations/v/`.
- Placeholder links still `#`: the three "Explore …" programme buttons and View All in Career Transformations.

## Other branch

`redesign-v2` is an alternative take on the same sections (navy dome trophy ring, logo orbits, iris film, tilted
story wall, circle-to-screen masterclass, exploded bento). V1 borrowed its hiring-partners coverflow and investor medallions.
