/* Masterclasses from Mentors — data, rendering, motion. */
(() => {
  // Content from ccbp.in → "Masterclasses from Mentors in the Community". Copy per Figma 778:1625.
  const MENTORS = [
    { name: 'Srividya Pranavi', img: 'srividya', role: 'Machine Learning Scientist', edu: 'Carnegie Mellon University, IIT Kharagpur' },
    { name: 'Sravya Nimmagadda', img: 'sravya', role: 'Senior Deep Learning Scientist, Autonomous Vehicles at NVIDIA', edu: 'Stanford, IIT Madras' },
    { name: 'Priyatham Bollimpalli', img: 'priyatham', role: 'Data & Applied Scientist II', edu: 'Carnegie Mellon University, IIT Guwahati' },
    { name: 'Vamsi Krishna', img: 'vamsi', role: 'AI & Quantum Computing, Google', edu: 'Georgia Institute of Technology, IIT Madras' },
  ];

  // Logos, trimmed from the ccbp.in logo wall (co-00…17) and the affiliation strip.
  const COMPANIES = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'VMware', 'Goldman Sachs',
    'PayPal', 'Samsung', 'Uber', 'Ola', 'Adobe', 'OYO',
    'Hotstar', 'Intel', 'NVIDIA', 'Walmart', 'Visa', 'eBay',
  ].map((name, i) => ({ name, src: `assets/masterclass/logos/co-${String(i).padStart(2, '0')}.png` }));

  const ICON = {
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18M11 12h2v2h-2z"/></svg>',
    cap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5M22 9v5"/></svg>',
  };
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const M = window.NWMotion;

  // ---- Mentor cards ----
  const list = document.querySelector('.mc__mentors');
  list.innerHTML = MENTORS.map((m, k) => `
    <li style="--k:${k};--fx:${(1.5 - k) * 110}%;--fr:${(k - 1.5) * 9}deg">
      <article class="mentor">
        <img class="mentor__avatar" src="assets/masterclass/avatar-${m.img}.jpg" alt="${esc(m.name)}" loading="lazy">
        <h3 class="mentor__name">${esc(m.name)}</h3>
        <div class="mentor__panel">
          <p class="mentor__row">${ICON.bag}<span>${esc(m.role)}</span></p>
          <p class="mentor__row">${ICON.cap}<span>${esc(m.edu)}</span></p>
        </div>
      </article>
    </li>`).join('');
  // the tickets are dealt out from the middle, one after another, as the row comes on screen
  M ? M.once(list, () => list.classList.add('is-in'), '0px 0px -12% 0px') : list.classList.add('is-in');

  // ---- Logo tickers: each set duplicated so translate −50% loops seamlessly ----
  const set = (l, hidden) => `<ul class="mc-ticker-set"${hidden ? ' aria-hidden="true"' : ''}>` +
    l.map((c) => `<li><img src="${c.src}" alt="${hidden ? '' : c.name}" decoding="async"></li>`).join('') + '</ul>';
  const row = (l, dir, dur) => `<div class="mc-ticker-row ${dir}" style="--tick-dur:${dur}s">${set(l)}${set(l, true)}</div>`;
  const DUR = [80, 92];
  document.querySelector('[data-ticker="companies"]').innerHTML = DUR.map((d, r) => {
    const l = COMPANIES.slice(r * 9, r * 9 + 9);
    return row(l.concat(l), r % 2 ? 'to-left' : 'to-right', d);
  }).join('');

  // ---- Video: swap the thumbnail for the YouTube player on click (the intro button plays it too) ----
  const video = document.querySelector('.mc__video');
  const film = document.querySelector('.mc__zoom');
  const play = () => {
    if (video.classList.contains('is-playing')) return;
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${video.dataset.yt}?autoplay=1&rel=0`;
    f.title = 'Sneak Peek Of Masterclass by Rakesh Misra';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    video.append(f);
    video.classList.add('is-playing');
    film.style.setProperty('--mc-z', 1);
  };
  video.addEventListener('click', play);
  document.querySelector('.mc__cta[data-play]').addEventListener('click', () => {
    play();
    video.scrollIntoView({ behavior: M && M.RM ? 'auto' : 'smooth', block: 'center' });
  });

  // ---- The round window opens out while the scroll holds it ----
  if (!M || M.RM) { film.style.setProperty('--mc-z', 1); return; }
  M.scene({
    el: film,
    read: () => M.pin(film),
    write: (p) => {
      if (video.classList.contains('is-playing')) return;
      const t = Math.min(1, p / .8);
      film.style.setProperty('--mc-z', (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2).toFixed(4));
    },
  });
})();
