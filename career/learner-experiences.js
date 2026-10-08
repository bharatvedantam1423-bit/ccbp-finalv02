/* NxtWave Learner's Experiences: lens carousel with inline YouTube playback.
   - Cards grow toward the centre (Figma CCBP-v02 1177:3797: centre 667.8px, resting 507.8px at the
     1440 frame), always 32px apart. Under each video sits the learner row (photo, name, package, company).
   - Drag, horizontal swipe or trackpad, and arrow keys move it. Vertical wheel scrolls the page as normal.
   - Clicking the centre card plays its video inside the card. Clicking a side card glides it
     to the centre and plays it there. Moving away stops the video.
   Works on every .lx section on the page. No dependencies. */
(function () {
  'use strict';

  var CFG = {
    itemWidth: 507.79,    // resting card width (px) at the 1440 frame; centre card = itemWidth * activeScale
    frame: 1440,          // the design width: below it (down to tablets) the cards scale with the window
    ratio: 292 / 520,     // video height : width, as in the file
    gap: 32,              // exact space between neighbouring cards
    activeScale: 667.81 / 507.79,
    infoGap: 24,          // video → learner row
    infoH: 56,            // learner row height (the photo)
    infoSide: 0.947,      // the row on a resting card is drawn at 94.7% (it barely shrinks with the card)
    infoMin: 0.72,        // smallest row scale, for tablets and phones
    scaleRadius: 500,     // px over which cards shrink back to resting size
    dragFriction: 1.2,
    ease: 0.08,           // per-frame easing at 60fps
    snapDelay: 160        // ms after the last wheel event before settling on a card
  };

  function wrap(v, m) { return ((v % m) + m) % m; }

  function init(section) {
    var stage = section.querySelector('.lx__stage');
    var items = Array.prototype.slice.call(stage.querySelectorAll('.lx-item'));
    var N = items.length;
    if (!N) return;

    var els = items.map(function (item) {
      var card = item.querySelector('.lx-card');
      if (!card.querySelector('.lx-card__play')) {
        var p = document.createElement('span');
        p.className = 'lx-card__play';
        p.setAttribute('aria-hidden', 'true');
        card.appendChild(p);
      }
      return { item: item, card: card, id: card.getAttribute('data-yt'), w: 0, s: 1, x: 0 };
    });

    /* ---------- sizing ---------- */
    var W = 0, itemW = 0, itemH = 0, gap = CFG.gap, span = 1, g = 1, kBase = 1, stageH = 0;
    var target = 0, pos = 0;

    function measure() {
      W = stage.clientWidth;
      var centre = CFG.itemWidth * CFG.activeScale;
      if (W < CFG.frame) centre = W < 810 ? W : centre * W / CFG.frame;     // below the frame, keep its proportions
      centre = Math.min(centre, W - 32);                                     // centre card keeps a 16px gutter
      itemW = centre / CFG.activeScale;
      itemH = itemW * CFG.ratio;
      span = itemW + gap;
      g = Math.max(0.001, (CFG.scaleRadius * itemW / CFG.itemWidth) / span);
      kBase = Math.max(CFG.infoMin, Math.min(1, centre / (CFG.itemWidth * CFG.activeScale)));
      stageH = itemH * CFG.activeScale + kBase * (CFG.infoGap + CFG.infoH);
      stage.style.height = stageH + 'px';
    }

    // learner-row scale: full size on the centre card, a touch smaller on resting ones
    function infoAt(s) {
      var p = (s - 1) / (CFG.activeScale - 1);
      return kBase * (CFG.infoSide + (1 - CFG.infoSide) * p);
    }

    function scaleAt(t) {
      t = Math.abs(t);
      return t <= g ? 1 + (CFG.activeScale - 1) * (1 - t / g) : 1;
    }

    /* ---------- layout ---------- */
    var nearest = 0;
    function render() {
      var h = pos / span, i, j;
      for (i = 0; i < N; i++) {
        els[i].w = wrap(i - h + N / 2, N) - N / 2;
        els[i].s = scaleAt(els[i].w);
      }
      var sorted = els.slice().sort(function (a, b) { return a.w - b.w; });
      // anchor = card in [0, 1): it slides from the centre slot to the next one as the strip moves
      var k = 0;
      for (j = 0; j < sorted.length; j++) { if (sorted[j].w >= 0) { k = j; break; } }
      var a = sorted[k];
      a.x = a.w * (gap + itemW * (scaleAt(0) + a.s) / 2);
      for (j = k + 1; j < sorted.length; j++) sorted[j].x = sorted[j - 1].x + itemW * (sorted[j - 1].s + sorted[j].s) / 2 + gap;
      for (j = k - 1; j >= 0; j--) sorted[j].x = sorted[j + 1].x - itemW * (sorted[j + 1].s + sorted[j].s) / 2 - gap;

      var best = Infinity;
      for (i = 0; i < N; i++) {
        var el = els[i], cw = itemW * el.s, ch = itemH * el.s, k = infoAt(el.s);
        var bh = ch + k * (CFG.infoGap + CFG.infoH), st = el.card.style, it = el.item.style;
        st.width = cw + 'px';
        st.height = ch + 'px';
        st.setProperty('--lx-s', (cw * 0.157) + 'px');          // play disc: 105px on the 667.8px card
        it.width = cw + 'px';
        it.setProperty('--lx-k', k.toFixed(4));
        // the whole block (video + learner row) is centred on the stage, as in the file
        it.transform = 'translate3d(' + (W / 2 + el.x - cw / 2) + 'px,' + ((stageH - bh) / 2) + 'px,0)';
        // only cards near the screen are reachable by keyboard
        el.card.tabIndex = Math.abs(el.w) < 0.5 ? 0 : -1;
        if (Math.abs(el.w) < best) { best = Math.abs(el.w); nearest = i; }
      }
    }

    /* ---------- inline video ---------- */
    var playing = -1, pending = -1;
    function play(i) {
      if (playing === i) return;
      stop();
      var el = els[i], f = document.createElement('iframe');
      f.src = 'https://www.youtube.com/embed/' + el.id + '?autoplay=1&rel=0&playsinline=1&modestbranding=1';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      f.title = el.card.getAttribute('aria-label') || 'Learner video';
      el.card.appendChild(f);
      el.card.classList.add('is-playing');
      playing = i;
    }
    function stop() {
      if (playing < 0) return;
      var card = els[playing].card, f = card.querySelector('iframe');
      if (f) f.remove();
      card.classList.remove('is-playing');
      playing = -1;
    }

    /* ---------- input ---------- */
    var dragging = false, startX = 0, startTarget = 0, moved = 0, snapTimer = 0;
    function snap() { target = Math.round(target / span) * span; wake(); }

    stage.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true; moved = 0; pending = -1;
      startX = e.clientX; startTarget = target;
      stage.classList.add('is-dragging');
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      moved = Math.max(moved, Math.abs(e.clientX - startX));
      target = startTarget + (startX - e.clientX) * CFG.dragFriction;
      wake();
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      if (moved < 6 && e.type === 'pointerup') onTap(e); else snap();
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);

    // horizontal wheel / trackpad swipe moves the carousel; vertical wheel scrolls the page
    stage.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      var unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? W : 1;
      target += e.deltaX * unit;
      pending = -1;
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snap, CFG.snapDelay);
      wake();
    }, { passive: false });

    section.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { target = (Math.round(target / span) + 1) * span; pending = -1; wake(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { target = (Math.round(target / span) - 1) * span; pending = -1; wake(); e.preventDefault(); }
      else if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('lx-card')) {
        e.preventDefault(); play(nearest);
      }
    });

    function onTap(e) {
      var hit = document.elementFromPoint(e.clientX, e.clientY);
      hit = hit && hit.closest ? hit.closest('.lx-item') : null;
      var i = -1;
      for (var j = 0; j < N; j++) if (els[j].item === hit) i = j;
      if (i < 0) return;
      if (i === nearest && Math.abs(els[i].w) < 0.5) { snap(); play(i); }
      else { target = Math.round((pos + els[i].w * span) / span) * span; pending = i; wake(); }   // glide, then play
    }

    /* ---------- loop (runs only while moving and on screen) ---------- */
    var raf = 0, last = 0, visible = true;
    function tick(now) {
      raf = 0;
      var dt = last ? Math.min(64, now - last) : 16; last = now;
      pos += (target - pos) * (1 - Math.pow(1 - CFG.ease, dt / (1000 / 60)));
      var settled = Math.abs(target - pos) < 0.01;
      if (settled) pos = target;
      render();
      if (playing >= 0 && Math.abs(els[playing].w) > 0.5) stop();     // moved away: back to thumbnail
      if (pending >= 0 && Math.abs(target - pos) < 1 && nearest === pending) { play(pending); pending = -1; }
      if (!settled || dragging) raf = requestAnimationFrame(tick); else last = 0;
    }
    function wake() { if (!raf && visible) raf = requestAnimationFrame(tick); }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) wake(); else stop();      // stop the video when the section scrolls away
      }).observe(section);
    }
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        measure();
        target = pos = Math.round(pos / span) * span;
        render();
      }).observe(stage);
    }

    measure();
    render();
  }

  function boot() {
    var sections = document.querySelectorAll('.lx');
    for (var i = 0; i < sections.length; i++) init(sections[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
