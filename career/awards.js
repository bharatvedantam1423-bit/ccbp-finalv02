/* Awards & Recognitions — the pinned stage.
   The first stretch of the pin opens the stage out to the full width; the rest is split evenly
   across the five awards, so scrolling walks through them one at a time. A click on an award (or
   its mark) scrolls to its stretch. Reduced motion: no pin, the awards change on click. */
(() => {
  const sec = document.getElementById('recognition');
  if (!sec) return;
  const scene = sec.querySelector('[data-rc]');
  const items = [...sec.querySelectorAll('.rc-item')];
  const badges = [...sec.querySelectorAll('.rc-badges li')];
  const trophies = [...sec.querySelectorAll('.rc-trophy')];
  const list = sec.querySelector('.rc-list');
  // the large copy of each award, built from the index so the words live in one place
  const feature = sec.querySelector('.rc-feature');
  const feats = items.map(li => {
    const d = document.createElement('div');
    d.className = 'rc-feat';
    d.setAttribute('aria-current', 'false');
    d.innerHTML = li.innerHTML;
    feature.appendChild(d);
    return d;
  });
  const M = window.NWMotion;
  const N = items.length;
  const OPEN = 0.16;                       // share of the pin spent opening the stage
  let at = -1, flashT = 0;

  const show = i => {
    if (i === at) return;
    at = i;
    items.forEach((el, k) => el.setAttribute('aria-current', String(k === i)));
    feats.forEach((el, k) => el.setAttribute('aria-current', String(k === i)));
    badges.forEach((el, k) => el.setAttribute('aria-current', String(k === i)));
    trophies.forEach((el, k) => el.toggleAttribute('data-on', k === i));
    list.style.setProperty('--rc-at', i);
    // the spotlight flares as the new trophy comes up
    scene.style.setProperty('--rc-flash', 1);
    clearTimeout(flashT);
    flashT = setTimeout(() => scene.style.setProperty('--rc-flash', 0), 420);
  };

  // where award i sits in the page's scroll
  const yFor = i => {
    const r = scene.getBoundingClientRect();
    const span = r.height - innerHeight;
    const p = OPEN + (1 - OPEN) * ((i + .5) / N);
    return scrollY + r.top + span * p;
  };
  const go = i => {
    if (!M || M.RM) { show(i); return; }
    const lenis = window.NW && NW.lenis;
    lenis ? lenis.scrollTo(yFor(i), { duration: 1.2 }) : scrollTo({ top: yFor(i), behavior: 'smooth' });
  };
  items.forEach((el, i) => {
    el.addEventListener('click', () => go(i));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); } });
  });
  badges.forEach((el, i) => el.addEventListener('click', () => go(i)));

  show(0);
  if (!M || M.RM) { scene.style.setProperty('--rc-open', 1); return; }

  M.scene({
    el: scene,
    read: () => M.pin(scene),
    write: p => {
      const open = Math.min(1, p / OPEN);
      const eased = 1 - Math.pow(1 - open, 3);
      const q = Math.max(0, (p - OPEN) / (1 - OPEN));
      scene.style.setProperty('--rc-open', eased.toFixed(4));
      scene.style.setProperty('--rc-p', q.toFixed(4));
      show(Math.min(N - 1, Math.floor(q * N)));
    },
  });

  // press photos: each opens from the foot up as it arrives
  const cards = [...sec.querySelectorAll('.rc-cards li')];
  cards.forEach(li => M.once(li, () => li.classList.add('is-in')));
})();
