
    (function exposeCycler(){
      function shuffle(arr){
        for(let i=arr.length-1;i>0;i--){
          const j=Math.floor(Math.random()*(i+1));
          [arr[i],arr[j]]=[arr[j],arr[i]];
        }
        return arr;
      }

      class HelloCycler {
        constructor(el, options={}){
          this.el = el;
          this.greetings = shuffle([...(options.greetings || window.HELLO_GREETINGS || [])]);
          this.index = 0;
          this.intervalMs = options.intervalMs ?? HelloCycler.readCycleMsFromCSS();
          this._timer = null;
        }
        static readCycleMsFromCSS(){
          const raw = getComputedStyle(document.documentElement)
                       .getPropertyValue('--cycle-ms').trim();
          if (!raw) return 3000;
          if (raw.endsWith('ms')) return Number.parseFloat(raw);
          if (raw.endsWith('s'))  return Number.parseFloat(raw) * 1000;
          const n = Number.parseFloat(raw);
          return Number.isFinite(n) && n > 0 ? n : 3000;
        }
        
        show(word){
          this.el.textContent = word;
          this.el.dir = 'auto';
          this.el.classList.remove('animate');
          void this.el.offsetWidth; // reflow to restart animation
          this.el.classList.add('animate');
        }
        next(){
          const word = this.greetings[this.index++ % this.greetings.length];
          this.show(word);
        }
        start(){
          if(this._timer) return;
          this.next();
          const tick = () => {
            this.next();
            this._timer = window.setTimeout(tick, this.intervalMs);
          };
          this._timer = window.setTimeout(tick, this.intervalMs);
        }
        stop(){
          if(this._timer){
            clearTimeout(this._timer);
            this._timer = null;
          }
        }
      }
      window.HelloCycler = HelloCycler;
    })();

