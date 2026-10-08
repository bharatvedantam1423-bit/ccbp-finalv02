/* How we train: the point under the middle of the screen is the open one. Measured every frame
   while the section is on screen (an observer's thresholds lag on a fast scroll), so the scene
   changes exactly as a point's top crosses the middle; the step bar and the rule beside each point
   fill with how far it has been read. */
(() => {
  const sec = document.getElementById('what-companies-look-for');
  if (!sec) return;
  const items = [...sec.querySelectorAll('.wlx-item')];
  const vis = [...sec.querySelectorAll('.wlx-vis')];
  const bars = [...sec.querySelectorAll('.wlx-dots i')];
  let at = -1, raf = 0, live = false;
  const show = i => {
    if (i === at) return;
    at = i;
    items.forEach((el, k) => el.classList.toggle('is-on', k === i));
    vis.forEach((el, k) => el.classList.toggle('is-on', k === i));
  };
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const update = () => {
    const mid = innerHeight / 2;
    let idx = 0;
    items.forEach((el, k) => {
      const r = el.getBoundingClientRect();
      if (r.top <= mid) idx = k;
      const f = clamp01((mid - r.top) / r.height);
      el.style.setProperty('--f', f.toFixed(3));
      if (bars[k]) bars[k].style.setProperty('--f', f.toFixed(3));
    });
    show(idx);
  };
  const loop = () => { update(); if (live) raf = requestAnimationFrame(loop); };
  new IntersectionObserver(([e]) => {
    live = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (live) raf = requestAnimationFrame(loop);
  }).observe(sec);
  update();
})();

/* Learner stories: one story large, the rest as a playlist. Built from the cards in the markup
   (each keeps its video id, still, learner, package and company); the big screen plays the video
   in place. */
(() => {
  const sec = document.querySelector('.lx');
  if (!sec) return;
  const stage = sec.querySelector('.lx__stage');
  const items = [...sec.querySelectorAll('.lx-item')].map(it => {
    const card = it.querySelector('.lx-card');
    const still = card.querySelector('img');
    const logo = it.querySelector('.lx-info__logo');
    return {
      id: card.getAttribute('data-yt'),
      label: card.getAttribute('aria-label') || '',
      still: still ? still.getAttribute('src') : '',
      avatar: (it.querySelector('.lx-info__avatar img') || {}).src || '',
      name: (it.querySelector('.lx-info__name') || {}).textContent || '',
      pill: (it.querySelector('.lx-info__pill') || {}).textContent || '',
      logo: logo ? logo.getAttribute('src') : '',
      logoAlt: logo ? logo.alt : ''
    };
  });
  if (!items.length) return;
  stage.classList.add('is-source');
  stage.setAttribute('aria-hidden', 'true');
  stage.querySelectorAll('button').forEach(b => b.tabIndex = -1);

  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wrap = document.createElement('div');
  wrap.className = 'lxp';
  wrap.innerHTML = `
    <div class="lxp-feature">
      <button class="lxp-screen" type="button"><img alt=""><span class="lxp-play"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></span></button>
      <div class="lxp-meta">
        <span class="lxp-av"><img alt=""></span>
        <span class="lxp-who"><span class="lxp-name"></span><span class="lxp-pill"></span></span>
        <img class="lxp-logo" alt="">
        <span class="lxp-count"></span>
      </div>
    </div>
    <ol class="lxp-list" aria-label="More learner stories">
      ${items.map((it, i) => `<li><button type="button" data-i="${i}" aria-current="false" aria-label="${esc(it.label)}">
        <span class="lxp-th"><img src="${esc(it.still)}" alt="" loading="lazy"></span>
        <span><b>${esc(it.name)}</b><small>${esc(it.pill)}</small></span></button></li>`).join('')}
    </ol>`;
  stage.after(wrap);

  const screen = wrap.querySelector('.lxp-screen');
  const img = screen.querySelector('img');
  const meta = {
    av: wrap.querySelector('.lxp-av img'), name: wrap.querySelector('.lxp-name'), pill: wrap.querySelector('.lxp-pill'),
    logo: wrap.querySelector('.lxp-logo'), count: wrap.querySelector('.lxp-count')
  };
  const rows = [...wrap.querySelectorAll('.lxp-list button')];
  let at = -1;
  const stop = () => { const f = screen.querySelector('iframe'); if (f) f.remove(); screen.classList.remove('is-playing'); };
  const pick = (i, scroll) => {
    if (i === at) return;
    at = i;
    stop();
    const it = items[i];
    screen.classList.add('is-swap');
    setTimeout(() => { img.src = it.still; screen.classList.remove('is-swap'); }, 160);
    screen.setAttribute('aria-label', 'Play video: ' + it.label);
    meta.av.src = it.avatar; meta.name.textContent = it.name; meta.pill.textContent = it.pill;
    meta.logo.src = it.logo; meta.logo.alt = it.logoAlt; meta.logo.hidden = !it.logo;
    meta.count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
    rows.forEach((r, k) => r.setAttribute('aria-current', String(k === i)));
    if (scroll) rows[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  rows.forEach((r, i) => r.addEventListener('click', () => pick(i, false)));
  screen.addEventListener('click', () => {
    if (screen.classList.contains('is-playing')) return;
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube.com/embed/' + items[at].id + '?autoplay=1&rel=0&playsinline=1&modestbranding=1';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.title = items[at].label;
    screen.append(f);
    screen.classList.add('is-playing');
  });
  sec.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' && e.target.closest('.lxp-list')) { e.preventDefault(); pick(Math.min(items.length - 1, at + 1), true); rows[at].focus(); }
    if (e.key === 'ArrowUp' && e.target.closest('.lxp-list')) { e.preventDefault(); pick(Math.max(0, at - 1), true); rows[at].focus(); }
  });
  img.src = items[0].still;
  pick(0, false);
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
