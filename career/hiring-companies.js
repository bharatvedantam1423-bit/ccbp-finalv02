/* NxtWave · 3,000+ companies hire NxtWave learners
   Builds the four logo rows inside every <section class="nw-hire">: rows 1 & 3 drift left, rows 2 & 4
   right, at the same pace. The drift runs on Web Animations so the scroll can push it: scrolling past
   quickly speeds the rows up and they ease back to their own pace. The plane they sit on stands up
   as the section scrolls in, and the count in the heading runs up to 3,000 when it arrives.
   Logo folder comes from the section's data-logo-path (default "logos/"). */
(function () {
  var ROWS = [
    [['google','Google'],['accenture','Accenture'],['deloitte','Deloitte'],['amazon','Amazon'],['bank-of-america','Bank of America'],['bosch','Bosch'],['nvidia','NVIDIA'],['samsung','Samsung'],['infosys','Infosys']],
    [['tcs','Tata Consultancy Services'],['jio','Jio'],['tech-mahindra','Tech Mahindra'],['goldman-sachs','Goldman Sachs'],['oracle','Oracle'],['wipro','Wipro'],['apollo','Apollo Hospitals'],['sap','SAP'],['capgemini','Capgemini']],
    [['cyient','Cyient'],['hcl','HCL'],['tata-elxsi','Tata Elxsi'],['needl-ai','needl.ai'],['fareportal','Fareportal'],['cognizant','Cognizant'],['cgi','CGI'],['merkle','Merkle Sokrati'],['mindtree','Mindtree']],
    [['delhivery','Delhivery'],['fractal','Fractal'],['napier','Napier Healthcare'],['gep','GEP'],['prodapt','Prodapt'],['tanla','Tanla'],['globallogic','GlobalLogic'],['ntt-data','NTT Data']]
  ];

  var SPEED = 38;                                   // px per second at rest
  var AREA = 78 * 26.5 * 1.15 * 0.81, MAX_W = 108, MAX_H = 36;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fit(img) {
    var ar = img.naturalWidth / img.naturalHeight || 3;
    var w = Math.sqrt(AREA * ar);
    if (w / ar > MAX_H) w = MAX_H * ar;
    img.style.setProperty('--w', Math.min(w, MAX_W).toFixed(1));
  }

  function card(path, logo, hidden) {
    return '<div class="nw-hire__card"' + (hidden ? ' aria-hidden="true"' : '') + '>' +
      '<img src="' + path + logo[0] + '.svg" alt="' + (hidden ? '' : logo[1]) + '" decoding="async"></div>';
  }

  function build(section) {
    var host = section.querySelector('.nw-hire__rows');
    if (!host) return [];
    (section._anims || []).forEach(function (a) { a.cancel(); });
    var path = section.getAttribute('data-logo-path') || 'logos/';
    var cs = getComputedStyle(section);
    var cardW = parseFloat(cs.getPropertyValue('--nw-hire-card-w')) || 151.5;
    var gap = parseFloat(cs.getPropertyValue('--nw-hire-gap')) || 16;
    var need = Math.max(window.innerWidth, 1440) * 1.3 + cardW * 2;   // the tipped plane shows more than the screen

    host.innerHTML = ROWS.map(function (logos) {
      var set = logos.slice();
      while (set.length * (cardW + gap) < need) set = set.concat(logos);
      var a = set.map(function (l, j) { return card(path, l, j >= logos.length); }).join('');
      var b = set.map(function (l) { return card(path, l, true); }).join('');
      return '<div class="nw-hire__row"><div class="nw-hire__track">' + a + b + '</div></div>';
    }).join('');

    host.querySelectorAll('img').forEach(function (img) {
      if (img.complete && img.naturalWidth) fit(img);
      else img.addEventListener('load', function () { fit(img); }, { once: true });
    });

    if (RM || !host.animate) return (section._anims = []);
    section._anims = [].map.call(host.querySelectorAll('.nw-hire__track'), function (t, i) {
      var half = t.scrollWidth / 2 + gap / 2;
      var anim = t.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(' + (-half) + 'px)' }],
        { duration: half / SPEED * 1000, iterations: Infinity, direction: i % 2 ? 'reverse' : 'normal' });
      anim.currentTime = (i * 7919) % (half / SPEED * 1000);   // rows start at different points
      return anim;
    });
    return section._anims;
  }

  // the count runs up to the number written in the heading
  function count(el) {
    var end = parseInt(el.textContent.replace(/\D/g, ''), 10) || 0;
    if (RM || !end) return;
    var fmt = function (n) { return n.toLocaleString('en-US'); };
    el.style.minWidth = el.offsetWidth + 'px';
    el.textContent = '0';
    var t0 = 0, D = 1600;
    var step = function (t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 4);
      el.textContent = fmt(Math.round(end * e));
      if (k < 1) requestAnimationFrame(step); else el.style.minWidth = '';
    };
    requestAnimationFrame(step);
  }

  function init() {
    var sections = document.querySelectorAll('.nw-hire');
    sections.forEach(build);
    var lastW = window.innerWidth;
    window.addEventListener('resize', function () {
      if (Math.abs(window.innerWidth - lastW) > 120) { lastW = window.innerWidth; sections.forEach(build); }
    });

    var M = window.NWMotion;
    sections.forEach(function (sec) {
      var num = sec.querySelector('.nw-hire__num');
      if (num && M) M.once(num, function () { setTimeout(function () { count(num); }, 250); });
      if (!M || M.RM) { sec.style.setProperty('--nw-tilt', 0); return; }
      var stage = sec.querySelector('.nw-hire__stage');
      var rate = 1;
      M.scene({
        el: sec,
        read: function () { return M.progress(stage, 1, .38); },
        write: function (p, f) {
          var e = 1 - Math.pow(1 - p, 3);
          sec.style.setProperty('--nw-tilt', (1 - e).toFixed(4));
          // scroll speed leans on the drift, then lets go
          var want = 1 + Math.min(5, Math.abs(f.vel) / 6);
          rate += (want - rate) * 0.08;
          (sec._anims || []).forEach(function (a) { a.playbackRate = rate; });
        },
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
