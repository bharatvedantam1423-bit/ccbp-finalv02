/* How we train: the point nearest the middle of the screen is the open one; the panel shows its
   illustration and the dots mark it. */
(() => {
  const sec = document.getElementById('what-companies-look-for');
  if (!sec) return;
  const items = [...sec.querySelectorAll('.wlx-item')];
  const vis = [...sec.querySelectorAll('.wlx-vis')];
  const dots = [...sec.querySelectorAll('.wlx-dots li')];
  let at = -1;
  const show = i => {
    if (i === at) return;
    at = i;
    items.forEach((el, k) => el.classList.toggle('is-on', k === i));
    vis.forEach((el, k) => el.classList.toggle('is-on', k === i));
    dots.forEach((el, k) => el.classList.toggle('is-on', k === i));
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) show(items.indexOf(e.target)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  items.forEach(el => io.observe(el));
  show(0);
})();

/* Hiring partners: the companies on a slowly turning globe. Built from the logos the marquee script
   already loaded (one of each), spread evenly over a sphere; nearer chips are larger and brighter.
   Drag to spin it; it coasts back to its own pace. Paused while off screen. */
(() => {
  const sec = document.querySelector('.nw-hire');
  if (!sec) return;
  const build = () => {
    const seen = new Set(), logos = [];
    sec.querySelectorAll('.nw-hire__rows img').forEach(img => {
      const src = img.getAttribute('src');
      if (!src || seen.has(src)) return;
      seen.add(src);
      logos.push({ src, alt: img.alt || '' });
    });
    if (!logos.length) return false;
    const list = logos.slice(0, 34);
    const globe = document.createElement('div');
    globe.className = 'nh-globe';
    globe.setAttribute('role', 'img');
    globe.setAttribute('aria-label', 'Companies that hire NxtWave learners: ' + list.map(l => l.alt).filter(Boolean).join(', '));
    const N = list.length, golden = Math.PI * (3 - Math.sqrt(5));
    const pts = list.map((l, i) => {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = golden * i;
      const el = document.createElement('div');
      el.className = 'nh-chip';
      el.innerHTML = '<img src="' + l.src + '" alt="" loading="lazy">';
      globe.append(el);
      return { el, x: Math.cos(t) * r, y, z: Math.sin(t) * r };
    });
    sec.append(globe);

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TILT = -0.32, BASE = 0.0026;
    let ay = 0, v = BASE, run = false, raf = 0, drag = null;
    const R = () => parseFloat(getComputedStyle(globe).getPropertyValue('--R')) || globe.clientWidth / 2.6;
    const frame = () => {
      ay += v;
      if (!drag) v += (BASE - v) * 0.03;            // coast back to the resting pace
      const rad = R(), cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(TILT), sx = Math.sin(TILT);
      for (const p of pts) {
        const x1 = p.x * cy + p.z * sy, z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx;
        const d = (z2 + 1) / 2;                        // 0 at the back, 1 at the front
        p.el.style.transform = 'translate(' + (x1 * rad).toFixed(1) + 'px,' + (y2 * rad).toFixed(1) + 'px) scale(' + (0.5 + d * 0.62).toFixed(3) + ')';
        p.el.style.opacity = (0.18 + d * 0.82).toFixed(3);
        p.el.style.zIndex = Math.round(d * 100);
        p.el.style.filter = d < 0.45 ? 'blur(' + ((0.45 - d) * 4).toFixed(2) + 'px)' : 'none';
      }
      if (run) raf = requestAnimationFrame(frame);
    };
    frame();
    if (reduce) return true;
    new IntersectionObserver(([e]) => {
      run = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (run) raf = requestAnimationFrame(frame);
    }).observe(globe);
    globe.addEventListener('pointerdown', e => { drag = { x: e.clientX }; globe.classList.add('is-drag'); globe.setPointerCapture(e.pointerId); });
    globe.addEventListener('pointermove', e => { if (!drag) return; v = (e.clientX - drag.x) * 0.0009; drag.x = e.clientX; });
    const up = () => { drag = null; globe.classList.remove('is-drag'); };
    globe.addEventListener('pointerup', up);
    globe.addEventListener('pointercancel', up);
    return true;
  };
  if (!build()) addEventListener('load', build, { once: true });
})();

/* In the news: the publications run on a ticker, so the row is doubled for a seamless loop. */
(() => {
  const row = document.getElementById('fm-press');
  if (!row) return;
  const dup = () => {
    if (!row.children.length || row.dataset.loop) return !!row.dataset.loop;
    [...row.children].forEach(li => { const c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); row.append(c); });
    row.dataset.loop = '1';
    return true;
  };
  if (!dup()) addEventListener('load', dup, { once: true });
})();
