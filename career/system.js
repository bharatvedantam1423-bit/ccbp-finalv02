/* How we train: the point nearest the middle of the screen is the open one; the panel shows its
   illustration and the dots mark it. */
(() => {
  const sec = document.getElementById('what-companies-look-for');
  if (!sec) return;
  const items = [...sec.querySelectorAll('.wlx-item')];
  const vis = [...sec.querySelectorAll('.wlx-vis')];
  const dots = [...sec.querySelectorAll('.wlx-dots li')];
  let at = -1;
  const show = i => {
    if (i === at) return;
    at = i;
    items.forEach((el, k) => el.classList.toggle('is-on', k === i));
    vis.forEach((el, k) => el.classList.toggle('is-on', k === i));
    dots.forEach((el, k) => el.classList.toggle('is-on', k === i));
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) show(items.indexOf(e.target)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  items.forEach(el => io.observe(el));
  show(0);
})();
