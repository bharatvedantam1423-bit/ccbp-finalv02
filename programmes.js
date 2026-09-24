(() => {
  const row = document.querySelector("[data-programmes]");
  if (!row) return;

  const cards = [...row.querySelectorAll(".programme")];
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const stacked = window.matchMedia("(max-width: 899px)");

  // Pixel "steps" on the right edge of each expanded photo (Figma: 14 blocks,
  // [top, width, rightOffset] in px of the 536px-tall media panel).
  const STEP_H = 41.078;
  const STEPS = [
    [0, 73.383, 0, 41.078],
    [41.078, 53.181, 0],
    [82.156, 59.599, 0],
    [82.156, 41.08, 111.5],
    [123.234, 111.986, 0],
    [164.313, 73.384, 0],
    [205.391, 53.181, 0],
    [246.469, 67.872, 0],
    [287.547, 92.685, 0],
    [328.625, 53.181, 0],
    [369.703, 67.872, 0],
    [410.781, 53.181, 0],
    [451.859, 92.685, 0],
    [492.938, 53.181, 0, 43.063],
  ];
  const MEDIA_H = 536;

  row.querySelectorAll(".detail__steps").forEach((host) => {
    const mirror = host.dataset.steps === "mirror";
    STEPS.forEach(([top, width, right, h = STEP_H], i) => {
      const s = document.createElement("span");
      s.style.top = `${Math.round(mirror ? MEDIA_H - top - h : top)}px`;
      s.style.width = `${width}px`;
      s.style.height = `${Math.ceil(h) + 1}px`;
      s.style.right = `${right}px`;
      s.style.setProperty("--i", mirror ? STEPS.length - 1 - i : i);
      host.appendChild(s);
    });
  });

  // Show a text wordmark if an exported asset is missing.
  row.querySelectorAll("img[data-fallback]").forEach((img) => {
    const markMissing = () => img.parentElement.classList.add("is-missing");
    img.addEventListener("error", markMissing, { once: true });
    // a load that already failed before this script ran
    if (img.complete && img.currentSrc && img.naturalWidth === 0 && !img.src.endsWith(".svg")) markMissing();
  });

  const setActive = (card) => {
    cards.forEach((c) => {
      const on = c === card;
      c.classList.toggle("is-active", on);
      c.querySelector(".programme__detail").inert = !on;
    });
    row.classList.toggle("has-active", Boolean(card));
  };

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (canHover.matches && !stacked.matches) setActive(card);
    });

    card.addEventListener("focus", () => {
      if (card.matches(":focus-visible")) setActive(card);
    });

    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const isOpen = card.classList.contains("is-active");
      if (!isOpen) setActive(card);
      else if (stacked.matches || !canHover.matches) setActive(null);
    });

    card.addEventListener("keydown", (e) => {
      if (e.target !== card) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActive(card);
        card.querySelector(".programme__cta")?.focus();
      }
    });
  });

  row.addEventListener("mouseleave", () => {
    if (!canHover.matches || stacked.matches) return;
    if (row.contains(document.activeElement)) document.activeElement.blur();
    setActive(null);
  });

  row.addEventListener("focusout", (e) => {
    if (!row.contains(e.relatedTarget)) setActive(null);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setActive(null);
      if (row.contains(document.activeElement)) document.activeElement.blur();
    }
  });

  // Open the first card when the row scrolls into view; reset when it leaves
  // so the reveal plays again next time. Skipped on the stacked mobile layout,
  // where expanding a card mid-scroll would shift the page.
  let autoTimer;
  new IntersectionObserver(
    ([entry]) => {
      clearTimeout(autoTimer);
      if (stacked.matches) return;
      if (entry.isIntersecting) {
        autoTimer = setTimeout(() => {
          if (!row.classList.contains("has-active")) setActive(cards[0]);
        }, 250);
      } else if (!row.contains(document.activeElement)) {
        setActive(null);
      }
    },
    { threshold: 0.6 }
  ).observe(row);
})();
