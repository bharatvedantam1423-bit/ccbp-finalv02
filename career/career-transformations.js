/*
 * Learner experiences — staggered testimonial wall (vanilla JS, no dependencies).
 * Boots every element with [data-career-transformations]. Asset base path comes from
 * data-assets (default "assets/career-transformations/").
 */
(() => {
  function init(root) {
    if (root.dataset.ctwReady) return;
    root.dataset.ctwReady = '1';
    let A = root.dataset.assets || 'assets/career-transformations/';
    if (!A.endsWith('/')) A += '/';

    // Learner data reused from ../career-transformations/data.js
    const VIDEOS = [
      { id: 'v01', name: 'Harshitha Nallapu', logo: 'cognizant',   lpa: '7.5 LPA' },
      { id: 'v02', name: 'Sravani Komatla',   logo: 'infosys',     lpa: '6.5 LPA' },
      { id: 'v03', name: 'Yashwanth Kodeti',  logo: 'deloitte',    lpa: '12 LPA'  },
      { id: 'v04', name: 'Deepthi Raavi',     logo: 'fractal',     lpa: '9 LPA'   },
      { id: 'v05', name: 'Manohar Gaddam',    logo: 'tcs',         lpa: '5.5 LPA' },
      { id: 'v06', name: 'Lavanya Bollam',    logo: 'capgemini',   lpa: '8 LPA'   },
      { id: 'v07', name: 'Ramesh Dandu',      logo: 'techm',       lpa: '6 LPA'   },
      { id: 'v08', name: 'Keerthi Vangala',   logo: 'globallogic', lpa: '10 LPA'  }
    ];
    const QUOTES = [
      { p: 'a01', name: 'Nikhil Varma',        logo: 'delhivery',   lpa: '11 LPA',   q: 'I stopped learning in tutorials and started shipping. Six projects later the interviews felt like a normal work day.' },
      { p: 'a02', name: 'Ananya Pilla',        logo: 'needl',       lpa: '9.5 LPA',  q: 'Coming from a non-tech degree I expected to be lost. The fundamentals track meant I never had to fake understanding something.' },
      { p: 'a03', name: 'Sai Charan Gurram',   logo: 'bosch',       lpa: '6 LPA',    q: 'The mock rounds were harsher than the real ones. Blunt feedback on the same evening is what actually changed my answers.' },
      { p: 'a04', name: 'Pooja Rachamalla',    logo: 'cyient',      lpa: '7 LPA',    q: 'I was working a support shift through all of it. Sessions were recorded, doubts cleared same day, so I never fell a week behind.' },
      { p: 'a05', name: 'Divya Vardhan',       logo: 'prodapt',     lpa: '8.5 LPA',  q: 'My mentor reviewed every submission properly. Not a rubber stamp, actual comments on why a decision was wrong.' },
      { p: 'a06', name: 'Arjun Tadepalli',     logo: 'nttdata',     lpa: '10 LPA',   q: 'DSA was the wall I kept hitting alone. Doing it daily with people at the same stage is what finally got me past it.' },
      { p: 'a07', name: 'Vamsi Kurapati',      logo: 'mindtree',    lpa: '6.5 LPA',  q: 'Nothing in the curriculum felt like filler by the time I reached the interviews. It tracked what companies were asking that year.' },
      { p: 'a08', name: 'Sandeep Mallela',     logo: 'hcl',         lpa: '5 LPA',    q: 'I had a gap year I could not explain away. The portfolio gave the conversation somewhere else to go.' },
      { p: 'a09', name: 'Bhavana Reddy',       logo: 'sap',         lpa: '12 LPA',   q: 'Resume shortlists came first, then the calls. Knowing what each company screens for changed where I applied.' },
      { p: 'a10', name: 'Rakesh Pothula',      logo: 'tanla',       lpa: '7.5 LPA',  q: 'What I did not expect was the peer group. Being around people grinding the same problems kept me honest on the slow weeks.' },
      { p: 'a11', name: 'Sruthi Kolli',        logo: 'capgemini',   lpa: '6 LPA',    q: 'Six months in I had a portfolio that read like a junior engineer, not a student. That is what got the first callback.' },
      { p: 'a12', name: 'Praneeth Yalamanchi', logo: 'accenture',   lpa: '8 LPA',    q: 'The interview prep was the difference. Rounds with people who actually hire, and an honest debrief afterwards.' },
      { p: 'a13', name: 'Harika Mandadi',      logo: 'merkle',      lpa: '9 LPA',    q: 'I switched from a BPO floor to engineering at twenty-seven. It took longer than the brochure says, but the path was never unclear.' },
      { p: 'a14', name: 'Chaitanya Burla',     logo: 'oracle',      lpa: '14 LPA',   q: 'Systems design was the part I thought I could skip. The two rounds that decided my offer were both design rounds.' },
      { p: 'a15', name: 'Meghana Jupally',     logo: 'techm',       lpa: '5.5 LPA',  q: 'I built the same project three times before it was good enough to talk about line by line. Nobody let me stop at the first version.' },
      { p: 'a16', name: 'Tarun Addanki',       logo: 'gep',         lpa: '8.5 LPA',  q: 'My college had no placement drive worth the name. The hiring network is the only reason I sat in front of a panel at all.' },
      { p: 'a17', name: 'Swathi Nagineni',     logo: 'deloitte',    lpa: '11.5 LPA', q: 'Two offers came in the same week after fourteen months of nothing. The difference was finally having work to show.' },
      { p: 'a18', name: 'Kiran Pasupuleti',    logo: 'infosys',     lpa: '5 LPA',    q: 'I am the first in my family to take a tech job. Nobody at home could tell me what a good answer sounded like. Here somebody could.' },
      { p: 'a19', name: 'Navya Thotakura',     logo: 'cognizant',   lpa: '6.5 LPA',  q: 'The weekly review was the part I dreaded and the part that worked. Someone looked at my code and said what was wrong with it.' },
      { p: 'a20', name: 'Abhiram Kodali',      logo: 'globallogic', lpa: '9.5 LPA',  q: 'I came in able to write code and unable to explain it. Six months of talking through my own work fixed that.' },
      { p: 'a21', name: 'Lakshmi Pendyala',    logo: 'tcs',         lpa: '5.5 LPA',  q: 'I finished my degree in 2022 and sat at home for a year. Having a schedule again mattered as much as the syllabus did.' },
      { p: 'a22', name: 'Vikas Chennupati',    logo: 'nttdata',     lpa: '10.5 LPA', q: 'Every round I failed got written down and worked on. By the fifth company the same questions were not catching me out.' },
      { p: 'a23', name: 'Ramya Settipalli',    logo: 'capgemini',   lpa: '7 LPA',    q: 'I was told a non-CS degree would close the door. It did, at some places. Enough of the others opened that it stopped mattering.' },
      { p: 'a24', name: 'Mahesh Konduru',      logo: 'mindtree',    lpa: '6 LPA',    q: 'The projects were the whole interview. I spent forty minutes on one I had built and never touched a puzzle question.' }
    ];

    // 8 columns × 5 rows = 40 cards → 28 text : 12 video = exactly 70 : 30.
    // Rows holding a video card, per column (no two videos side by side in the same row).
    const VIDEO_ROWS = [[1, 4], [3], [0, 2], [4], [0, 3], [2], [0, 4], [2]];
    const ROWS = 5;
    // One extra card under columns 3, 4, 5 (they settle highest and looked empty at the bottom).
    // Extras overflow the column without adding layout height, so the section keeps its size.
    // Totals become 30 text : 13 video (69.8 : 30.2).
    const EXTRA = { 2: 'text', 3: 'text', 4: 'video' };
    // Start offsets (px). Centre pair starts in place under the title; the rest rise in, edges last.
    const COL_OFFSETS = [1400, 900, 500, 0, 0, 500, 900, 1400];  // shorter travel → calmer rise
    // Where each column settles after scrolling (approved mock): a gentle arch, centre pair highest.
    const SETTLE = [336, 222, 110, 0, 0, 110, 222, 336];
    // Once the arch has formed, each column keeps its own pace through the rest of the scroll: a share of
    // the distance scrolled since, added (lagging) or taken away (running ahead). Neighbours alternate, so
    // the wall keeps moving against itself instead of sliding up as one sheet.
    const PACE = [0.12, -0.07, 0.16, -0.03, 0.06, -0.12, 0.09, -0.05];

    const PLAY_ICON = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5.2v9.6a.6.6 0 0 0 .92.5l7.4-4.8a.6.6 0 0 0 0-1L7.92 4.7A.6.6 0 0 0 7 5.2Z" fill="#0f172a"/></svg>';

    const textCard = d => `
      <article class="ctw-card-text">
        <div class="ctw-top">
          <div class="ctw-avatar"><img src="${A}p/${d.p}.jpg" alt="" loading="lazy"></div>
          <span class="ctw-pill">₹${d.lpa}</span>
        </div>
        <div class="ctw-who">
          <p class="ctw-name">${d.name}</p>
          <img class="ctw-logo" src="${A}logos/${d.logo}.png" alt="${d.logo}" loading="lazy">
        </div>
        <p class="ctw-quote">${d.q}</p>
      </article>`;

    const videoCard = d => `
      <article class="ctw-card-video" data-video="${A}v/${d.id}.mp4">
        <img class="ctw-still" src="${A}v/${d.id}.jpg" alt="" loading="lazy">
        <div class="ctw-shade"></div>
        <div class="ctw-play">${PLAY_ICON}</div>
        <div class="ctw-overlay">
          <div class="ctw-who">
            <p class="ctw-name">${d.name}</p>
            <img class="ctw-logo" src="${A}logos/w/${d.logo}.png" alt="${d.logo}" loading="lazy">
          </div>
          <span class="ctw-pill">₹${d.lpa}</span>
        </div>
      </article>`;

    const imagesEl = root.querySelector('.ctw-images');
    let qi = 0, vi = 0;
    const cols = COL_OFFSETS.map((off, c) => {
      const col = document.createElement('div');
      col.className = 'ctw-col';
      let html = '';
      for (let r = 0; r < ROWS; r++) {
        html += VIDEO_ROWS[c].includes(r)
          ? videoCard(VIDEOS[vi++ % VIDEOS.length])
          : textCard(QUOTES[qi++ % QUOTES.length]);
      }
      if (EXTRA[c]) html += EXTRA[c] === 'video'
        ? videoCard(VIDEOS[vi++ % VIDEOS.length]).replace('<article class="ctw-card-video"', '<article class="ctw-card-video ctw-extra"')
        : textCard(QUOTES[qi++ % QUOTES.length]).replace('<article class="ctw-card-text"', '<article class="ctw-card-text ctw-extra"');
      col.innerHTML = html;
      imagesEl.appendChild(col);
      return { el: col, off, settle: SETTLE[c], pace: PACE[c] };
    });

    // Video cards play on their own, muted and looping, while they are on screen, and pause when they
    // leave, so only the few in view are ever loading or running. Reduced motion keeps the stills.
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const playIO = !reduceMotion && 'IntersectionObserver' in window && new IntersectionObserver(entries => {
      for (const { target: card, isIntersecting } of entries) {
        let v = card.querySelector('video');
        if (isIntersecting) {
          if (!v) {
            v = document.createElement('video');
            v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
            v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
            v.preload = 'auto'; v.src = card.dataset.video;
            card.insertBefore(v, card.querySelector('.ctw-shade'));
          }
          v.play().then(() => card.classList.add('ctw-playing')).catch(() => {});
        } else if (v) {
          v.pause();
        }
      }
    }, { rootMargin: '120px 0px', threshold: 0.15 });
    if (playIO) root.querySelectorAll('.ctw-card-video').forEach(card => playIO.observe(card));

    // Mobile: the scaled grid keeps its unscaled layout height, so trim the mask to match.
    const mask = root.querySelector('.ctw-mask');
    function fitMask() {
      const s = parseFloat(getComputedStyle(root).getPropertyValue('--grid-scale')) || 1;
      const h = imagesEl.offsetHeight;
      imagesEl.style.marginBottom = `${-(h * (1 - s))}px`;
    }
    // Lock each column's layout height to its first ROWS cards so extras don't grow the section.
    function lockCols() {
      for (const { el } of cols) {
        el.style.height = '';
        const last = el.children[ROWS - 1];
        el.style.height = `${last.offsetTop + last.offsetHeight - el.firstElementChild.offsetTop}px`;
      }
    }
    const relayout = () => { lockCols(); fitMask(); };
    relayout();
    addEventListener('resize', relayout);
    addEventListener('load', relayout);
    document.fonts && document.fonts.ready.then(relayout);

    // Scroll-linked stagger (heading is static).
    const section = root;
    const clamp01 = v => Math.min(1, Math.max(0, v));
    // Section-top position relative to viewport height.
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cur = 0;

    // the rise follows the wall: it starts as the wall's top enters at the foot of the screen and has
    // settled into the arch a quarter of the way down, then the columns keep their own paces
    const WALL_FROM = 1.15, WALL_TO = 0.2;
    const target = () => {
      const top = mask.getBoundingClientRect().top / innerHeight;
      return clamp01((WALL_FROM - top) / (WALL_FROM - WALL_TO));
    };
    // Heading → card-section gap: 130px at rest (56px on mobile), closes to 80px (32px on mobile), then stays locked.
    // Gap closes while the section top moves from 60% (rest position) to 30% of the viewport.
    const GAP_FROM = 0.6, GAP_TO = 0.3;
    const gapClose = () => Math.max(0, parseFloat(getComputedStyle(root.querySelector('.ctw-heading')).paddingBottom) - (innerWidth < 810 ? 32 : 80));
    const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    // the heading fades as the cards reach it: it starts going a little before the highest card meets
    // its foot and is gone by the time that card reaches its top, and comes back on the way up
    const text = root.querySelector('.ctw-heading-text');
    const fadeText = () => {
      if (!text) return;
      const t = text.getBoundingClientRect();
      let wall = Infinity;
      for (const { el } of cols) { const c = el.firstElementChild; if (c) wall = Math.min(wall, c.getBoundingClientRect().top); }
      const LEAD = 40;
      text.style.opacity = (1 - clamp01((t.bottom + LEAD - wall) / (t.height + LEAD))).toFixed(3);
    };
    const render = p => {
      fadeText();
      const g = clamp01((GAP_FROM - section.getBoundingClientRect().top / innerHeight) / (GAP_FROM - GAP_TO));
      mask.style.transform = `translate3d(0, ${(-gapClose() * g).toFixed(2)}px, 0)`;
      const e = easeInOut(p);
      // how far the wall has scrolled past the point where the arch settles (0 until then)
      const past = reduce ? 0 : Math.max(0, WALL_TO * innerHeight - mask.getBoundingClientRect().top - (-gapClose() * g));
      // the wall sweeps in from the left: the right-hand columns lead, the left ones trail a beat
      // behind, so it arrives as one moving surface; the rise into the arch is kept, gentler
      const W = innerWidth * 1.05;
      cols.forEach(({ el, off, settle, pace }, c) => {
        const ec = reduce ? 1 : easeOut(clamp01((p - (cols.length - 1 - c) * 0.035) / 0.755));
        const x = -(1 - ec) * W;
        const y = settle + (off - settle) * 0.35 * (1 - e) - past * pace;
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        el.style.opacity = (0.25 + 0.75 * ec).toFixed(3);
      });
    };
    function tick() {
      const t = target();
      cur = reduce ? t : cur + (t - cur) * 0.08;
      if (Math.abs(t - cur) < 1e-4) cur = t;
      render(cur);
      requestAnimationFrame(tick);
    }
    cur = target(); render(cur);
    requestAnimationFrame(tick);
  }

  const boot = () => document.querySelectorAll('[data-career-transformations]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
