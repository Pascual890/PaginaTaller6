/* ============================================================
   ATLAS — el recorrido (versión corta, 2–3 min)
   Acceso → Inicio → (Misión y puestos) → Formulario →
   A.R. interrumpe el envío con el acta → Memorando → VR
   1. pantalla de acceso (marca el inicio; sirve para reiniciar)
   2. A.R.: la voz filtrada. aparece al salir del Inicio. pide ayuda:
      las "claves" del archivo están en lo tachado de Documentos
   3. apertura de /archive/ (extra): cada campo tachado leído la
      adelanta un tercio; con 3 se abre
   4. interrupción del envío: A.R. muestra el acta antes de firmar
   5. archivo bloqueado / abierto: acta y grabación del portavoz
   6. visor de documentos abiertos
   Carga después de win.js (usa la barra de tareas) y antes de eggs.js
   (eggs.js llama a ATLAS.hallazgo). ?reset borra la sesión.
   ============================================================ */
(function () {
  'use strict';

  var A = window.ATLAS = window.ATLAS || {};
  var reduce = !!A.reduce;
  var store = A.store;
  var toast = A.toast || function () {};
  var ico = A.icon || function () { return ''; };

  /* --- ajustes ------------------------------------------------ */
  var CLAVES = 3;                // campos tachados que abren /archive/
  var AR1_MS = 40000;            // A.R. aparece solo a los 40 s si nadie salió del Inicio

  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var touch = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
  var ARRASTRE = touch ? 'Mantengan el dedo y arrástrenlo' : 'Arrastren el mouse';

  // campos tachados que se pueden leer: 5 en Documentos + el bloque 1982 de Acerca de
  var HALL = ['memo', 'reg', 'kessler', 'medico', 'mapa', 'h1982'];

  /* --- estado ------------------------------------------------- */
  function started() { return !!store.get('t0', 0); }
  function elapsed() { return started() ? Date.now() - store.get('t0', 0) : 0; }
  function applied() { return !!store.get('applied', ''); }
  function found() { return store.get('hall', []); }
  function count() { return found().length; }
  function unlocked() { return count() >= CLAVES; }
  function pct() { return Math.min(100, Math.round(100 * count() / CLAVES)); }
  function seen(id) { return store.get('ar', []).indexOf(id) > -1; }
  function markSeen(id) { var s = store.get('ar', []); if (s.indexOf(id) < 0) { s.push(id); store.set('ar', s); } }

  A.started = started;
  A.unlocked = unlocked;
  A.hallazgos = count;
  // desde que A.R. habló, los avisos oficiales no vuelven: él tomó ese canal
  A.nagsOff = function () { return seen('ar1'); };

  var archivoAbierto = false;

  // ¿hay algo en pantalla que no debe interrumpirse?
  function busy() {
    var m = document.getElementById('modal');
    // el archivo abierto es un momento de lectura: ni avisos ni A.R. encima
    return !!(archivoAbierto || document.getElementById('acceso') || document.getElementById('felicidades') ||
      document.getElementById('acta') || document.getElementById('docview') ||
      document.querySelector('.ar') || (m && m.classList.contains('on')));
  }
  A.busy = busy;

  /* ==========================================================
     1. pantalla de acceso
     ========================================================== */
  var SEAL = '<svg viewBox="0 0 100 100" aria-hidden="true">' +
    '<circle cx="50" cy="50" r="46" fill="none" stroke="#8f1410" stroke-width="3"/>' +
    '<circle cx="50" cy="50" r="38" fill="none" stroke="#6a6558" stroke-width="1"/>' +
    '<ellipse cx="50" cy="50" rx="44" ry="15" fill="none" stroke="#8f1410" stroke-width="1.4" transform="rotate(-24 50 50)"/>' +
    '<circle cx="50" cy="50" r="17" fill="none" stroke="#c8c3b4" stroke-width="1.4"/>' +
    '<circle cx="50" cy="50" r="6" fill="#c8c3b4"/></svg>';

  function showAcceso() {
    var ov = document.createElement('div');
    ov.id = 'acceso';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-labelledby', 'acc-t');
    ov.innerHTML =
      '<div class="win acc-win">' +
        '<div class="win-title"><span class="ico">' + ico('terminal') + '</span>' +
          '<span class="t">ATLAS-NET — Inicio de sesión</span></div>' +
        '<div class="acc-body">' +
          '<div class="acc-seal">' + SEAL + '</div>' +
          '<h1 id="acc-t">ATLAS</h1>' +
          '<p class="acc-sub">TERMINAL PÚBLICO DE CONVOCATORIA · MISIÓN HELIOS-1</p>' +
          '<div class="acc-box"><b>Revise la convocatoria y envíe su postulación.</b></div>' +
          '<p class="acc-go"><button type="button" class="btn primary big">ACCEDER AL TERMINAL</button></p>' +
          '<div class="acc-boot" aria-live="polite"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    document.documentElement.classList.add('acc-lock');
    var btn = ov.querySelector('button');
    btn.focus({ preventScroll: true });

    btn.addEventListener('click', function () {
      btn.disabled = true;
      store.set('t0', Date.now());
      store.set('visited', [here]);
      var boot = ov.querySelector('.acc-boot');
      var lines = [
        'CONECTANDO CON ATLAS-NET ............ OK',
        'VERIFICANDO TERMINAL ................ OK',
        'SESIÓN ABIERTA'
      ];
      ov.classList.add('booting');
      var i = 0;
      (function next() {
        if (i < lines.length) {
          boot.insertAdjacentHTML('beforeend', '<div>&gt; ' + lines[i++] + '</div>');
          setTimeout(next, reduce ? 0 : 320);
        } else {
          setTimeout(function () {
            ov.classList.add('out');
            setTimeout(function () {
              ov.remove();
              document.documentElement.classList.remove('acc-lock');
              document.dispatchEvent(new CustomEvent('atlas:start'));
            }, reduce ? 0 : 400);
          }, reduce ? 0 : 350);
        }
      })();
    });
  }

  if (started()) {
    var v = store.get('visited', []);
    if (v.indexOf(here) < 0) { v.push(here); store.set('visited', v); }
  }

  /* ==========================================================
     2. apertura de /archive/: barra de A.R. y candado del menú
     ========================================================== */
  var tray = document.getElementById('tray');
  var arBtn = null, painted = '';
  function paint() {
    var ok = unlocked(), p = pct();
    var show = started() && (seen('ar1') || count() > 0);
    var key = show + '|' + ok + '|' + p;
    if (painted === key) return;
    var wasOk = painted.indexOf('|true|') > -1;
    painted = key;
    document.querySelectorAll('[data-ar-pct]').forEach(function (el) { el.textContent = p; });
    // las celdas ya leídas quedan a la vista
    found().forEach(function (id) {
      var c = document.querySelector('.redacted-cell[data-id="' + id + '"]');
      if (c) c.classList.add('found');
    });
    // desde que A.R. habló, lo tachado pulsa
    if (seen('ar1') && document.querySelector('.redacted-cell')) {
      document.documentElement.classList.add('hinted');
    }
    // el archivo en el menú: candado hasta que se abre
    document.querySelectorAll('#nav a[href="archivo.html"], #startmenu a[href="archivo.html"]').forEach(function (a) {
      var i = a.querySelector('.ico');
      var big = a.closest('#startmenu') ? 32 : 16;
      if (i) i.innerHTML = ico(ok ? 'cabinet' : 'lock', big);
      a.classList.toggle('locked', !ok);
      a.title = ok ? 'Archivo abierto' : 'Archivo bloqueado';
    });
    if (ok && !wasOk) flashArchivo();
    // botón de A.R. en la barra de tareas: avance de la apertura
    if (show && !arBtn && tray) {
      arBtn = document.createElement('button');
      arBtn.type = 'button';
      arBtn.className = 'task exp';
      tray.parentNode.insertBefore(arBtn, tray);
      arBtn.addEventListener('click', function () {
        if (unlocked()) location.href = 'archivo.html';
        else if (here === 'documentos.html') toast('A.R.: LAS CLAVES ESTÁN EN LO TACHADO — ' + pct() + '%', { ok: true });
        else location.href = 'documentos.html';
      });
    }
    if (arBtn) {
      var n = Math.round(p / 20);
      arBtn.title = ok ? 'Ir al Archivo' : 'A.R. está abriendo /archive/ — las claves están en Documentos';
      arBtn.innerHTML = '<span class="ico">' + ico(ok ? 'cabinet' : 'terminal') + '</span>' +
        (ok ? '<span>/archive/ <b>ABIERTO</b></span>'
            : '<span>A.R. /archive/ <b>' + '▓▓▓▓▓'.slice(0, n) + '░░░░░'.slice(n) + ' ' + p + '%</b></span>');
    }
  }

  var lastHall = 0;
  A.hallazgo = function (id) {
    if (!id) return false;
    var f = found();
    if (f.indexOf(id) > -1) return false;
    f.push(id);
    store.set('hall', f);
    lastHall = Date.now();
    paint();
    if (f.length <= CLAVES) toast('A.R.: ESO ME SIRVE — ' + pct() + '%', { ok: true });
    else toast('CAMPO RESTRINGIDO LEÍDO', { ok: true });
    return true;
  };

  function flashArchivo() {
    document.querySelectorAll('#nav a[href="archivo.html"]').forEach(function (a) {
      a.classList.remove('just-open');
      void a.offsetWidth;
      a.classList.add('just-open');
    });
  }

  /* ==========================================================
     3. A.R. — la voz filtrada. poco texto. no examina: pide ayuda.
     ========================================================== */
  function arMsg(id) {
    var docsHere = here === 'documentos.html';
    switch (id) {
      case 'ar1': return {
        lines: [
          'No firmen todavía.',
          'Estoy abriendo un archivo que Atlas no quiere que vean.',
          'Me faltan las claves: están tachadas en ' + (docsHere ? 'esta tabla' : 'DOCUMENTOS') + '. ' +
            ARRASTRE + ' sobre lo negro; yo lo veo desde aquí.'
        ],
        go: docsHere ? null : { href: 'documentos.html', t: 'Ir a Documentos' },
        no: docsHere ? 'Entendido' : 'Cerrar'
      };
      case 'ar3': return {
        lines: ['Listo. Abrí /archive/.'],
        go: here === 'archivo.html' ? null : { href: 'archivo.html', t: 'Ir al Archivo' },
        no: 'Después'
      };
      case 'arFin': return {
        lines: ['Ya está. Los van a llevar a la Central de Comando.'],
        go: null, no: 'Cerrar'
      };
    }
    return null;
  }

  // qué mensaje corresponde ahora (o ninguno)
  function due() {
    if (!started() || applied()) return null;
    if (unlocked() && !seen('ar3') && !store.get('archivo', false)) return 'ar3';
    if (!seen('ar1') && (here !== 'index.html' || elapsed() >= AR1_MS)) return 'ar1';
    return null;
  }

  // ventana de aviso de Atlas que A.R. toma (conexión no autorizada)
  function arWindow(bodyHTML, opts) {
    opts = opts || {};
    var w = document.createElement('div');
    w.className = 'win ar' + (opts.cls ? ' ' + opts.cls : '');
    w.setAttribute('role', 'dialog');
    w.setAttribute('aria-label', 'Mensaje de A.R.');
    w.innerHTML =
      '<div class="win-title"><span class="ico">' + ico('warn') + '</span>' +
        '<span class="t">ATLAS-NET — Aviso de convocatoria</span>' +
        (opts.noClose ? '' : '<span class="win-btns"><button type="button" data-b="x" aria-label="Cerrar">' + ico('gx') + '</button></span>') +
      '</div>' +
      '<div class="ar-b">' + bodyHTML + '</div>';
    (opts.parent || document.body).appendChild(w);
    if (A.drag && !opts.parent) A.drag(w);
    setTimeout(function () {
      w.classList.add('taken');
      w.querySelector('.win-title .t').textContent = '▒▒ CONEXIÓN NO AUTORIZADA — terminal A.R.';
      w.querySelector('.win-title .ico').innerHTML = ico('terminal');
    }, reduce ? 0 : 420);
    return w;
  }

  // escribe las líneas una a una; un clic en el texto lo completa
  function typeLines(box, lines, done) {
    var li = 0, ci = 0, timer = null, fin = false;
    var ps = lines.map(function () { var p = document.createElement('p'); box.appendChild(p); return p; });
    function finish() {
      if (fin) return;
      fin = true;
      clearTimeout(timer);
      ps.forEach(function (p, i) { p.textContent = lines[i]; p.classList.remove('typing'); });
      done();
    }
    function type() {
      if (li >= lines.length) return finish();
      ps[li].classList.add('typing');
      ps[li].textContent = lines[li].slice(0, ++ci);
      if (ci >= lines[li].length) { ps[li].classList.remove('typing'); li++; ci = 0; timer = setTimeout(type, 240); }
      else timer = setTimeout(type, 16);
    }
    box.addEventListener('click', finish);
    if (reduce) finish(); else setTimeout(type, 520);
  }

  function showAR(id) {
    var m = arMsg(id);
    if (!m) return;
    markSeen(id);
    if (A.closeNags) A.closeNags();
    var w = arWindow(
      '<div class="ar-text"></div>' +
      '<p class="ar-sig">— A.R.</p>' +
      '<div class="ar-btns">' +
        (m.go ? '<a class="btn primary" href="' + m.go.href + '">' + m.go.t + '</a>' : '') +
        '<button type="button" class="btn" data-no>' + m.no + '</button>' +
      '</div>');
    var btns = w.querySelector('.ar-btns');
    var sig = w.querySelector('.ar-sig');
    btns.style.visibility = sig.style.visibility = 'hidden';
    function close() { w.remove(); paint(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    w.querySelector('[data-b=x]').addEventListener('click', close);
    w.querySelector('[data-no]').addEventListener('click', close);
    paint();
    typeLines(w.querySelector('.ar-text'), m.lines, function () {
      btns.style.visibility = sig.style.visibility = '';
      var go = btns.querySelector('a');
      (go || btns.querySelector('button')).focus({ preventScroll: true });
    });
  }

  /* ==========================================================
     4. la interrupción del envío: nadie firma sin ver el acta.
        site.js llama a ATLAS.interrumpir(seguir) al validar el formulario.
     ========================================================== */
  A.interrumpir = function (seguir) {
    document.querySelectorAll('.ar').forEach(function (w) { w.remove(); });
    if (A.closeNags) A.closeNags();
    store.set('acta', true);
    var vio = store.get('archivo', false);
    var tpl = document.getElementById('acta-tpl');
    var ov = document.createElement('div');
    ov.id = 'acta';
    ov.setAttribute('role', 'alertdialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Mensaje de A.R. antes de enviar');
    document.body.appendChild(ov);
    var w = arWindow(
      '<div class="ar-text"></div>' +
      '<div class="acta-doc" hidden></div>' +
      '<p class="ar-sig" hidden>— A.R.</p>' +
      '<div class="ar-btns" hidden><button type="button" class="btn primary" data-go>Enviar de todas formas</button></div>',
      { parent: ov, noClose: true, cls: 'ar-acta' });
    var doc = w.querySelector('.acta-doc');
    if (!vio && tpl) doc.appendChild(tpl.content.cloneNode(true));
    var lines = vio
      ? ['Ya vieron el archivo.', '¿Firman igual?']
      : ['Listo. Antes de firmar, miren esto.'];
    typeLines(w.querySelector('.ar-text'), lines, function () {
      doc.hidden = vio || !tpl;
      w.querySelector('.ar-sig').hidden = false;
      // un momento para leer antes de poder seguir
      setTimeout(function () {
        var b = w.querySelector('.ar-btns');
        b.hidden = false;
        b.querySelector('button').focus({ preventScroll: true });
      }, reduce || vio ? 0 : 2500);
    });
    w.querySelector('[data-go]').addEventListener('click', function () {
      ov.remove();
      seguir();
    });
  };

  function loop() {
    paint();
    archivo();                                                // abre la página del archivo en vivo
    if (busy()) return;
    if (Date.now() - lastHall < 2200) return;                 // dejar leer el aviso del campo leído
    var ae = document.activeElement;
    if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return;
    var sel = window.getSelection && window.getSelection().toString().trim();
    if (sel) return;                                          // está seleccionando: no interrumpir
    var id = due();
    if (id) showAR(id);
  }

  document.addEventListener('atlas:comunicado', function () {
    setTimeout(function () { showAR('arFin'); }, 2600);
  });

  /* ==========================================================
     5. archivo: bloqueado o abierto
     ========================================================== */
  function archivo() {
    var lockedV = document.querySelector('[data-archivo="locked"]');
    var openV = document.querySelector('[data-archivo="open"]');
    if (!lockedV || !openV || archivoAbierto) return;
    if (!unlocked()) {
      lockedV.hidden = false;
      openV.hidden = true;
      return;
    }
    archivoAbierto = true;
    lockedV.hidden = true;
    openV.hidden = false;
    markSeen('ar3');                          // ya está adentro: "Listo. Abrí /archive/" sobra
    var first = !store.get('archivo', false);
    store.set('archivo', true);
    document.title = 'Atlas Corporation — /archive/ — Acceso concedido';
    document.querySelectorAll('.pageid').forEach(function (p) {
      p.textContent = 'Atlas Corporation · /archive/ · ACCESO CONCEDIDO — CREDENCIAL A.R.';
    });
    if (first) setTimeout(function () { toast('ESTA SESIÓN NO QUEDA REGISTRADA', { ok: true, ms: 3000 }); }, 900);
    grabacion();
  }

  // grabación del portavoz: si hay audio (data-src) lo reproduce; si no, transcripción
  function grabacion() {
    var box = document.getElementById('toma07');
    if (!box) return;
    var play = box.querySelector('.pl-play');
    var bar = box.querySelector('.pbar i');
    var st = box.querySelector('.pl-st');
    var tr = box.querySelector('.pl-tr');
    var lines = [].slice.call(tr.querySelectorAll('p'));
    var src = box.getAttribute('data-src');
    var playing = false;

    function transcribir(conAudio) {
      tr.hidden = false;
      lines.forEach(function (p) { p.style.visibility = 'hidden'; });
      var i = 0;
      (function next() {
        if (i >= lines.length) { st.textContent = conAudio ? 'REPRODUCCIÓN TERMINADA' : 'FIN DE LA TRANSCRIPCIÓN'; return; }
        lines[i++].style.visibility = '';
        bar.style.width = Math.round(100 * i / lines.length) + '%';
        setTimeout(next, reduce ? 0 : (conAudio ? 5200 : 1500));
      })();
    }

    play.addEventListener('click', function () {
      if (playing) return;
      playing = true;
      play.disabled = true;
      if (src) {
        var au = new Audio(src);
        au.addEventListener('error', function () { fallo(); });
        au.play().then(function () {
          st.textContent = 'REPRODUCIENDO…';
          transcribir(true);
        }).catch(fallo);
      } else {
        fallo();
      }
    });
    var fallado = false;
    function fallo() {
      if (fallado) return;
      fallado = true;
      st.textContent = 'ARCHIVO DAÑADO — RECUPERANDO TRANSCRIPCIÓN AUTOMÁTICA…';
      setTimeout(function () { transcribir(false); }, reduce ? 0 : 900);
    }
  }

  /* ==========================================================
     6. visor de documentos abiertos (documentos.html)
     ========================================================== */
  document.querySelectorAll('a[data-doc]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var tpl = document.getElementById('doc-' + a.getAttribute('data-doc'));
      if (!tpl || document.getElementById('docview')) return;
      var ov = document.createElement('div');
      ov.id = 'docview';
      ov.setAttribute('role', 'dialog');
      ov.setAttribute('aria-modal', 'true');
      ov.setAttribute('aria-label', a.textContent);
      ov.innerHTML =
        '<div class="win dv-win">' +
          '<div class="win-title"><span class="ico">' + ico('doc') + '</span>' +
            '<span class="t">' + a.textContent + ' — Visor ATLAS</span>' +
            '<span class="win-btns"><button type="button" data-b="x" aria-label="Cerrar">' + ico('gx') + '</button></span></div>' +
          '<div class="dv-paper"></div>' +
          '<div class="dv-btns"><button type="button" class="btn">Cerrar</button></div>' +
        '</div>';
      ov.querySelector('.dv-paper').appendChild(tpl.content.cloneNode(true));
      document.body.appendChild(ov);
      function close() { ov.remove(); document.removeEventListener('keydown', onKey); a.focus({ preventScroll: true }); }
      function onKey(ev) { if (ev.key === 'Escape') close(); }
      document.addEventListener('keydown', onKey);
      ov.addEventListener('click', function (ev) { if (ev.target === ov) close(); });
      ov.querySelector('[data-b=x]').addEventListener('click', close);
      ov.querySelector('.dv-btns .btn').addEventListener('click', close);
      ov.querySelector('.dv-btns .btn').focus({ preventScroll: true });
    });
  });

  /* --- arranque ---------------------------------------------- */
  if (!started()) showAcceso();
  document.addEventListener('atlas:start', function () { loop(); });
  loop();
  setInterval(loop, 1000);
})();
