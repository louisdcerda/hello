
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e => e.isIntersecting && e.target.classList.add('in'));
}, { threshold:.16 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
