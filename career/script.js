/* "Meet NxtWave Partners" playlist (first 10). img = portrait crop of the YouTube thumbnail, 9:16. id opens the video in the modal.
   logo = company mark in assets/hiring-logos (taken from each company's own site); without one the company name is set as a wordmark. */
const TESTIMONIALS = [
  { id: "K_mIDRkBEGw", name: "Chaitanya Arikati",   role: "Head of Talent Acquisition", co: "Abjayon",              logo: "abjayon.svg", dur: "1:42" },
  { id: "LIb3_AyZ_wQ", name: "Raja Sekhar",         role: "Senior HR Executive",        co: "West Agile Labs",                            dur: "2:11" },
  { id: "hUfEOmF9TaQ", name: "Pavan Kumar",         role: "Founder & CEO",              co: "ProCorp",              logo: "procorp.png", dur: "1:53" },
  { id: "6EiBJ37MMFc", name: "Vinay Nawale",        role: "Head of Human Resources",    co: "GS Tech Technologies",                       dur: "1:37" },
  { id: "f1k5caShuOY", name: "Gopal Parvathaneni",  role: "Chairman & CEO",             co: "EPSoft",               logo: "epsoft.png",  dur: "1:33" },
  { id: "cYa8QopFaEY", name: "Vasu Adunutula",      role: "Co-Founder",                 co: "Cybersophy",                                 dur: "1:11" },
  { id: "_D9WGUpBZsM", name: "Vamshi Priya",        role: "HR Recruiter",               co: "Tvisha",               logo: "tvisha.png",  dur: "2:03" },
  { id: "zApgysr1Dqk", name: "Omkar Tadepalli",     role: "MD & CEO",                   co: "Caprus IT",            logo: "caprus.png",  dur: "1:50" },
  { id: "G7k29X1Q5V8", name: "Pradeep Kanneganti",  role: "CEO & Founder",              co: "Coretek Labs",         logo: "coretek.svg", dur: "2:12" },
  { id: "Bltckr4HX-w", name: "Anukriti Rai",        role: "Solutions Engineer",         co: "Nuron",                                      dur: "1:37" },
].map((t, i) => ({ ...t, img: `assets/people/hp${String(i + 1).padStart(2, "0")}.jpg` }));

const track = document.getElementById("ht-track");
const PLAY = '<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>';

/* A coverflow. The partner at the front is large, the others step
   back to either side, turned away. Their name, role and company show under the front portrait.
   The front moves on by itself every few seconds while the section is on screen (held while the
   pointer is over it), and follows the arrows, a swipe, a click on a side portrait, or the arrow keys.
   A click on the front portrait plays the video. */
track.innerHTML = TESTIMONIALS.map((t, i) => `
  <li class="ht__card" style="--i:${i}">
    <button class="ht__media" data-id="${t.id}" aria-label="Play: ${t.name}, ${t.role}, ${t.co}">
      <img src="${t.img}" alt="${t.name}" ${i > 3 ? 'loading="lazy"' : ""} decoding="async">
      <span class="ht__play">${PLAY}</span><span class="ht__dur">${t.dur}</span>
    </button>
    <div class="ht__label"><p class="ht__name">${t.name}</p><p class="ht__role">${t.role}</p>
      <p class="ht__co">${t.logo ? `<img src="assets/hiring-logos/${t.logo}" alt="${t.co}" loading="lazy">` : `<span>${t.co}</span>`}</p></div>
  </li>`).join("");

const cards = [...track.children];
const fitLogo = im => { const r = im.naturalWidth / im.naturalHeight || 3;
  im.style.height = Math.min(44, Math.max(24, Math.sqrt(3800 / r)), 190 / r) + "px"; };
track.querySelectorAll(".ht__co img").forEach(im => im.complete ? fitLogo(im) : im.addEventListener("load", () => fitLogo(im), { once: true }));

const N = cards.length;
let at = 0;
const place = () => cards.forEach((c, i) => {
  let d = i - at;
  if (d > N / 2) d -= N; if (d < -N / 2) d += N;          // the shortest way round, so it loops
  c.style.setProperty("--d", d);
  c.style.setProperty("--ad", Math.abs(d));
  c.classList.toggle("is-front", d === 0);
  c.setAttribute("aria-hidden", Math.abs(d) > 2 ? "true" : "false");
  c.querySelector(".ht__media").tabIndex = d === 0 ? 0 : -1;
});
const go = i => { at = (i + N) % N; place(); };
place();

const [prev, next] = document.querySelectorAll(".ht__arrow");
prev.addEventListener("click", () => { go(at - 1); restart(); });
next.addEventListener("click", () => { go(at + 1); restart(); });
const rail = document.querySelector(".ht__rail");
rail.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") { go(at - 1); restart(); }
  if (e.key === "ArrowRight") { go(at + 1); restart(); }
});

/* swipe / drag */
let down = null, moved = false;
track.addEventListener("pointerdown", e => { down = { x: e.clientX }; moved = false; });
addEventListener("pointerup", e => {
  if (!down) return;
  const dx = e.clientX - down.x; down = null;
  if (Math.abs(dx) > 40) { moved = true; go(at + (dx < 0 ? 1 : -1)); restart(); }
});

/* on its own, every few seconds, while on screen and not pointed at */
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
let timer = 0, onScreen = false, held = false;
const restart = () => { clearInterval(timer); if (!RM && onScreen && !held) timer = setInterval(() => go(at + 1), 4200); };
rail.addEventListener("pointerenter", () => { held = true; restart(); });
rail.addEventListener("pointerleave", () => { held = false; restart(); });
if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; restart(); }, { threshold: .35 }).observe(rail);

/* the row arrives: the portraits rise from below, front first */
if (window.NWMotion && !RM) NWMotion.once(rail, () => rail.classList.add("is-in"), "0px 0px -10% 0px");
else rail.classList.add("is-in");

/* ---------- Video modal ---------- */
const modal = document.getElementById("ht-modal");
const frame = modal.querySelector(".ht__frame");
track.addEventListener("click", e => {
  const m = e.target.closest(".ht__media");
  if (!m || moved) return;
  const card = m.closest(".ht__card");
  if (!card.classList.contains("is-front")) { go(cards.indexOf(card)); restart(); return; }
  frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${m.dataset.id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  modal.showModal();
});
const close = () => { modal.close(); frame.innerHTML = ""; };
modal.querySelector(".ht__close").addEventListener("click", close);
modal.addEventListener("click", e => { if (e.target === modal) close(); });
modal.addEventListener("close", () => { frame.innerHTML = ""; restart(); });
modal.addEventListener("cancel", () => { frame.innerHTML = ""; });
