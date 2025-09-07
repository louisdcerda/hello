/* --------------------------------------------
   1) Reveal on load/scroll (robust + fallback)
---------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
});

/* --------------------------------------------
   2) Scroll-driven multi-frame phone animation
   HTML expected (one sticky scene):
   <section id="open-photos" class="scene">
     <div class="sticky">
       <div class="stack">
         <img class="phone frame" src="...home.png">
         <img class="phone frame" src="...opening1.png">
         <img class="phone frame" src="...opening2.png">
         <img class="phone frame" src="...opening3.png">
       </div>
     </div>
   </section>
---------------------------------------------*/
(() => {
  const scene = document.getElementById('open-photos');
  if (!scene) return;

  // Support both the new .frame list and the old .frame0/.frame1 naming
  let frames = Array.from(scene.querySelectorAll('.frame'));
  if (frames.length === 0) {
    const f0 = scene.querySelector('.frame0');
    const f1 = scene.querySelector('.frame1');
    frames = [f0, f1].filter(Boolean);
  }
  if (frames.length < 2) return;

  const BASE_RADIUS = 28;   // starting corner radius
  const GROW   = 0.12;      // how much the incoming frame scales up
  const SHRINK = 0.04;      // how much the outgoing frame scales down

  let start = 0, end = 0, range = 1;

  function measure(){
    const rect = scene.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;

    // Start when the scene hits the top; end when the sticky block is about to release
    start = scrollTop + rect.top;
    end   = start + scene.offsetHeight - window.innerHeight;
    range = Math.max(1, end - start);

    render(); // draw once after measuring
  }

  function render(){
    const y = window.scrollY || window.pageYOffset;
    const t = Math.min(1, Math.max(0, (y - start) / range)); // global 0..1

    // Which pair of frames is active?
    const segments = frames.length - 1;
    const s = t * segments;
    const idx = Math.min(segments - 1, Math.max(0, Math.floor(s)));
    const local = Math.min(1, Math.max(0, s - idx)); // 0..1 within current segment

    // Reset
    frames.forEach(f => { f.style.opacity = 0; f.style.transform = 'scale(1)'; });

    // Outgoing / incoming frames
    const out = frames[idx];
    const inn = frames[idx + 1];

    out.style.opacity   = (1 - local).toFixed(3);
    out.style.transform = `scale(${(1 - SHRINK * local).toFixed(4)})`;

    if (inn) {
      inn.style.opacity   = local.toFixed(3);
      inn.style.transform = `scale(${(1 + GROW * local).toFixed(4)})`;
    }

    // Corners square off across the whole scene
    const r = BASE_RADIUS * (1 - t);
    frames.forEach(f => f.style.borderRadius = `${r}px`);
  }

  let ticking = false;
  function onScroll(){
    if (!ticking) {
      requestAnimationFrame(() => { render(); ticking = false; });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure, { passive: true });
  measure();
})();
