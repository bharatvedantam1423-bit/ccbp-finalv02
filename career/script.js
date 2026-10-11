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

track.innerHTML = TESTIMONIALS.map((t, i) => `
  <li class="ht__card" style="z-index:${TESTIMONIALS.length - i}">
    <button class="ht__media" data-id="${t.id}" aria-label="Play: ${t.name}, ${t.role}, ${t.co}">
      <img src="${t.img}" alt="${t.name}" ${i > 4 ? 'loading="lazy"' : ""} decoding="async">
      <span class="ht__play">${PLAY}</span><span class="ht__dur">${t.dur}</span>
    </button>
    <div class="ht__label"><p class="ht__name">${t.name}</p><p class="ht__role">${t.role}</p>
      <p class="ht__co">${t.logo ? `<img src="assets/hiring-logos/${t.logo}" alt="${t.co}" loading="lazy">` : `<span>${t.co}</span>`}</p></div>
  </li>`).join("");

const cards  = [...track.children];
/* logos of very different shapes get the same visual weight: height from a constant area, clamped */
const fitLogo = im => { const r = im.naturalWidth / im.naturalHeight || 3;
  im.style.height = Math.min(44, Math.max(24, Math.sqrt(3800 / r)), 190 / r) + "px"; };
track.querySelectorAll(".ht__co img").forEach(im => im.complete ? fitLogo(im) : im.addEventListener("load", () => fitLogo(im), { once: true }));
const labels = cards.map(c => c.querySelector(".ht__label"));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Motion: the row slides in from the right as the section rises (a dolly along it), each
   portrait opens from the foot up as it arrives, and a card under the pointer tilts toward it. ---------- */
const M = window.NWMotion;
const rail = document.querySelector(".ht__rail");
if (M && !M.RM) {
  cards.forEach((c, i) => c.style.setProperty("--d", i % 6));
  M.once(rail, () => rail.classList.add("is-in"), "0px 0px -10% 0px");
  let x = null;
  M.scene({
    el: rail,
    read: () => M.progress(rail, 1, .35),
    write: (p, f) => {
      const want = (1 - (1 - Math.pow(1 - p, 3))) * f.vw * .38;
      x = x === null ? want : x + (want - x) * .12;
      rail.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    },
  });
  if (matchMedia("(hover: hover)").matches) cards.forEach(c => {
    const media = c.querySelector(".ht__media");
    media.addEventListener("pointermove", e => {
      const r = media.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
      media.style.setProperty("--rx", (-ny * 10).toFixed(2) + "deg");
      media.style.setProperty("--ry", (nx * 12).toFixed(2) + "deg");
      media.style.setProperty("--gx", ((nx + .5) * 100).toFixed(1) + "%");
      media.style.setProperty("--gy", ((ny + .5) * 100).toFixed(1) + "%");
    });
    media.addEventListener("pointerleave", () => { media.style.setProperty("--rx", "0deg"); media.style.setProperty("--ry", "0deg"); });
  });
} else rail.classList.add("is-in");

/* ---------- Horizontal rail: arrows + mouse drag ---------- */
const [prev, next] = document.querySelectorAll(".ht__arrow");
const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
const syncArrows = () => {
  prev.disabled = track.scrollLeft < 4;
  next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 4;
};
document.querySelectorAll(".ht__arrow").forEach(b =>
  b.addEventListener("click", () => track.scrollBy({ left: step() * b.dataset.dir, behavior: "smooth" })));
track.addEventListener("scroll", syncArrows, { passive: true });
addEventListener("resize", syncArrows);
syncArrows();

let down = null, moved = false;
track.addEventListener("pointerdown", e => {
  if (e.pointerType !== "mouse") return;
  down = { x: e.clientX, s: track.scrollLeft }; moved = false;
});
addEventListener("pointermove", e => {
  if (!down) return;
  const dx = e.clientX - down.x;
  if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add("drag"); }
  if (moved) track.scrollLeft = down.s - dx;
});
addEventListener("pointerup", () => {
  if (!down) return;
  down = null;
  if (moved) {
    // let snap re-engage from the current position
    const i = Math.round(track.scrollLeft / step());
    track.classList.remove("drag");
    track.scrollTo({ left: i * step(), behavior: "smooth" });
  }
});

/* ---------- Video modal ---------- */
const modal = document.getElementById("ht-modal");
const frame = modal.querySelector(".ht__frame");
track.addEventListener("click", e => {
  const m = e.target.closest(".ht__media");
  if (!m || moved || !m.dataset.id) return;
  frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${m.dataset.id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  modal.showModal();
});
const close = () => { modal.close(); frame.innerHTML = ""; };
modal.querySelector(".ht__close").addEventListener("click", close);
modal.addEventListener("click", e => { if (e.target === modal) close(); });
modal.addEventListener("close", () => { frame.innerHTML = ""; });
