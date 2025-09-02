// simple reveal on load/scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));


(() => {
  const scene = document.getElementById('open-photos');
  if (!scene) return;

  const frame0 = scene.querySelector('.frame0'); // home
  const frame1 = scene.querySelector('.frame1'); // photos opening

  let start = 0, end = 0, range = 1;

  function measure(){
    const rect = scene.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    start = scrollTop + rect.top;                              // scene start (px from top of doc)
    end   = start + scene.offsetHeight - window.innerHeight;   // when sticky is about to end
    range = Math.max(1, end - start);
    update();                                                  // render once after measuring
  }

  function update(){
    const y = window.scrollY || window.pageYOffset;
    const t = Math.min(1, Math.max(0, (y - start) / range));   // clamp 0..1

    // crossfade
    frame0.style.opacity = (1 - t).toFixed(3);
    frame1.style.opacity = t.toFixed(3);

    // subtle zoom to mimic opening
    const scale0 = 1 - 0.04 * t;   // home shrinks slightly
    const scale1 = 1 + 0.12 * t;   // app grows slightly
    frame0.style.transform = `scale(${scale0})`;
    frame1.style.transform = `scale(${scale1})`;

    // square off corners as it opens (28px -> 0px)
    const r = 28 * (1 - t);
    frame0.style.borderRadius = frame1.style.borderRadius = `${r}px`;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure);
  measure();
})();
