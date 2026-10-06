/* Awards & Recognitions: one award is open at a time. It advances on its own
   while the section is in view, and follows a click or a keyboard choice.
   The trophy, the badge and the open award all change on the same beat. */
(() => {
  const sec = document.getElementById('recognition');
  if (!sec) return;
  const items = [...sec.querySelectorAll('.rc-item')];
  const badges = [...sec.querySelectorAll('.rc-badges li')];
  const trophies = [...sec.querySelectorAll('.rc-trophy')];
  if (!items.length) return;

  const HOLD = 2600, FADE = 380;           // how long an award holds, and the dissolve between them
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let at = -1, timer = 0, inView = false, held = false;

  // the plate going out holds at full opacity under the one coming in, so the plinth they share
  // never dips; it is dropped once the incoming plate has covered it
  let settle = 0;
  const show = i => {
    if (i === at) return;
    const was = at;
    at = i;
    items.forEach((el, k) => el.setAttribute('aria-current', String(k === i)));
    badges.forEach((el, k) => el.setAttribute('aria-current', String(k === i)));
    trophies.forEach(el => el.removeAttribute('data-prev'));
    if (was >= 0) trophies[was].setAttribute('data-prev', '');
    trophies.forEach((el, k) => k === i ? el.setAttribute('data-on', '') : el.removeAttribute('data-on'));
    clearTimeout(settle);
    settle = setTimeout(() => trophies.forEach(el => el.removeAttribute('data-prev')), FADE + 60);
  };

  const stop = () => { clearTimeout(timer); timer = 0; };
  const run = () => {
    stop();
    if (!inView || held || reduce.matches) return;
    timer = setTimeout(() => { show((at + 1) % items.length); run(); }, HOLD);
  };

  items.forEach((el, i) => {
    el.addEventListener('click', () => { show(i); run(); });
    el.addEventListener('focus', () => { show(i); });
    el.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault(); show(i); run();
    });
  });

  // the pointer resting on the roll holds the award it is on
  const roll = sec.querySelector('.rc-list');
  if (roll) {
    roll.addEventListener('pointerenter', () => { held = true; stop(); });
    roll.addEventListener('pointerleave', () => { held = false; run(); });
  }

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; run(); }, { threshold: .25 })
    .observe(sec.querySelector('.rc-panel') || sec);

  show(0);
})();
