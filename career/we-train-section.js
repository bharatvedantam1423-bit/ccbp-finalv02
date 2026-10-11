/*!
 * "We train you for what companies hire for" (variation 2) — the bento assembling.
 * While the section is held, the four cards fly from scattered, turned positions in space into the
 * bento; the last stretch of the hold keeps the finished block still. A card's own drawing builds
 * once it has landed. Uses NWMotion from career/motion.js. Phones: each card flies in on its own.
 * Markup: index.html (#what-companies-look-for) · Styles: career/we-train-section.css
 */
(() => {
  // where each card starts, as fractions of the screen, and how it is turned
  const SCATTER = [
    { x: -.42, y: .28, z: -500, rx: 28, ry: 38, rz: -16 },
    { x: .36, y: -.40, z: -700, rx: -34, ry: -22, rz: 12 },
    { x: .12, y: .52, z: -300, rx: 46, ry: 10, rz: 20 },
    { x: .48, y: .40, z: -900, rx: -20, ry: -46, rz: -10 },
  ];
  const ease = t => 1 - Math.pow(1 - t, 3);

  function init(root) {
    if (root.dataset.ctgReady) return;
    root.dataset.ctgReady = '1';
    const tiles = [...root.querySelectorAll('.ctg__tile')];
    const cards = tiles.map(t => t.querySelector('.ctg-card'));
    const M = window.NWMotion;
    const show = () => cards.forEach(c => c.classList.add('ctg-is-shown'));
    if (!M || M.RM) { show(); return; }

    const mobile = matchMedia('(max-width: 900px)');
    if (mobile.matches) { cards.forEach(c => M.once(c, () => c.classList.add('ctg-is-shown'))); }

    let shown = false;
    M.scene({
      el: root,
      read: () => mobile.matches ? tiles.map(t => M.progress(t, 1.05, .55)) : M.pin(root),
      write: (p, f) => {
        tiles.forEach((t, i) => {
          // each card leaves a little after the one before; all are home by 75% of the hold
          const k = mobile.matches ? ease(p[i]) : ease(Math.min(1, Math.max(0, (p - i * .06) / (.75 - .18))));
          const s = SCATTER[i], r = 1 - k;
          t.style.transform = `translate3d(${(s.x * f.vw * r).toFixed(1)}px,${(s.y * f.vh * r).toFixed(1)}px,${(s.z * r).toFixed(0)}px) ` +
            `rotateX(${(s.rx * r).toFixed(2)}deg) rotateY(${(s.ry * r).toFixed(2)}deg) rotateZ(${(s.rz * r).toFixed(2)}deg)`;
          t.style.opacity = (.2 + .8 * Math.min(1, k * 1.6)).toFixed(3);
        });
        if (!mobile.matches && !shown && p > .12) { shown = true; show(); }
      },
    });
  }

  const boot = () => document.querySelectorAll('[data-ctg]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
