/* NxtWave · 3,000+ companies hire NxtWave learners (variation 2) — the orbits.
   Every logo from ROWS becomes a round badge on one of three tilted orbits around the heading. Each
   frame the badges are placed on their ellipse; the orbit's back half sits behind the heading, smaller
   and fainter, so the rings read in depth. The orbits open out from the middle as the section comes
   up, turn on their own, alternate ways, and spin a little faster while the page is scrolled quickly.
   Logo folder comes from the section's data-logo-path (default "logos/"). */
(function () {
  var ROWS = [
    [['google','Google'],['accenture','Accenture'],['deloitte','Deloitte'],['amazon','Amazon'],['bank-of-america','Bank of America'],['bosch','Bosch'],['nvidia','NVIDIA'],['samsung','Samsung'],['infosys','Infosys']],
    [['tcs','Tata Consultancy Services'],['jio','Jio'],['tech-mahindra','Tech Mahindra'],['goldman-sachs','Goldman Sachs'],['oracle','Oracle'],['wipro','Wipro'],['apollo','Apollo Hospitals'],['sap','SAP'],['capgemini','Capgemini']],
    [['cyient','Cyient'],['hcl','HCL'],['tata-elxsi','Tata Elxsi'],['needl-ai','needl.ai'],['fareportal','Fareportal'],['cognizant','Cognizant'],['cgi','CGI'],['merkle','Merkle Sokrati'],['mindtree','Mindtree']],
    [['delhivery','Delhivery'],['fractal','Fractal'],['napier','Napier Healthcare'],['gep','GEP'],['prodapt','Prodapt'],['tanla','Tanla'],['globallogic','GlobalLogic'],['ntt-data','NTT Data']]
  ];
  var ALL = [].concat.apply([], ROWS);
  // three orbits: [share of the box's half-width, half-height, badges on it, turns per minute, badge size]
  var ORBITS = [[.28, .25, 9, 1.4, 84], [.38, .35, 12, -1.0, 96], [.48, .45, 14, .75, 106]];
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var sec = document.querySelector('.nw-hire');
    if (!sec) return;
    var host = sec.querySelector('.nw-hire__orbits');
    var sky = sec.querySelector('.nw-hire__sky');
    var path = sec.getAttribute('data-logo-path') || 'logos/';
    var badges = [], k = 0;
    ORBITS.forEach(function (o, ring) {
      for (var j = 0; j < o[2] && k < ALL.length; j++, k++) {
        var li = document.createElement('li');
        li.className = 'nw-hire__badge';
        li.style.setProperty('--b', o[4] + 'px');
        li.innerHTML = '<img src="' + path + ALL[k][0] + '.svg" alt="' + ALL[k][1] + '" decoding="async">';
        host.appendChild(li);
        badges.push({ el: li, ring: ring, a0: (j / o[2]) * Math.PI * 2 + ring * .4 });
      }
    });

    var W = 0, H = 0, small = false;
    var measure = function () { W = sky.clientWidth; H = sky.clientHeight; small = innerWidth < 760; };
    measure();
    addEventListener('resize', measure);

    var M = window.NWMotion, spin = 0, last = performance.now(), boost = 1, open = RM ? 1 : 0;
    var place = function () {
      for (var i = 0; i < badges.length; i++) {
        var b = badges[i], o = ORBITS[b.ring];
        var a = b.a0 + spin * o[3];
        // on a phone the orbits stand upright (taller than wide)
        var rx = (small ? o[1] * 1.15 : o[0]) * W, ry = (small ? o[0] * 1.15 : o[1]) * H;
        var r = .25 + .75 * open;                 // open out from the middle
        var x = W / 2 + Math.cos(a) * rx * r, y = H / 2 + Math.sin(a) * ry * r;
        var depth = (Math.sin(a) + 1) / 2;         // 0 at the back (top), 1 at the front (bottom)
        var s = (small ? .5 : .72) + depth * (small ? .3 : .38);
        b.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + (s * (.6 + .4 * open)).toFixed(3) + ')';
        b.el.style.opacity = ((.35 + depth * .65) * open).toFixed(3);
        b.el.style.zIndex = depth > .5 ? 60 : 10;  // the front half passes in front of the heading
      }
    };
    if (RM || !M) { place(); return; }

    M.scene({
      el: sec,
      read: function () { return M.progress(sky, 1, .25); },
      write: function (p, f) {
        var now = performance.now(), dt = Math.min(64, now - last) / 1000; last = now;
        boost += ((1 + Math.min(6, Math.abs(f.vel) / 5)) - boost) * .06;
        spin += dt * (Math.PI * 2 / 60) * boost;       // one turn a minute at rest, scaled per orbit
        open = 1 - Math.pow(1 - p, 3);
        sec.style.setProperty('--nw-open', open.toFixed(3));
        place();
      },
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
