// app.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('[app] loaded');

  const el = document.getElementById('hello');
  if (!el) { console.error('[app] #hello not found'); return; }

  // Ensure CSS animation uses a real time
  document.documentElement.style.setProperty('--cycle-ms', '4s');
  console.log('[app] --cycle-ms =', getComputedStyle(document.documentElement).getPropertyValue('--cycle-ms').trim());

  const words = (Array.isArray(window.HELLO_GREETINGS) && window.HELLO_GREETINGS.length)
    ? window.HELLO_GREETINGS
    : ['Hello','Hola','Bonjour'];

  let i = 0;

  function show(txt){
    el.textContent = txt;
    el.dir = 'auto';
    el.classList.remove('animate');
    void el.offsetWidth;     // restart CSS animation
    el.classList.add('animate');
    console.log('[app] show →', txt);
  }

  // start with "hey", then rotate every 3s
  show('Hi');
  setInterval(() => {
    show(words[i % words.length]);
    i++;
}, 4000);
});
