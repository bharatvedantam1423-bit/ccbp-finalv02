/*
 * Career Transformations — the pinned, curved reel (vanilla JS; uses NWMotion from career/motion.js).
 * Boots every element with [data-career-transformations]. Asset base path comes from
 * data-assets (default "assets/career-transformations/").
 * Every learner appears once: video stories take a column of their own, text stories pair up.
 */
(() => {
  function init(root) {
    if (root.dataset.ctwReady) return;
    root.dataset.ctwReady = '1';
    let A = root.dataset.assets || 'assets/career-transformations/';
    if (!A.endsWith('/')) A += '/';

    const VIDEOS = [
      { id: 'v01', name: 'Harshitha Nallapu', logo: 'cognizant',   lpa: '7.5 LPA' },
      { id: 'v02', name: 'Sravani Komatla',   logo: 'infosys',     lpa: '6.5 LPA' },
      { id: 'v03', name: 'Yashwanth Kodeti',  logo: 'deloitte',    lpa: '12 LPA'  },
      { id: 'v04', name: 'Deepthi Raavi',     logo: 'fractal',     lpa: '9 LPA'   },
      { id: 'v05', name: 'Manohar Gaddam',    logo: 'tcs',         lpa: '5.5 LPA' },
      { id: 'v06', name: 'Lavanya Bollam',    logo: 'capgemini',   lpa: '8 LPA'   },
      { id: 'v07', name: 'Ramesh Dandu',      logo: 'techm',       lpa: '6 LPA'   },
      { id: 'v08', name: 'Keerthi Vangala',   logo: 'globallogic', lpa: '10 LPA'  }
    ];
    const QUOTES = [
      { p: 'a01', name: 'Nikhil Varma',        logo: 'delhivery',   lpa: '11 LPA',   q: 'I stopped learning in tutorials and started shipping. Six projects later the interviews felt like a normal work day.' },
      { p: 'a02', name: 'Ananya Pilla',        logo: 'needl',       lpa: '9.5 LPA',  q: 'Coming from a non-tech degree I expected to be lost. The fundamentals track meant I never had to fake understanding something.' },
      { p: 'a03', name: 'Sai Charan Gurram',   logo: 'bosch',       lpa: '6 LPA',    q: 'The mock rounds were harsher than the real ones. Blunt feedback on the same evening is what actually changed my answers.' },
      { p: 'a04', name: 'Pooja Rachamalla',    logo: 'cyient',      lpa: '7 LPA',    q: 'I was working a support shift through all of it. Sessions were recorded, doubts cleared same day, so I never fell a week behind.' },
      { p: 'a05', name: 'Divya Vardhan',       logo: 'prodapt',     lpa: '8.5 LPA',  q: 'My mentor reviewed every submission properly. Not a rubber stamp, actual comments on why a decision was wrong.' },
      { p: 'a06', name: 'Arjun Tadepalli',     logo: 'nttdata',     lpa: '10 LPA',   q: 'DSA was the wall I kept hitting alone. Doing it daily with people at the same stage is what finally got me past it.' },
      { p: 'a07', name: 'Vamsi Kurapati',      logo: 'mindtree',    lpa: '6.5 LPA',  q: 'Nothing in the curriculum felt like filler by the time I reached the interviews. It tracked what companies were asking that year.' },
      { p: 'a08', name: 'Sandeep Mallela',     logo: 'hcl',         lpa: '5 LPA',    q: 'I had a gap year I could not explain away. The portfolio gave the conversation somewhere else to go.' },
      { p: 'a09', name: 'Bhavana Reddy',       logo: 'sap',         lpa: '12 LPA',   q: 'Resume shortlists came first, then the calls. Knowing what each company screens for changed where I applied.' },
      { p: 'a10', name: 'Rakesh Pothula',      logo: 'tanla',       lpa: '7.5 LPA',  q: 'What I did not expect was the peer group. Being around people grinding the same problems kept me honest on the slow weeks.' },
      { p: 'a11', name: 'Sruthi Kolli',        logo: 'capgemini',   lpa: '6 LPA',    q: 'Six months in I had a portfolio that read like a junior engineer, not a student. That is what got the first callback.' },
      { p: 'a12', name: 'Praneeth Yalamanchi', logo: 'accenture',   lpa: '8 LPA',    q: 'The interview prep was the difference. Rounds with people who actually hire, and an honest debrief afterwards.' },
      { p: 'a13', name: 'Harika Mandadi',      logo: 'merkle',      lpa: '9 LPA',    q: 'I switched from a BPO floor to engineering at twenty-seven. It took longer than the brochure says, but the path was never unclear.' },
      { p: 'a14', name: 'Chaitanya Burla',     logo: 'oracle',      lpa: '14 LPA',   q: 'Systems design was the part I thought I could skip. The two rounds that decided my offer were both design rounds.' },
      { p: 'a15', name: 'Meghana Jupally',     logo: 'techm',       lpa: '5.5 LPA',  q: 'I built the same project three times before it was good enough to talk about line by line. Nobody let me stop at the first version.' },
      { p: 'a16', name: 'Tarun Addanki',       logo: 'gep',         lpa: '8.5 LPA',  q: 'My college had no placement drive worth the name. The hiring network is the only reason I sat in front of a panel at all.' },
      { p: 'a17', name: 'Swathi Nagineni',     logo: 'deloitte',    lpa: '11.5 LPA', q: 'Two offers came in the same week after fourteen months of nothing. The difference was finally having work to show.' },
      { p: 'a18', name: 'Kiran Pasupuleti',    logo: 'infosys',     lpa: '5 LPA',    q: 'I am the first in my family to take a tech job. Nobody at home could tell me what a good answer sounded like. Here somebody could.' },
      { p: 'a19', name: 'Navya Thotakura',     logo: 'cognizant',   lpa: '6.5 LPA',  q: 'The weekly review was the part I dreaded and the part that worked. Someone looked at my code and said what was wrong with it.' },
      { p: 'a20', name: 'Abhiram Kodali',      logo: 'globallogic', lpa: '9.5 LPA',  q: 'I came in able to write code and unable to explain it. Six months of talking through my own work fixed that.' },
      { p: 'a21', name: 'Lakshmi Pendyala',    logo: 'tcs',         lpa: '5.5 LPA',  q: 'I finished my degree in 2022 and sat at home for a year. Having a schedule again mattered as much as the syllabus did.' },
      { p: 'a22', name: 'Vikas Chennupati',    logo: 'nttdata',     lpa: '10.5 LPA', q: 'Every round I failed got written down and worked on. By the fifth company the same questions were not catching me out.' },
      { p: 'a23', name: 'Ramya Settipalli',    logo: 'capgemini',   lpa: '7 LPA',    q: 'I was told a non-CS degree would close the door. It did, at some places. Enough of the others opened that it stopped mattering.' },
      { p: 'a24', name: 'Mahesh Konduru',      logo: 'mindtree',    lpa: '6 LPA',    q: 'The projects were the whole interview. I spent forty minutes on one I had built and never touched a puzzle question.' }
    ];

    const PLAY_ICON = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5.2v9.6a.6.6 0 0 0 .92.5l7.4-4.8a.6.6 0 0 0 0-1L7.92 4.7A.6.6 0 0 0 7 5.2Z" fill="#0f172a"/></svg>';

    const textCard = d => `
      <article class="ctw-card-text">
        <div class="ctw-top">
          <div class="ctw-avatar"><img src="${A}p/${d.p}.jpg" alt="" loading="lazy"></div>
          <span class="ctw-pill">₹${d.lpa}</span>
        </div>
        <div class="ctw-who">
          <p class="ctw-name">${d.name}</p>
          <img class="ctw-logo" src="${A}logos/${d.logo}.png" alt="${d.logo}" loading="lazy">
        </div>
        <p class="ctw-quote">${d.q}</p>
      </article>`;

    const videoCard = d => `
      <article class="ctw-card-video" data-video="${A}v/${d.id}.mp4">
        <img class="ctw-still" src="${A}v/${d.id}.jpg" alt="" loading="lazy">
        <div class="ctw-shade"></div>
        <div class="ctw-play">${PLAY_ICON}</div>
        <div class="ctw-overlay">
          <div class="ctw-who">
            <p class="ctw-name">${d.name}</p>
            <img class="ctw-logo" src="${A}logos/w/${d.logo}.png" alt="${d.logo}" loading="lazy">
          </div>
          <span class="ctw-pill">₹${d.lpa}</span>
        </div>
      </article>`;

    // four columns, each with two video capsules among six speech bubbles; every learner appears once.
    // Each column holds its stories twice so the drift can loop without a seam.
    const track = root.querySelector('.ctw-images');
    const COLS = innerWidth < 900 ? 2 : 4;
    const cols = Array.from({ length: COLS }, () => []);
    let qi = 0, vi = 0;
    for (let n = 0; qi < QUOTES.length || vi < VIDEOS.length; n++) {
      // a video at one place in every row of four, stepping a column each row: two per column
      const video = vi < VIDEOS.length && (n % 4 === Math.floor(n / 4) % 4 || qi >= QUOTES.length);
      cols[n % COLS].push(video ? videoCard(VIDEOS[vi++]) : textCard(QUOTES[qi++]));
    }
    track.innerHTML = cols.map(list => {
      const once = list.join('');
      const copy = once.replace(/<article /g, '<article aria-hidden="true" ');
      return `<div class="ctw-col"><div class="ctw-track">${once}${copy}</div></div>`;
    }).join('');

    // video stories play muted and looping while on screen, and pause when they leave
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const playIO = !reduce && 'IntersectionObserver' in window && new IntersectionObserver(entries => {
      for (const { target: card, isIntersecting } of entries) {
        let v = card.querySelector('video');
        if (isIntersecting) {
          if (!v) {
            v = document.createElement('video');
            v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
            v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
            v.preload = 'auto'; v.src = card.dataset.video;
            card.insertBefore(v, card.querySelector('.ctw-shade'));
          }
          v.play().then(() => card.classList.add('ctw-playing')).catch(() => {});
        } else if (v) v.pause();
      }
    }, { threshold: 0.25 });
    if (playIO) root.querySelectorAll('.ctw-card-video').forEach(card => playIO.observe(card));

    const M = window.NWMotion;
    if (!M || M.RM || !track.animate) return;

    // the drift: odd columns rise, even columns fall, each at its own pace
    const PACE = [38, 30, 44, 34];               // px per second
    let anims = [];
    const build = () => {
      anims.forEach(a => a.cancel());
      anims = [...track.querySelectorAll('.ctw-track')].map((t, i) => {
        const half = t.scrollHeight / 2 + 8;
        const a = t.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-half}px)` }],
          { duration: half / PACE[i % PACE.length] * 1000, iterations: Infinity, direction: i % 2 ? 'reverse' : 'normal' });
        a.currentTime = (i * 5231) % (half / PACE[i % PACE.length] * 1000);
        return a;
      });
    };
    build();
    addEventListener('load', build);

    let rate = 1, hover = false;
    root.addEventListener('pointerenter', () => { hover = true; });
    root.addEventListener('pointerleave', () => { hover = false; });
    M.scene({
      el: root,
      read: () => M.progress(root, 1, -.6),
      write: (p, f) => {
        root.style.setProperty('--ctw-lean', (1 - p * .7).toFixed(4));
        const want = (hover ? .35 : 1) + Math.min(5, Math.abs(f.vel) / 6);
        rate += (want - rate) * .08;
        anims.forEach(a => { a.playbackRate = rate; });
      },
    });
  }

  const boot = () => document.querySelectorAll('[data-career-transformations]').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
