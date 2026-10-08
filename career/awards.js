/* Awards & Recognitions: the five trophies on a turning carousel. One award is open at a time; it
   advances on its own while the stage is in view, and follows a click on a trophy or a tab, or the
   arrow keys. The trophy, the caption and the tab change on the same beat. */
(() => {
  const sec = document.getElementById('recognition');
  if (!sec) return;
  const stage = sec.querySelector('.aw2-stage');
  const items = [...sec.querySelectorAll('.rc-item')];
  const tabs = [...sec.querySelectorAll('.rc-badges button')];
  const trophies = [...sec.querySelectorAll('.rc-trophy')];
  const N = trophies.length;
  if (!N) return;

  const HOLD = 3200;
  sec.style.setProperty('--hold', HOLD + 'ms');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let at = -1, timer = 0, inView = false, held = false;

  const show = i => {
    i = (i + N) % N;
    if (i === at) return;
    at = i;
    trophies.forEach((el, k) => {
      let p = k - i;
      if (p > N / 2) p -= N;
      if (p < -N / 2) p += N;
      el.style.setProperty('--p', p);
      el.style.setProperty('--ap', Math.abs(p));
      el.dataset.ap = Math.abs(p);
      el.toggleAttribute('data-on', p === 0);
      el.toggleAttribute('data-far', Math.abs(p) > 2);
    });
    items.forEach((el, k) => el.setAttribute('aria-current', String(k === i)));
    tabs.forEach((el, k) => {
      el.setAttribute('aria-current', String(k === i));
      const bar = el.querySelector('i');           // restart the timer bar
      if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
    });
  };

  const stop = () => { clearTimeout(timer); timer = 0; };
  const run = () => {
    stop();
    if (!inView || held || reduce.matches) return;
    timer = setTimeout(() => { show(at + 1); run(); }, HOLD);
  };

  trophies.forEach((el, k) => el.addEventListener('click', () => { show(k); run(); }));
  tabs.forEach((el, k) => el.addEventListener('click', () => { show(k); run(); }));
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { show(at + 1); run(); }
    if (e.key === 'ArrowLeft') { show(at - 1); run(); }
  });

  // resting the pointer on the caption holds the award it is on
  const cap = sec.querySelector('.aw2-caption');
  cap.addEventListener('pointerenter', () => { held = true; sec.classList.add('is-held'); stop(); });
  cap.addEventListener('pointerleave', () => { held = false; sec.classList.remove('is-held'); show(at); run(); });

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; run(); }, { threshold: .3 }).observe(stage);

  // the prints settle onto the paper as they come into view
  const prints = sec.querySelector('.rc-cards');
  if (prints) new IntersectionObserver(([e], o) => {
    if (e.isIntersecting) { prints.classList.add('is-in'); o.disconnect(); }
  }, { threshold: .2 }).observe(prints);

  show(0);
})();
