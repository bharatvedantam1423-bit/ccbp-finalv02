/*!
 * "We train you for what companies hire for" — the stacking deck.
 * Each card sticks a step below the one before (CSS). As the next card slides up over a card, that
 * card sinks back a little (--ctg-sink, 0 → n for each card stacked on top of it). A card's own
 * drawing builds the first time it comes on screen. Uses NWMotion from career/motion.js.
 * Markup: index.html (#what-companies-look-for) · Styles: career/we-train-section.css
 */
(() => {
  function init(root) {
    if (root.dataset.ctgReady) return;
    root.dataset.ctgReady = '1';
    const slots = [...root.querySelectorAll('.ctg__slot')];
    const cards = slots.map(s => s.querySelector('.ctg-card'));
    const M = window.NWMotion;

    cards.forEach(c => M ? M.once(c, () => c.classList.add('ctg-is-shown'), '0px 0px -20% 0px') : c.classList.add('ctg-is-shown'));
    if (!M || M.RM) return;

    let rests = [];
    const measure = () => { rests = slots.map(s => parseFloat(getComputedStyle(s).top) || 0); };
    measure();
    addEventListener('resize', measure);

    // how far slot j has slid up to its resting place: 0 at the foot of the screen, 1 when it sticks
    M.scene({
      el: root,
      read: ({ vh }) => slots.map((s, i) => {
        const top = s.getBoundingClientRect().top;
        const rest = rests[i];
        return Math.min(1, Math.max(0, (vh - top) / Math.max(1, vh - rest)));
      }),
      write: cover => {
        cards.forEach((c, i) => {
          let sink = 0;
          for (let j = i + 1; j < cover.length; j++) sink += cover[j];
          c.style.setProperty('--ctg-sink', sink.toFixed(3));
        });
      },
    });
  }

  const boot = () => document.querySelectorAll('[data-ctg]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
