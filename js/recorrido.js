/* ============================================================
   ATLAS — el recorrido (versión corta, 2–3 min)
   Acceso → Inicio → Misión y puestos → Documentos → Formulario →
   A.R. interrumpe el envío con el acta → Memorando → VR
   1. pantalla de acceso (marca el inicio; sirve para reiniciar)
   2. la pestaña de A.R. (abajo a la derecha): reabre su último
      mensaje y muestra el avance de /archive/ (extra: cada campo
      tachado leído lo adelanta un tercio; con 3 se abre)
   3. A.R.: la voz filtrada. aparece al salir del Inicio. pide ayuda:
      las "claves" del archivo están en lo tachado de Documentos
   4. interrupción del envío: A.R. muestra el acta antes de firmar
   5. /archive/ bloqueado / abierto (debajo de la tabla de Documentos):
      acta y grabación del portavoz
   6. visor de documentos abiertos
   7. el procedimiento: la barra de 4 botones marca dónde está y qué
      vio; abajo, un solo botón para seguir
   Carga después de win.js (usa los íconos) y antes de eggs.js
   (eggs.js llama a ATLAS.hallazgo). ?reset borra la sesión.
   ============================================================ */
(function () {
  'use strict';

  var A = window.ATLAS = window.ATLAS || {};
  var reduce = !!A.reduce;
  var store = A.store;
  var toast = A.toast || function () {};
  var ico = A.icon || function () { return ''; };
  var sfx = A.sfx || function () {};

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
  var leyendo = false;             // /archive/ abierto y en pantalla

  // ¿hay algo en pantalla que no debe interrumpirse?
  function modalAbierto() {
    var m = document.getElementById('modal');
    return !!(document.getElementById('acceso') || document.getElementById('felicidades') ||
      document.getElementById('acta') || document.getElementById('docview') ||
      (m && m.classList.contains('on')));
  }
  function busy() {
    // leer el archivo es un momento de lectura: ni avisos ni A.R. encima
    return !!(leyendo || panelOpen() || modalAbierto());
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
          '<p class="acc-sub">TERMINAL PÚBLICO DE CONVOCATORIA · MISIÓN DISSONANCE-1</p>' +
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
          sfx(i < lines.length ? 'key' : 'ok');
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
     2. la pestaña de A.R., abajo a la derecha. aparece cuando A.R.
        habla por primera vez y ya no se va: cerrar un mensaje lo
        guarda ahí, y un clic lo vuelve a abrir. también muestra
        el avance de la apertura de /archive/.
     ========================================================== */
  var tab = null, painted = '', painted0 = false;
  function paint() {
    var ok = unlocked(), p = pct();
    var show = started() && (seen('ar1') || count() > 0);
    var key = show + '|' + ok + '|' + p + '|' + applied();
    if (painted === key) return;
    pintarNav();
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
    if (ok && !wasOk && painted0) flashArchivo();
    painted0 = true;
    if (show && !tab) makeTab();
    if (tab) {
      var n = Math.round(p / 20);
      tab.querySelector('.ar-tab-s').textContent = applied() ? '' :
        ok ? '/archive/ ABIERTO' : '/archive/ ' + '▓▓▓▓▓'.slice(0, n) + '░░░░░'.slice(n) + ' ' + p + '%';
    }
  }

  function makeTab() {
    tab = document.createElement('button');
    tab.type = 'button';
    tab.id = 'ar-tab';
    tab.title = 'Mensajes de A.R.';
    tab.setAttribute('aria-expanded', 'false');
    tab.setAttribute('aria-controls', 'ar');
    tab.innerHTML = '<span class="ico">' + ico('terminal') + '</span><b>A.R.</b>' +
      '<span class="ar-tab-s"></span><span class="ar-tab-g" aria-hidden="true"></span>';
    document.body.appendChild(tab);
    tab.addEventListener('click', function () {
      if (panelOpen()) return cerrarAR();
      var last = store.get('arLast', '');
      showAR(last || 'ar1', !!last);
    });
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

  // se abrió estando en otra página: Documentos parpadea en la barra
  function flashArchivo() {
    if (here === 'documentos.html') return;
    document.querySelectorAll('#nav a[href="documentos.html"]').forEach(function (a) {
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
        lines: [
          'Listo. Abrí /archive/.',
          'Está en ' + (docsHere ? 'esta página' : 'DOCUMENTOS') + ', debajo de la tabla.',
          'No les voy a decir que no vayan. Atlas dice que sabe lo que hace. Lean esto y decidan ustedes.'
        ],
        go: { href: docsHere ? '#archive' : 'documentos.html#archive', t: 'Ver /archive/' },
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
    if (unlocked() && !seen('ar3')) return 'ar3';
    if (!seen('ar1') && (here !== 'index.html' || elapsed() >= AR1_MS)) return 'ar1';
    return null;
  }

  // ventana de aviso de Atlas que A.R. toma (conexión no autorizada)
  var AVISO = 'ATLAS-NET — Aviso de convocatoria';
  var TOMADA = '▒▒ CONEXIÓN NO AUTORIZADA — terminal A.R.';
  function tomar(w, anim) {
    w.classList.add('taken');
    w.querySelector('.win-title .t').textContent = TOMADA;
    w.querySelector('.win-title .ico').innerHTML = ico('terminal');
    if (!anim || reduce) return;
    sfx('toma');
    w.classList.add('taking');
    setTimeout(function () { w.classList.remove('taking'); }, 500);
  }
  function arWindow(bodyHTML, opts) {
    opts = opts || {};
    var w = document.createElement('div');
    w.className = 'win ar' + (opts.cls ? ' ' + opts.cls : '');
    w.setAttribute('role', 'dialog');
    w.setAttribute('aria-label', 'Mensaje de A.R.');
    w.innerHTML =
      '<div class="win-title"><span class="ico">' + ico('warn') + '</span>' +
        '<span class="t">' + AVISO + '</span></div>' +
      '<div class="ar-b">' + bodyHTML + '</div>';
    (opts.parent || document.body).appendChild(w);
    sfx('aviso');
    setTimeout(function () { tomar(w, true); }, reduce ? 0 : 420);
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
      if (ci % 2 && lines[li].charAt(ci - 1) !== ' ') sfx('key');
      if (ci >= lines[li].length) { ps[li].classList.remove('typing'); li++; ci = 0; timer = setTimeout(type, 240); }
      else timer = setTimeout(type, 16);
    }
    box.addEventListener('click', finish);
    if (reduce) finish(); else setTimeout(type, 520);
  }

  // el panel de mensajes: uno solo por página, sale de la pestaña y vuelve a ella
  var panel = null, closeT = null;
  function panelOpen() { return !!(panel && !panel.hidden); }

  function makePanel() {
    panel = document.createElement('div');
    panel.id = 'ar';
    panel.className = 'win ar';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Mensaje de A.R.');
    panel.hidden = true;
    panel.innerHTML =
      '<div class="win-title"><span class="ico"></span><span class="t"></span>' +
        '<span class="win-btns"><button type="button" data-b="min" aria-label="Guardar en la pestaña de A.R.">' +
          ico('gmin') + '</button></span></div>' +
      '<div class="ar-b"></div>';
    document.body.appendChild(panel);
    panel.querySelector('[data-b=min]').addEventListener('click', function () { cerrarAR(true); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panelOpen()) cerrarAR(true); });
  }

  // again: reabierto desde la pestaña (sin máquina de escribir ni toma de la ventana)
  function showAR(id, again) {
    var m = arMsg(id);
    if (!m) return;
    if (!again) markSeen(id);
    store.set('arLast', id);
    if (A.closeNags) A.closeNags();
    if (!panel) makePanel();
    clearTimeout(closeT);
    panel.classList.remove('closing', 'taken', 'taking');
    if (again) {
      tomar(panel, false);
    } else {
      panel.querySelector('.win-title .t').textContent = AVISO;
      panel.querySelector('.win-title .ico').innerHTML = ico('warn');
      sfx('aviso');
      setTimeout(function () { tomar(panel, true); }, reduce ? 0 : 420);
    }
    var body = panel.querySelector('.ar-b');
    body.innerHTML =
      '<div class="ar-text"></div>' +
      '<p class="ar-sig">— A.R.</p>' +
      '<div class="ar-btns">' +
        (m.go ? '<a class="btn primary" href="' + m.go.href + '">' + m.go.t + '</a>' : '') +
        '<button type="button" class="btn" data-no>' + m.no + '</button>' +
      '</div>';
    var btns = body.querySelector('.ar-btns');
    var sig = body.querySelector('.ar-sig');
    body.querySelector('[data-no]').addEventListener('click', function () { cerrarAR(true); });
    var goA = btns.querySelector('a');
    if (goA && goA.getAttribute('href') === '#archive') {
      goA.addEventListener('click', function (e) { e.preventDefault(); cerrarAR(); verArchivo(); });
    }
    panel.hidden = false;
    paint();
    if (tab) tab.setAttribute('aria-expanded', 'true');
    function listo() {
      btns.style.visibility = sig.style.visibility = '';
      (goA || btns.querySelector('button')).focus({ preventScroll: true });
    }
    if (again) {
      var box = body.querySelector('.ar-text');
      m.lines.forEach(function (t) { var p = document.createElement('p'); p.textContent = t; box.appendChild(p); });
      listo();
    } else {
      btns.style.visibility = sig.style.visibility = 'hidden';
      typeLines(body.querySelector('.ar-text'), m.lines, listo);
    }
  }

  // el mensaje se guarda en la pestaña (no se pierde)
  function cerrarAR(focusTab) {
    if (!panelOpen()) return;
    function fin() { panel.hidden = true; panel.classList.remove('closing'); }
    clearTimeout(closeT);
    if (reduce) fin();
    else { panel.classList.add('closing'); closeT = setTimeout(fin, 200); }
    if (tab) {
      tab.setAttribute('aria-expanded', 'false');
      tab.classList.remove('ping');
      void tab.offsetWidth;
      tab.classList.add('ping');
      if (focusTab) tab.focus({ preventScroll: true });
    }
  }

  /* ==========================================================
     4. la interrupción del envío: nadie firma sin ver el acta.
        site.js llama a ATLAS.interrumpir(seguir) al validar el formulario.
     ========================================================== */
  A.interrumpir = function (seguir) {
    cerrarAR();
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
    archivo();                                                // abre /archive/ en vivo
    var id = due();
    if (!id) return;
    if (Date.now() - lastHall < 1800) return;                 // dejar leer el aviso del campo leído
    // se abrió el archivo: A.R. avisa en el acto, aunque su mensaje anterior siga
    // abierto, se esté seleccionando lo tachado o el archivo ya esté en pantalla
    if (id === 'ar3') { if (!modalAbierto()) showAR(id); return; }
    if (busy()) return;
    var ae = document.activeElement;
    if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return;
    var sel = window.getSelection && window.getSelection().toString().trim();
    if (sel) return;                                          // está seleccionando: no interrumpir
    showAR(id);
  }

  document.addEventListener('atlas:comunicado', function () {
    setTimeout(function () { showAR('arFin'); }, 2600);
  });

  /* ==========================================================
     5. /archive/ (debajo de la tabla de Documentos): bloqueado o abierto.
        abierto no es lo mismo que leído: cuenta como leído (store
        'archivo') cuando el acta llega a la pantalla.
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
    var acta = document.getElementById('acta-archivo');
    acta = acta ? (acta.closest('.win') || acta) : openV;
    function leido() {
      if (store.get('archivo', false)) return;
      store.set('archivo', true);
      // si A.R. ya avisó, su mensaje vuelve a la pestaña para dejar leer
      if (seen('ar3') && store.get('arLast', '') === 'ar3') cerrarAR();
      setTimeout(function () { toast('ESTA SESIÓN NO QUEDA REGISTRADA', { ok: true, ms: 3000 }); }, 900);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) leido();
      }, { threshold: 0.35 }).observe(acta);
      new IntersectionObserver(function (en) {
        leyendo = en[0].isIntersecting;
      }).observe(openV);
    } else {
      leido();
    }
    grabacion();
  }

  // lleva la vista al archivo (botón de A.R. y barra de tareas)
  function verArchivo() {
    var h = document.getElementById('archive');
    if (h) h.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
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

  /* ==========================================================
     7. el procedimiento: los cuatro botones de la barra, en orden.
        arriba, dónde está (y ✓ en lo ya visto); abajo, un solo
        botón para seguir. fuera del procedimiento (Acerca de) el
        botón lo devuelve al primer paso pendiente.
     ========================================================== */
  var PASOS = [
    { href: 'index.html', t: 'Inicio' },
    { href: 'mision.html', t: 'Misión y puestos' },
    { href: 'documentos.html', t: 'Documentos' },
    { href: 'solicitud.html', t: 'Postulación' }
  ];
  var actual = -1;
  PASOS.forEach(function (p, i) { if (p.href === here) actual = i; });

  function hecho(i) {
    if (i === PASOS.length - 1) return applied();
    return store.get('visited', []).indexOf(PASOS[i].href) > -1;
  }
  // adónde lleva el botón: al paso que sigue o, fuera del procedimiento, al primero pendiente
  function siguiente() {
    if (actual > -1) return actual + 1 < PASOS.length ? actual + 1 : -1;
    for (var i = 0; i < PASOS.length; i++) if (!hecho(i)) return i;
    return -1;
  }

  // en el formulario el paso siguiente es el botón Enviar
  var pad = document.querySelector('#doc .pad');
  var sig0 = siguiente();
  if (pad && here !== 'solicitud.html' && sig0 > -1) {
    var seguir = document.createElement('div');
    seguir.className = 'seguir';
    seguir.innerHTML =
      '<span>' + (actual > -1 ? 'Paso ' + (actual + 1) + ' de ' + PASOS.length : 'Fuera del procedimiento') + '</span>' +
      '<a class="btn primary big" href="' + PASOS[sig0].href + '">' +
        (actual > -1 ? 'Siguiente' : 'Continuar') + ': ' + PASOS[sig0].t + ' &rsaquo;</a>';
    pad.appendChild(seguir);
  }

  // la barra: ✓ en los pasos vistos; fuera del procedimiento, el pendiente con borde
  function pintarNav() {
    var sig = actual > -1 ? -1 : siguiente();
    PASOS.forEach(function (p, i) {
      var a = document.querySelector('#nav a[href="' + p.href + '"]');
      if (!a) return;
      // el paso en curso no lleva ✓, salvo la postulación ya enviada
      var ok = hecho(i) && (i !== actual || i === PASOS.length - 1);
      a.classList.toggle('next', i === sig);
      var v = a.querySelector('.ok');
      if (ok && !v) a.insertAdjacentHTML('beforeend', '<span class="ok" title="Visto">✓</span>');
      else if (!ok && v) v.remove();
    });
  }

  /* --- arranque ---------------------------------------------- */
  if (!started()) showAcceso();
  document.addEventListener('atlas:start', function () { loop(); });
  loop();
  setInterval(loop, 1000);
})();
