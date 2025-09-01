(() => {
  // Run after DOM is ready (works even if you forget `defer`)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const helloEl = document.getElementById('hello');
    const hintEl  = document.getElementById('hint');

    if (!helloEl) {
      console.error('[app] #hello not found in DOM');
      return;
    }
    if (!window.HelloCycler) {
      console.error('[app] HelloCycler is missing. Load helloCycler.lib.js before app.js');
      return;
    }

    // Single source of truth: 3s cycle
    document.documentElement.style.setProperty('--cycle-ms', '3000');

    const greetings = (Array.isArray(window.HELLO_GREETINGS) && window.HELLO_GREETINGS.length)
      ? window.HELLO_GREETINGS
      : ['Hello', 'Hola', 'Bonjour']; // safe fallback

    const cycler = new window.HelloCycler(helloEl, {
      intervalMs: 3000,
      greetings
    });

    cycler.start();

    // ---- Continue / Exit intro ----
    let didContinue = false;
    function continueAction() {
      if (didContinue) return;
      didContinue = true;

      document.body.style.transition = 'opacity 500ms ease';
      document.body.style.opacity = '0';

      setTimeout(() => {
        cycler.stop();
        document.body.style.opacity = '1';
        const main = document.querySelector('main');
        if (main) {
          main.innerHTML = `
            <div style="text-align:center">
              <p style="color:var(--hint);font-size:clamp(14px,3.5vw,18px)">Hey</p>
              <h1 style="font-size:clamp(28px,6vw,56px);margin:0 0 12px">Saige</h1>
            </div>
          `;
        }
        if (hintEl && hintEl.parentNode) hintEl.parentNode.removeChild(hintEl);
      }, 520);
    }

    // ---- Gesture & click handling ----
    let startY = null;
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length) startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (startY !== null) {
        const endY = (e.changedTouches && e.changedTouches[0].clientY) || startY;
        if (startY - endY > 40) continueAction(); // swipe up
        startY = null;
      }
    }, { passive: true });

    window.addEventListener('click', continueAction);

    // ---- Power savings: pause when hidden ----
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cycler.stop();
      else cycler.start();
    });
  }
})();
