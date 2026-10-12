/* Shared motion for the sections below the programmes.
   - NWMotion.scene({ read, write }): one rAF loop for every scroll-linked scene on the page.
     All reads run first, then all writes, so scenes never force layout on each other.
   - NWMotion.progress(el, from, to): 0 → 1 as el's top travels from `from` to `to` (fractions of the
     viewport height measured from the top), e.g. progress(el, 1, 0) runs while it crosses the screen.
   - NWMotion.pin(el): 0 → 1 through a tall element whose child sticks (its height minus one screen).
   - NWMotion.once(el, fn, margin): runs fn once el is on screen.
   - [data-head] headings get a light wipe: the gradient fill sweeps in left to right as they arrive.
   Lenis drives the window scroll, so scrollY is always current. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = [];
  let vh = innerHeight, vw = innerWidth, y = scrollY, lastY = y, vel = 0;

  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const progress = (el, from = 1, to = 0) => {
    const top = el.getBoundingClientRect().top / vh;
    return clamp01((from - top) / (from - to));
  };
  const pin = el => {
    const r = el.getBoundingClientRect();
    return clamp01(-r.top / Math.max(1, r.height - vh));
  };
  const near = (el, pad = 1) => {
    const r = el.getBoundingClientRect();
    return r.bottom > -vh * pad && r.top < vh * (1 + pad);
  };

  const loop = () => {
    requestAnimationFrame(loop);
    y = scrollY;
    // smoothed scroll velocity in px/frame, for scenes that lean into the motion
    vel += ((y - lastY) - vel) * 0.18;
    lastY = y;
    const live = [];
    for (const s of scenes) if (!s.el || near(s.el, s.pad ?? .5)) { live.push(s); s.state = s.read ? s.read({ vh, vw, y, vel }) : null; }
    for (const s of live) s.write && s.write(s.state, { vh, vw, y, vel });
  };

  const scene = s => { scenes.push(s); return s; };
  const once = (el, fn, margin = '0px 0px -12% 0px') => {
    if (!('IntersectionObserver' in window)) return fn(el);
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); }
    }), { rootMargin: margin });
    io.observe(el);
  };

  addEventListener('resize', () => { vh = innerHeight; vw = innerWidth; });
  requestAnimationFrame(loop);

  window.NWMotion = { RM, scene, progress, pin, near, once, clamp01, get vh() { return vh; } };

  /* investors: the medallions flip in when the row arrives (career/investors.css) */
  const invRow = document.querySelector('.inv-row');
  if (invRow) RM ? invRow.classList.add('is-in') : once(invRow, () => invRow.classList.add('is-in'), '0px 0px -18% 0px');

  /* footer: the dark card rises and opens its corners as it comes up (career/media-footer.css) */
  const ft = document.querySelector('.ft__inner');
  if (ft && !RM) scene({
    el: ft,
    read: () => progress(ft, 1, .55),
    write: p => ft.style.setProperty('--ft-in', (1 - Math.pow(1 - p, 3)).toFixed(4)),
  });

  /* heading wipe: the gradient fill arrives left to right behind a soft edge, lifting a touch */
  const heads = document.querySelectorAll('[data-head]');
  if (RM) return;
  heads.forEach(h => {
    h.classList.add('nw-wipe');
    once(h, () => h.classList.add('is-in'), '0px 0px -15% 0px');
  });
})();
