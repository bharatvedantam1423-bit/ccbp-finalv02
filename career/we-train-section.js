/*!
 * "We train you for what companies hire for" — fan → row scroll section.
 * Desktop: .ctg__pin is sticky for the section's length; scrolling through it flies the cards from the fan
 * into the row under the heading. Positions are measured inside the pin, so they hold while it sticks.
 * No dependencies. Works with native scroll and with Lenis (both drive window scroll).
 * Markup: index.html (#what-companies-look-for) · Styles: career/we-train-section.css
 */
(() => {
  // Fan pose in section 1: tilted cards stepping up to the right and running off the edge,
  // the first one in front. x/y are card centres as fractions of the pinned box.
  const FAN = [
    { x: .575, y: .60 },
    { x: .70,  y: .50 },
    { x: .825, y: .40 },
    { x: .95,  y: .31 },
  ];
  const POSE = { rx: 0, ry: 0, rz: 4, skew: -9, scale: .84, depth: -40 };
  const STAGGER = 0.07;     // each card leaves the fan a little after the one before
  const GLIDE = 0.14;       // how quickly the cards catch up with the scroll (lower = floatier)
  const MOBILE = '(max-width: 900px)';

  const clamp = v => Math.min(1, Math.max(0, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const docTop = el => el.getBoundingClientRect().top + scrollY;

  function init(root){
    if (root.dataset.ctgReady) return;
    root.dataset.ctgReady = '1';

    const hero  = root.querySelector('.ctg__hero');
    const pin   = root.querySelector('.ctg__pin');
    const slots = [...root.querySelectorAll('.ctg__slot')];
    const flies = [...root.querySelectorAll('.ctg__fly')];
    const cards = [...root.querySelectorAll('.ctg-card')];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mq = matchMedia(MOBILE);

    let geo = [], start = 0, span = 1, target = 0, cur = 0, raf = 0;
    const LAND = 0.82;       // the cards are home by this share of the pinned scroll; the rest is a short hold

    function measure(){
      root.style.marginBottom = '';
      if (mq.matches || reduce) {
        flies.forEach(f => { f.style.cssText = ''; f.classList.remove('ctg-is-landed'); });
        if (reduce && !mq.matches) placeOnSlots();
        return;
      }
      const box = pin.getBoundingClientRect(), w = box.width, h = box.height;
      geo = slots.map((s, i) => {
        const r = s.getBoundingClientRect();
        const left = r.left - box.left, top = r.top - box.top;
        return {
          left, top, w: r.width, h: r.height,
          dx: FAN[i].x * w - (left + r.width / 2),
          dy: FAN[i].y * h - (top + r.height / 2),
        };
      });
      flies.forEach((f, i) => {
        const g = geo[i];
        Object.assign(f.style, { width: g.w + 'px', height: g.h + 'px', left: g.left + 'px', top: g.top + 'px' });
      });
      // the flight runs while the pin sticks: from the section's top reaching the viewport top
      // until its bottom reaches the viewport bottom
      start = docTop(root);
      span = Math.max(1, (root.offsetHeight - pin.offsetHeight) * LAND);
      // the pin is a screen tall; tuck the white under the landed row beneath the next section so the
      // gap to its heading is that section's own room above the heading, as everywhere else on the page
      const rowBottom = Math.max(...slots.map(s => s.getBoundingClientRect().bottom));
      root.style.marginBottom = -Math.max(0, Math.round(box.bottom - rowBottom)) + 'px';
      read(); cur = target; paint();
    }

    function placeOnSlots(){
      const box = pin.getBoundingClientRect();
      slots.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        Object.assign(flies[i].style, { width: r.width + 'px', height: r.height + 'px', left: (r.left - box.left) + 'px', top: (r.top - box.top) + 'px' });
      });
    }

    function read(){ target = clamp((scrollY - start) / span); }

    function paint(){
      if (mq.matches || reduce) return;
      flies.forEach((f, i) => {
        const t = ease(clamp((cur - i * STAGGER) / (1 - 3 * STAGGER)));
        const k = 1 - t, g = geo[i];
        f.style.transform =
          `perspective(1500px) translate3d(${(g.dx * k).toFixed(1)}px,${(g.dy * k).toFixed(1)}px,${(POSE.depth * i * k).toFixed(1)}px) ` +
          `rotateX(${(POSE.rx * k).toFixed(2)}deg) rotateY(${(POSE.ry * k).toFixed(2)}deg) rotateZ(${(POSE.rz * k).toFixed(2)}deg) ` +
          `skewX(${(POSE.skew * k).toFixed(2)}deg) scale(${(1 + (POSE.scale - 1) * k).toFixed(4)})`;
        f.style.zIndex = 10 - i;
        f.classList.toggle('ctg-is-landed', t >= 1);   // landed cards levitate (CSS)
      });
    }

    function tick(){
      cur += (target - cur) * GLIDE;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      paint();
      raf = cur !== target ? requestAnimationFrame(tick) : 0;
    }

    addEventListener('scroll', () => {
      read();
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    // re-measure when anything shifts the layout: resize, fonts, images or content above loading late
    let pending = 0;
    const remeasure = () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(measure); };
    addEventListener('resize', remeasure);
    addEventListener('load', remeasure);
    mq.addEventListener('change', remeasure);
    document.fonts?.ready.then(remeasure);
    if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(document.body);
    measure();

    // appear when the section scrolls into view: desktop plays the whole fan,
    // phones play card by card
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      // on desktop the fan cards live outside the hero box, so the hero shows the whole section
      (e.target === hero && !mq.matches ? root : e.target).classList.add('ctg-is-shown');
      io.unobserve(e.target);
    }), { threshold: 0.25 });
    io.observe(hero);
    if (mq.matches) cards.forEach(c => { c.style.setProperty('--ctg-in', '0s'); io.observe(c); });
  }

  const boot = () => document.querySelectorAll('[data-ctg]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.WeTrainSection = { init };   // for frameworks that mount the markup later
})();
