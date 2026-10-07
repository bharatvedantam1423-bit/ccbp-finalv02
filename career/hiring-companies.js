/* NxtWave · Hiring companies marquee
   Builds the four logo rows inside every <section class="nw-hire">.
   Rows 1 & 3 drift left, rows 2 & 4 drift right, all at the same pace.
   Logo folder comes from the section's data-logo-path (default "logos/"). */
(function () {
  var ROWS = [
    [['google','Google'],['accenture','Accenture'],['deloitte','Deloitte'],['amazon','Amazon'],['bank-of-america','Bank of America'],['bosch','Bosch'],['nvidia','NVIDIA'],['samsung','Samsung'],['infosys','Infosys']],
    [['tcs','Tata Consultancy Services'],['jio','Jio'],['tech-mahindra','Tech Mahindra'],['goldman-sachs','Goldman Sachs'],['oracle','Oracle'],['wipro','Wipro'],['apollo','Apollo Hospitals'],['sap','SAP'],['capgemini','Capgemini']],
    [['cyient','Cyient'],['hcl','HCL'],['tata-elxsi','Tata Elxsi'],['needl-ai','needl.ai'],['fareportal','Fareportal'],['cognizant','Cognizant'],['cgi','CGI'],['merkle','Merkle Sokrati'],['mindtree','Mindtree']],
    [['delhivery','Delhivery'],['fractal','Fractal'],['napier','Napier Healthcare'],['gep','GEP'],['prodapt','Prodapt'],['tanla','Tanla'],['globallogic','GlobalLogic'],['ntt-data','NTT Data']]
  ];

  var SPEED = 42;                                   // px per second
  // size each logo by area (not a fixed box) so wide and square marks carry equal visual weight
  var AREA = 78 * 26.5 * 1.15 * 0.81, MAX_W = 108, MAX_H = 36;

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
    if (!host) return;
    var path = section.getAttribute('data-logo-path') || 'logos/';
    var cs = getComputedStyle(section);
    var cardW = parseFloat(cs.getPropertyValue('--nw-hire-card-w')) || 151.5;
    var gap = parseFloat(cs.getPropertyValue('--nw-hire-gap')) || 16;
    var need = Math.max(window.innerWidth, 1440) + cardW * 2;   // each half must outrun the viewport

    host.innerHTML = ROWS.map(function (logos, i) {
      var set = logos.slice();
      while (set.length * (cardW + gap) < need) set = set.concat(logos);
      // first pass is announced; repeats and the loop copy are hidden from screen readers
      var a = set.map(function (l, j) { return card(path, l, j >= logos.length); }).join('');
      var b = set.map(function (l) { return card(path, l, true); }).join('');
      var secs = (set.length * (cardW + gap)) / SPEED;
      return '<div class="nw-hire__row nw-hire__row--' + (i % 2 ? 'right' : 'left') + '">' +
        '<div class="nw-hire__track" style="--nw-hire-speed:' + secs.toFixed(1) + 's">' + a + b + '</div></div>';
    }).join('');

    host.querySelectorAll('img').forEach(function (img) {
      if (img.complete && img.naturalWidth) fit(img);
      else img.addEventListener('load', function () { fit(img); }, { once: true });
    });
  }

  function init() {
    var sections = document.querySelectorAll('.nw-hire');
    sections.forEach(build);
    var lastW = window.innerWidth;
    window.addEventListener('resize', function () {
      if (Math.abs(window.innerWidth - lastW) > 120) { lastW = window.innerWidth; sections.forEach(build); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
