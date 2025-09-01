document.addEventListener('DOMContentLoaded', () => {
  const helloEl = document.getElementById('hello');
  const nameEl  = document.getElementById('name');
  if (!helloEl || !nameEl) return;

  // Per-element animation durations (CSS var is read by .animate)
  helloEl.style.setProperty('--cycle-ms', '4s'); // 4s for greetings
  nameEl.style.setProperty('--cycle-ms',  '3s'); // 3s for names

  // From greetings.data.js
  const greetings = (Array.isArray(window.HELLO_GREETINGS) && window.HELLO_GREETINGS.length)
    ? window.HELLO_GREETINGS
    : ['Hello', 'Hola', 'Bonjour'];


  // hard coded names
  const names = [
    "Saigeypoo", "Soyeon" , "소연", "Saige"
  ];

  let gi = 0, ni = 0;

  function show(el, txt) {
    el.textContent = txt;
    el.dir = 'auto';
    el.classList.remove('animate');
    void el.offsetWidth;        // restart CSS animation
    el.classList.add('animate');
  }

  // Kick off (use whatever is in HTML initially)
  show(helloEl, helloEl.textContent || greetings[0]);
  show(nameEl,  nameEl.textContent  || names[0]);

  // Independent cadences
  setInterval(() => {
    show(helloEl, greetings[gi++ % greetings.length]);  // 4s cycle
  }, 4000);

  setInterval(() => {
    show(nameEl, names[ni++ % names.length]);           // 3s cycle
  }, 3000);

  setTimeout(() => {
    const stage = document.querySelector('.stage');
    let note = document.getElementById('note');
    if (!note) {
      note = document.createElement('div');
      note.id = 'note';
      note.className = 'note';
      note.textContent = 'Click anywhere to continue';  
      stage.appendChild(note);
    }
    // trigger fade-in
    requestAnimationFrame(() => note.classList.add('show'));
  }, 7000);
});
