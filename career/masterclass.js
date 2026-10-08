/* Masterclasses from Mentors — data, rendering, scroll motion. */
(() => {
  // Content from ccbp.in → "Masterclasses from Mentors in the Community". Copy per Figma 778:1625.
  const MENTORS = [
    { name: 'Srividya Pranavi', img: 'srividya', role: 'Machine Learning Scientist', edu: 'Carnegie Mellon University, IIT Kharagpur' },
    { name: 'Sravya Nimmagadda', img: 'sravya', role: 'Senior Deep Learning Scientist, Autonomous Vehicles at NVIDIA', edu: 'Stanford, IIT Madras' },
    { name: 'Priyatham Bollimpalli', img: 'priyatham', role: 'Data & Applied Scientist II', edu: 'Carnegie Mellon University, IIT Guwahati' },
    { name: 'Vamsi Krishna', img: 'vamsi', role: 'AI & Quantum Computing, Google', edu: 'Georgia Institute of Technology, IIT Madras' },
  ];

  // Logos, trimmed from the ccbp.in logo wall (co-00…17) and the affiliation strip.
  const COMPANIES = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'VMware', 'Goldman Sachs',
    'PayPal', 'Samsung', 'Uber', 'Ola', 'Adobe', 'OYO',
    'Hotstar', 'Intel', 'NVIDIA', 'Walmart', 'Visa', 'eBay',
  ].map((name, i) => ({ name, src: `assets/masterclass/logos/co-${String(i).padStart(2, '0')}.png` }));

  const ICON = {
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18M11 12h2v2h-2z"/></svg>',
    cap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5M22 9v5"/></svg>',
  };
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // ---- Mentor tiles: after the film, alternating bottom / top like the reference's staggered tiles ----
  const rail = document.querySelector('.mc__rail');
  rail.insertAdjacentHTML('beforeend', MENTORS.map((m, i) => `
    <div class="mc__tile mc__tile--mentor ${i % 2 ? 'mc__tile--top' : 'mc__tile--bottom'}" role="listitem">
      <article class="mentor">
        <img class="mentor__avatar" src="assets/masterclass/avatar-${m.img}.jpg" alt="${esc(m.name)}" loading="lazy">
        <h3 class="mentor__name">${esc(m.name)}</h3>
        <div class="mentor__panel">
          <p class="mentor__row">${ICON.bag}<span>${esc(m.role)}</span></p>
          <p class="mentor__row">${ICON.cap}<span>${esc(m.edu)}</span></p>
        </div>
      </article>
    </div>`).join(''));

  // ---- Logo tickers: build S4 pattern — each set duplicated so translate −50% loops seamlessly ----
  const set = (list, hidden) => `<ul class="mc-ticker-set"${hidden ? ' aria-hidden="true"' : ''}>` +
    list.map((l) => `<li><img src="${l.src}" alt="${hidden ? '' : l.name}" decoding="async"></li>`).join('') + '</ul>';
  const row = (list, dir, dur) => `<div class="mc-ticker-row ${dir}" style="--tick-dur:${dur}s">${set(list)}${set(list, true)}</div>`;

  // Bottom: three lines of six, directions alternate (build DUR values)
  const DUR = [70, 64, 76];
  document.querySelector('[data-ticker="companies"]').innerHTML = DUR.map((d, r) => {
    const l = COMPANIES.slice(r * 6, r * 6 + 6);
    return row(l.concat(l), r % 2 ? 'to-left' : 'to-right', d);
  }).join('');

  // ---- Video: swap thumbnail for the YouTube player on click (the intro button plays it too) ----
  const video = document.querySelector('.mc__video');
  const play = () => {
    if (video.classList.contains('is-playing')) return;
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${video.dataset.yt}?autoplay=1&rel=0`;
    f.title = 'Sneak Peek Of Masterclass by Rakesh Misra';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    video.append(f);
    video.classList.add('is-playing');
  };
  video.addEventListener('click', play);
  document.querySelector('.mc__cta[data-play]').addEventListener('click', play);

  // ---- Logo rows fade up once they reach the screen ----
  const ticker = document.querySelector('[data-ticker="companies"]');
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { ticker.classList.add('is-in'); o.disconnect(); } }, { threshold: .2 })
    .observe(ticker);

  // ---- Horizontal scroll: the stage pins and vertical scroll slides the rail sideways.
  //      The pin is made exactly as tall as the rail's overflow, so one px down = one px across. ----
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // CSS leaves a plain swipe row
  const pin = document.querySelector('.mc__pin');
  const stage = pin.querySelector('.mc__stage');
  const viewport = pin.querySelector('.mc__viewport');
  const bar = pin.querySelector('.mc__progress span');
  let top = 0, dist = 0, x = -1;

  const measure = () => {
    dist = Math.max(0, rail.scrollWidth - viewport.clientWidth);
    pin.style.height = `${stage.offsetHeight + dist}px`;
    let y = 0, n = pin; while (n) { y += n.offsetTop; n = n.offsetParent; }   // untransformed page offset
    top = y; x = -1; update();
  };
  const update = () => {
    const p = dist ? Math.min(1, Math.max(0, (scrollY - top) / dist)) : 0;
    const nx = Math.round(p * dist);
    if (nx === x) return;
    x = nx;
    rail.style.transform = `translate3d(${-x}px,0,0)`;
    bar.style.transform = `scaleX(${p})`;
  };

  // keyboard: tabbing to a tile scrolls the page to where that tile is on screen
  rail.addEventListener('focusin', (e) => {
    const t = e.target.closest('.mc__tile'); if (!t) return;
    const want = Math.min(dist, Math.max(0, t.offsetLeft - (viewport.clientWidth - t.offsetWidth) / 2));
    if (Math.abs(want - x) > 4) scrollTo({ top: top + want, behavior: 'instant' });
  });

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', measure);
  addEventListener('load', measure);
  new ResizeObserver(measure).observe(document.body);   // pinned sections above settle after load
  measure();
})();
