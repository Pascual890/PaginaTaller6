/* ============================================================
   ATLAS — EASTER EGGS
   Egg 1  bloque 1982 (long-press revela)          acerca.html
   Egg 2  celdas redactadas (selección revela)     documentos.html
   Egg 3  acceso denegado + contador de intentos   documentos / archivo / todas (contador)
   Egg 4  censura activa (flash grupal + long-press) footer + acerca + mision
   Egg 5  ojos en el mapa del sitio (canvas)       footer
   Estado compartido entre páginas: sessionStorage (muere al cerrar la pestaña).
   ============================================================ */
(function () {
  'use strict';

  var A = window.ATLAS = window.ATLAS || {};
  var reduce = (typeof A.reduce === 'boolean') ? A.reduce : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var toast = A.toast || function (m) { console.log(m); };

  /* estado compartido ---------------------------------------- */
  var store = {
    get: function (k, d) {
      try { var v = sessionStorage.getItem('atlas_' + k); return v === null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set: function (k, v) {
      try { sessionStorage.setItem('atlas_' + k, JSON.stringify(v)); } catch (e) {}
    }
  };

  /* long-press genérico con Pointer Events ---------------------
     opts: { ms, onStart, onCancel, onComplete, debounce }
     Usa >= en el temporizador; el corte no depende de frames. */
  function longPress(el, opts) {
    var timer = null, t0 = 0, active = false, blockedUntil = 0;
    function start(e) {
      if (e.button !== undefined && e.button !== 0) return;
      if (opts.ignore && opts.ignore(e)) return;
      if (Date.now() < blockedUntil) return;
      if (active) return;
      active = true;
      t0 = Date.now();
      try { el.setPointerCapture(e.pointerId); } catch (x) {}
      opts.onStart && opts.onStart(e);
      timer = setTimeout(function () {
        if (!active) return;
        if (Date.now() - t0 >= opts.ms) finish(true);
      }, opts.ms);
    }
    function finish(done) {
      if (!active) return;
      active = false;
      clearTimeout(timer);
      if (done) { opts.onComplete && opts.onComplete(); }
      else {
        opts.onCancel && opts.onCancel();
        blockedUntil = Date.now() + (opts.debounce || 300);
      }
    }
    function end() { finish(Date.now() - t0 >= opts.ms); }
    el.addEventListener('pointerdown', start);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', function () { finish(false); });
    el.addEventListener('pointerleave', function () { if (active) finish(false); });
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  /* ==========================================================
     EGG 1 — bloque "1982"
     IDLE → PRESSING → REVEALED ; RESET si suelta antes de 2000ms
     ========================================================== */
  (function egg1() {
    var el = document.getElementById('egg-1982');
    if (!el) return;
    var THRESH = 2000;

    function reveal() {
      el.classList.remove('pressing');
      el.classList.add('revealed');
      el.setAttribute('aria-expanded', 'true');
      store.set('egg1', true);
    }

    if (reduce) {
      // sin cronómetro: un toque simple revela (misma información, sin movimiento)
      el.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') return;
        reveal();
      });
    } else {
      longPress(el, {
        ms: THRESH,
        debounce: 300,
        // ya revelado, o clic sobre el enlace: no rearmar el cronómetro
        ignore: function (e) { return el.classList.contains('revealed') || !!e.target.closest('a'); },
        onStart: function () { el.classList.add('pressing'); },
        onCancel: function () { el.classList.remove('pressing'); },
        onComplete: reveal
      });
    }

    var link = el.querySelector('.leak a');
    if (link && A.openModal) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        if (!el.classList.contains('revealed')) return;
        A.openModal();
        toast('ESTE ACCESO HA SIDO REGISTRADO', { shake: true });
      });
    }
  })();

  /* ==========================================================
     EGG 2 — celdas redactadas: ::selection hace el trabajo.
     JS sólo para registrar el "hallazgo". Sin explicaciones en pantalla.
     ========================================================== */
  (function egg2() {
    var cells = document.querySelectorAll('.redacted-cell');
    if (!cells.length) return;

    var found = store.get('egg2found', []);
    function check() {
      var sel = window.getSelection();
      if (!sel || !sel.toString().trim()) return;
      var node = sel.anchorNode;
      if (!node) return;
      var cell = (node.nodeType === 3 ? node.parentElement : node).closest('.redacted-cell');
      if (!cell) return;
      var id = cell.getAttribute('data-id') || cell.textContent;
      if (found.indexOf(id) === -1) {
        found.push(id);
        store.set('egg2found', found);
        toast('HALLAZGO REGISTRADO — ' + found.length + ' DE ' + cells.length, { ok: true });
        if (found.length === cells.length) {
          setTimeout(function () {
            toast('ÍNDICE COMPLETO. EL CUSTODIO HA SIDO NOTIFICADO.', { shake: true, ms: 4000 });
          }, 2800);
        }
      }
    }
    document.addEventListener('mouseup', function () { setTimeout(check, 10); });
    document.addEventListener('touchend', function () { setTimeout(check, 250); });
    document.addEventListener('selectionchange', function () {
      // en móvil la selección se ajusta con asas después del touchend
      clearTimeout(check._t); check._t = setTimeout(check, 600);
    });
  })();

  /* ==========================================================
     EGG 3 — archivo restringido: ACCESO DENEGADO + contador global
     ========================================================== */
  (function egg3() {
    var attempts = store.get('attempts', 0);
    var lastHit = 0;

    function paint() {
      document.querySelectorAll('[data-attempts]').forEach(function (n) {
        n.textContent = String(attempts).padStart(3, '0');
      });
    }
    paint();

    var rows = document.querySelectorAll('[data-restricted]');
    if (!rows.length) return;

    rows.forEach(function (row) {
      row.addEventListener('click', function (e) {
        // si el usuario está seleccionando texto (Egg 2), no es un intento de acceso
        if (window.getSelection && window.getSelection().toString().trim()) return;
        if (e.target.closest('.redacted-cell')) return;
        e.preventDefault();

        var name = row.querySelector('.fname') || row.firstElementChild;
        name.classList.remove('glitch');
        void name.offsetWidth;
        name.classList.add('glitch');
        setTimeout(function () { name.classList.remove('glitch'); }, 450);

        var now = Date.now();
        if (now - lastHit >= 500) {
          lastHit = now;
          attempts += 1;
          store.set('attempts', attempts);
          paint();
          var msg = 'ACCESO DENEGADO — INTENTO REGISTRADO (' + String(attempts).padStart(3, '0') + ')';
          if (attempts === 5) msg = 'ACCESO DENEGADO — SU TERMINAL HA SIDO REENVIADO AL COMITÉ DE CONTINUIDAD';
          if (attempts >= 10 && attempts % 5 === 0) msg = 'ACCESO DENEGADO — DEJE DE INTENTARLO';
          toast(msg, { shake: true });
        }
      });
    });
  })();

  /* ==========================================================
     EGG 4 — censura activa: flash grupal + long-press individual
     ========================================================== */
  (function egg4() {
    var els = document.querySelectorAll('.cens[data-real]');
    if (!els.length) return;

    els.forEach(function (el) {
      var masked = el.textContent;
      var real = el.getAttribute('data-real');
      var holdT = null;

      function show() {
        el.classList.remove('flash-active', 'holding');
        el.classList.add('revealed');
        el.textContent = real;
        clearTimeout(holdT);
        holdT = setTimeout(function () {
          el.classList.remove('revealed');
          el.textContent = masked;
        }, 1500);
      }

      if (reduce) {
        el.classList.add('static');
        el.addEventListener('click', show);
      } else {
        longPress(el, {
          ms: 800,
          debounce: 200,
          onStart: function () { el.classList.add('holding'); },
          onCancel: function () { el.classList.remove('holding'); },
          onComplete: show
        });
      }
    });

    if (reduce) return;

    // un único timer maestro para todo el grupo, ±2s por ciclo
    function flash() {
      els.forEach(function (el) {
        if (el.classList.contains('revealed') || el.classList.contains('holding')) return;
        el.classList.add('flash-active');
        setTimeout(function () { el.classList.remove('flash-active'); }, 260);
      });
      schedule();
    }
    function schedule() {
      setTimeout(flash, 17000 + (Math.random() * 4000 - 2000));
    }
    schedule();
  })();

  /* ==========================================================
     EGG 5 — mapa del sitio: ojos en la oscuridad (canvas)
     DORMANT: un punto cada 8–12s ; ACTIVE: siguen el puntero con inercia
     ========================================================== */
  (function egg5() {
    var cv = document.getElementById('eyes');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var eyes = [];              // { x, y, r, age, life, born }
    var MAX = 26;
    var ptr = { x: 0, y: 0, tx: 0, ty: 0, inside: false, lastMove: 0 };
    var dormantT = null;

    function size() {
      var r = cv.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener('resize', size);

    function spawn(x, y, life) {
      if (eyes.length >= MAX) eyes.shift();     // recicla el más antiguo
      eyes.push({ x: x, y: y, r: 1.5 + Math.random() * 1.5, age: 0, life: life });
    }

    function dormant() {
      if (!ptr.inside) spawn(8 + Math.random() * (W - 16), 8 + Math.random() * (H - 16), 1500);
      dormantT = setTimeout(dormant, 8000 + Math.random() * 4000);
    }
    if (!reduce) dormantT = setTimeout(dormant, 2500);
    else { spawn(W * .3, H * .5, 1e9); spawn(W * .7, H * .4, 1e9); }

    function move(e) {
      var r = cv.getBoundingClientRect();
      ptr.tx = e.clientX - r.left; ptr.ty = e.clientY - r.top;
      if (!ptr.inside) { ptr.x = ptr.tx; ptr.y = ptr.ty; ptr.inside = true; }
      ptr.lastMove = performance.now();
    }
    // se escucha en el contenedor: los enlaces del mapa están encima del canvas
    var host = cv.parentElement;
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerenter', move);
    host.addEventListener('pointerleave', function () { ptr.inside = false; });

    var lastSpawn = 0;
    function frame(t) {
      // ACTIVE: interpolación hacia el puntero, no 1:1
      if (ptr.inside && t - ptr.lastMove < 1000) {
        ptr.x += (ptr.tx - ptr.x) * 0.18;
        ptr.y += (ptr.ty - ptr.y) * 0.18;
        if (t - lastSpawn > 45) {
          lastSpawn = t;
          spawn(ptr.x + (Math.random() * 6 - 3), ptr.y + (Math.random() * 6 - 3), 1000);
        }
      }
      ctx.clearRect(0, 0, W, H);
      for (var i = eyes.length - 1; i >= 0; i--) {
        var e = eyes[i];
        e.age += 16.7;
        var k = e.age / e.life;
        if (k >= 1) { eyes.splice(i, 1); continue; }
        // curva de fade: 0 → .8 → 0
        var a = k < .3 ? (k / .3) * .8 : .8 * (1 - (k - .3) / .7);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(220,232,255,' + a.toFixed(3) + ')';
        ctx.shadowColor = 'rgba(220,232,255,' + (a * .9).toFixed(3) + ')';
        ctx.shadowBlur = 6;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
})();
