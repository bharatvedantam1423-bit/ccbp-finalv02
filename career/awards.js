/* Awards & Recognitions (variation 2) — the turning ring.
   The first stretch of the pin raises the dome; the rest turns the ring one case at a time. Between
   cases the ring eases round and then holds, so every award gets a moment at the front. A tab scrolls
   to its award. Reduced motion: no pin; the tabs turn the ring directly. */
(() => {
  const sec = document.getElementById('recognition');
  if (!sec) return;
  const scene = sec.querySelector('[data-rc]');
  const items = [...sec.querySelectorAll('.rc-item')];
  const chips = [...sec.querySelectorAll('.rc-chip')];
  const M = window.NWMotion;
  const N = items.length;
  const RISE = 0.12;
  let at = -1;

  const show = i => {
    if (i === at) return;
    at = i;
    items.forEach((el, k) => el.setAttribute('aria-current', String(k === i)));
    chips.forEach((el, k) => el.setAttribute('aria-current', String(k === i)));
  };
  const smooth = t => t * t * (3 - 2 * t);

  const yFor = i => {
    const r = scene.getBoundingClientRect();
    const span = r.height - innerHeight;
    return scrollY + r.top + span * (RISE + (1 - RISE) * (i / (N - 1)) * .999);
  };
  chips.forEach((el, i) => el.addEventListener('click', () => {
    if (!M || M.RM) { scene.style.setProperty('--rc-turn', i); show(i); return; }
    const lenis = window.NW && NW.lenis;
    lenis ? lenis.scrollTo(yFor(i), { duration: 1.4 }) : scrollTo({ top: yFor(i), behavior: 'smooth' });
  }));

  show(0);
  const cards = [...sec.querySelectorAll('.rc-cards li')];
  if (!M || M.RM) {
    scene.style.setProperty('--rc-rise', 1);
    cards.forEach(li => li.classList.add('is-in'));
    return;
  }

  M.scene({
    el: scene,
    read: () => M.pin(scene),
    write: p => {
      const rise = Math.min(1, p / RISE);
      scene.style.setProperty('--rc-rise', (1 - Math.pow(1 - rise, 3)).toFixed(4));
      // t runs 0 → N-1; each step eases through its middle half and holds either side
      const t = Math.max(0, (p - RISE) / (1 - RISE)) * (N - 1);
      const i = Math.min(N - 2, Math.floor(t)), f = t - i;
      const turn = i + smooth(Math.min(1, Math.max(0, (f - .25) / .5)));
      scene.style.setProperty('--rc-turn', turn.toFixed(4));
      show(Math.round(turn));
    },
  });

  cards.forEach(li => M.once(li, () => li.classList.add('is-in')));
})();
