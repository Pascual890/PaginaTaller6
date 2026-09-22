/* ============================================================
   ATLAS — interacciones normales del sitio
   (feed, contador, redacciones, nav, formulario, modal)
   ============================================================ */
(function () {
  'use strict';

  // efectos siempre activos (se ignora prefers-reduced-motion del sistema);
  // override de prueba: ?motion=reduce | ?motion=full
  var reduce = false;
  var m = /[?&]motion=(full|reduce)/.exec(location.search);
  if (m) reduce = (m[1] === 'reduce');
  window.ATLAS = window.ATLAS || {};
  window.ATLAS.reduce = reduce;
  document.documentElement.classList.add(reduce ? 'motion-reduce' : 'motion-full');

  /* --------------------------------------------------------
     0. utilidades compartidas: toast y modal
     -------------------------------------------------------- */
  var toastEl = document.getElementById('toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast';
    toastEl.setAttribute('role', 'status');
    document.body.appendChild(toastEl);
  }
  var toastTimer = null;
  window.ATLAS.toast = function (msg, opts) {
    opts = opts || {};
    clearTimeout(toastTimer);
    toastEl.className = '';
    toastEl.textContent = msg;
    // reflow para reiniciar la animación de shake
    void toastEl.offsetWidth;
    toastEl.className = 'on' + (opts.ok ? ' ok' : '') + (opts.shake ? ' shake' : '');
    toastTimer = setTimeout(function () { toastEl.className = ''; }, opts.ms || 2600);
  };

  var modal = document.getElementById('modal');
  if (modal) {
    window.ATLAS.openModal = function () { modal.classList.add('on'); };
    window.ATLAS.closeModal = function () { modal.classList.remove('on'); };
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('close')) {
        e.preventDefault();
        window.ATLAS.closeModal();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') window.ATLAS.closeModal();
    });
  }

  /* --------------------------------------------------------
     1. nav: marcar la página actual
     -------------------------------------------------------- */
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('#nav a').forEach(function (a) {
    var target = (a.getAttribute('href') || '').toLowerCase();
    if (target === here) a.classList.add('here');
  });

  /* --------------------------------------------------------
     2. toggle EN: no funcional. el espejo en inglés no existe.
     -------------------------------------------------------- */
  var lang = document.getElementById('lang');
  if (lang) {
    lang.addEventListener('click', function (e) {
      e.preventDefault();
      window.ATLAS.toast('ESPEJO EN INGLÉS NO DISPONIBLE — ÚLTIMA SINCRONIZACIÓN 1983-04-11');
    });
  }

  /* --------------------------------------------------------
     2b. enlaces muertos: los PDF abiertos y los documentos legales
         no están en este terminal. Nunca lo estuvieron.
     -------------------------------------------------------- */
  document.querySelectorAll('a.dead').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var name = a.textContent.trim();
      window.ATLAS.toast('404 — ' + name.toUpperCase() + ' NO SE ENCUENTRA EN ESTE TERMINAL');
    });
  });

  /* --------------------------------------------------------
     3. el feed. se lee como telemetría, deriva como otra cosa.
     -------------------------------------------------------- */
  document.querySelectorAll('[data-feed]').forEach(function (box) {
    var kind = box.getAttribute('data-feed');
    var lines;
    if (kind === 'telemetry') {
      // simulación predictiva de la misión. el modelo sabe más de lo que debería.
      lines = [
        "T+00:00:00  SONDA  ATLAS-H SISTEMAS ....... NOMINAL",
        "T+00:00:07  ALIN   ALINEACIÓN LUNAR ....... 98.2%",
        "T+00:00:14  EMIS   EMISOR DE ONDA ......... ARMADO",
        "T+00:00:21  CH-A   TIERRA &harr; SONDA .......... NOMINAL",
        "T+00:00:28  SOL    LUMINOSIDAD ............ ESTABLE",
        "T+00:00:35  EMIS   ONDA ENVIADA ........... <span class='warn'>OK</span>",
        "T+00:00:42  SOL    PERTURBACIÓN ........... DISMINUYENDO",
        "T+00:00:49  ACU    FRECUENCIA BAJA ........ <span class='warn'>DETECTADA (VACÍO)</span>",
        "T+00:00:56  SOL    LUMINOSIDAD ............ <span class='bad'>PARPADEO 1</span>",
        "T+00:01:03  SOL    LUMINOSIDAD ............ <span class='bad'>PARPADEO 2</span>",
        "T+00:01:10  SOL    LUMINOSIDAD ............ <span class='bad'>PARPADEO 3</span>",
        "T+00:01:17  VISOR  ASTRONAUTA ............. <span class='warn'>FORMA NO CLASIFICADA</span>",
        "T+00:01:24  MON    OPERADOR TIERRA ........ <span class='warn'>MISMA IMAGEN</span>",
        "T+00:01:31  CH-A   TIERRA &harr; SONDA .......... <span class='bad'>INTERFERENCIA</span>"
      ];
    } else {
      lines = [
        "11:59:34  SOL   RADIACIÓN ............... NOMINAL",
        "11:59:41  SOL   ESPECTRO H-ALFA ......... NOMINAL",
        "11:59:48  ACU   FRECUENCIA BAJA ......... <span class='warn'>SIN FUENTE</span>",
        "11:59:55  SOL   LUMINOSIDAD ............. NOMINAL",
        "12:00:00  SOL   LUMINOSIDAD ............. <span class='bad'>ALTERACIÓN 0.4 S</span>",
        "12:00:04  ACU   FRECUENCIA BAJA ......... <span class='warn'>AUMENTANDO</span>",
        "12:00:11  SOL   ESPECTRO H-ALFA ......... <span class='warn'>NO CLASIFICADO</span>",
        "12:00:18  OBS   OPERADOR ESTACIÓN 1 ..... <span class='bad'>SIN RESPUESTA</span>",
        "12:00:25  OBS   RELOJ DE SALA ........... <span class='bar'>&#9608;&#9608;&#9608;&#9608;&#9608;</span> DETENIDO",
        "12:00:32  SOL   LUMINOSIDAD ............. NOMINAL",
        "12:00:39  ACU   FRECUENCIA BAJA ......... <span class='warn'>PERSISTE</span>",
        "12:00:46  SOL   ESPECTRO H-ALFA ......... NOMINAL"
      ];
    }
    var i = 0, shown = [];
    function draw() {
      box.innerHTML = shown.join('<br>') + '<br>&gt;&nbsp;<span class="cur">&nbsp;</span>';
    }
    function push() {
      shown.push(lines[i % lines.length]);
      if (shown.length > 7) shown.shift();
      i++;
      draw();
    }
    if (reduce) {
      shown = lines.slice(0, 7); draw();
    } else {
      for (var k = 0; k < 7; k++) push();
      setInterval(push, 2600);
    }
  });

  /* --------------------------------------------------------
     4. el contador. cuenta. no siempre hacia arriba.
     -------------------------------------------------------- */
  var c = document.getElementById('counter');
  if (c) {
    var n = 4783;
    try {
      var saved = parseInt(sessionStorage.getItem('atlas_visits'), 10);
      if (saved) n = saved;
    } catch (e) {}
    function paintCounter() {
      c.textContent = ('00000000' + n).slice(-8);
      try { sessionStorage.setItem('atlas_visits', n); } catch (e) {}
    }
    n += 1;
    paintCounter();
    if (!reduce) {
      setInterval(function () {
        n += Math.random() < 0.82 ? 1 : -3;
        paintCounter();
      }, 7000);
    }
  }

  /* --------------------------------------------------------
     5. redacción .rd: pasar el mouse no descifra. filtra.
     -------------------------------------------------------- */
  document.querySelectorAll('.rd').forEach(function (el) {
    var block = el.textContent;
    var t = null;
    el.addEventListener('mouseenter', function () {
      el.textContent = el.dataset.r;
      clearTimeout(t);
      t = setTimeout(function () { el.textContent = block; }, 900);
    });
  });

  /* --------------------------------------------------------
     6. formulario de solicitud: sin backend, con confirmación.
     -------------------------------------------------------- */
  var form = document.getElementById('solicitud');
  if (form) {
    var err = form.querySelector('.ferr:not(#err-rol)');
    var errRol = document.getElementById('err-rol');
    var p2 = document.getElementById('p2');
    var avisoInd = document.getElementById('aviso-ind');
    var POS = { AST: 'ASTRONAUTA (POS-AST-01)', OPT: 'OPERADOR EN TIERRA (POS-OPT-01)' };

    function checked(name) {
      var el = form.querySelector('input[name=' + name + ']:checked');
      return el ? el.value : '';
    }
    function esc(t) {
      return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function isPair() { return checked('modalidad') === 'pareja'; }

    // los dos postulantes no pueden ocupar el mismo puesto
    function rolConflict() {
      return isPair() && checked('puesto') && checked('puesto') === checked('puesto2');
    }
    function checkRol() {
      if (rolConflict()) {
        errRol.textContent = 'ERROR — LOS DOS POSTULANTES NO PUEDEN OCUPAR EL MISMO PUESTO. ' +
          'SELECCIONE PARA EL POSTULANTE 2 EL PUESTO RESTANTE.';
        errRol.classList.add('show');
      } else {
        errRol.classList.remove('show');
      }
    }

    // modalidad: muestra/oculta la segunda persona, el aviso individual,
    // pasa los textos a plural y renumera las secciones visibles
    function applyMode() {
      var mode = checked('modalidad');
      var pair = mode === 'pareja';
      p2.hidden = !pair;
      avisoInd.hidden = mode !== 'individual';
      form.querySelectorAll('[data-pl]').forEach(function (el) {
        if (el.dataset.sg === undefined) el.dataset.sg = el.innerHTML;
        el.innerHTML = pair ? el.dataset.pl : el.dataset.sg;
      });
      var n = 0;
      form.querySelectorAll('fieldset').forEach(function (fs) {
        if (fs.hidden) return;
        var lg = fs.querySelector('legend');
        var t = (pair && lg.dataset.tp) || lg.dataset.t;
        lg.textContent = '[' + ('0' + (++n)).slice(-2) + '] ' + t;
      });
      checkRol();
    }

    form.addEventListener('change', function (e) {
      var name = e.target.name;
      if (name === 'modalidad') applyMode();
      else if (name === 'puesto' || name === 'puesto2') checkRol();
    });
    applyMode();
    // el navegador puede restaurar la modalidad elegida al volver atrás
    window.addEventListener('pageshow', applyMode);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var problems = [];
      var pair = isPair();
      var nombre = form.nombre.value.trim();
      var contacto = form.contacto.value.trim();
      var nombre2 = form.nombre2.value.trim();
      var contacto2 = form.contacto2.value.trim();
      var puesto = checked('puesto');
      var puesto2 = checked('puesto2');
      if (!nombre) problems.push(pair ? 'NOMBRE (POSTULANTE 1)' : 'NOMBRE COMPLETO');
      if (!contacto) problems.push(pair ? 'DIRECCIÓN (POSTULANTE 1)' : 'DIRECCIÓN DE CONTACTO');
      if (!checked('modalidad')) problems.push('MODALIDAD');
      if (!puesto) problems.push(pair ? 'PUESTO (POSTULANTE 1)' : 'PUESTO');
      if (pair) {
        if (!nombre2) problems.push('NOMBRE (POSTULANTE 2)');
        if (!contacto2) problems.push('DIRECCIÓN (POSTULANTE 2)');
        if (!puesto2) problems.push('PUESTO (POSTULANTE 2)');
        else if (puesto2 === puesto) problems.push('PUESTOS DUPLICADOS');
      }
      if (!checked('sueno') || !checked('sonido')) problems.push('EVALUACIÓN PERCEPTIVA');
      if (!form.disp.checked || !form.nda.checked) problems.push('DECLARACIONES');
      checkRol();
      if (problems.length) {
        err.textContent = 'ERROR — CAMPOS INCOMPLETOS O INVÁLIDOS: ' + problems.join(' / ');
        err.classList.add('show');
        err.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
        return;
      }
      var ref = 'HELIOS-1/83-' + (pair ? 'PAR' : puesto) + '-' + String(Math.floor(1000 + Math.random() * 9000));
      var datos = pair
        ? "MODALIDAD ....................... EN PAREJA<br>" +
          "POSTULANTE 1 .................... " + esc(nombre.toUpperCase()) + "<br>" +
          "&nbsp;&nbsp;PUESTO ........................ " + POS[puesto] + "<br>" +
          "POSTULANTE 2 .................... " + esc(nombre2.toUpperCase()) + "<br>" +
          "&nbsp;&nbsp;PUESTO ........................ " + POS[puesto2] + "<br>"
        : "MODALIDAD ....................... INDIVIDUAL<br>" +
          "POSTULANTE ...................... " + esc(nombre.toUpperCase()) + "<br>" +
          "PUESTO .......................... " + POS[puesto] + "<br>" +
          "PUESTO RESTANTE ................. <span class='warn'>INTERNO ATLAS — ASIGNACIÓN AUTOMÁTICA</span><br>";
      var ok = document.createElement('div');
      ok.className = 'term';
      ok.innerHTML =
        "<div class='hdr'>ATLAS CORPORATION — SISTEMA DE POSTULACIÓN — ACUSE DE RECIBO</div>" +
        "POSTULACIÓN REGISTRADA ............ <span class='warn'>OK</span><br>" +
        "REFERENCIA ...................... " + ref + "<br>" +
        datos +
        "CONVOCATORIA .................... PÚBLICA 1983<br>" +
        "ÍNDICE DE PERTURBACIÓN .......... <span class='warn'>PROCESADO POR EL EQUIPO TÉCNICO</span><br>" +
        "RESPUESTA ESTIMADA .............. 5–10 DÍAS HÁBILES<br><br>" +
        (pair
          ? "Conserven esta referencia. No la compartan.<br>" +
            "Los puestos elegidos determinan su posición durante la misión. Los seleccionados recibirán el documento de instrucciones de Atlas Corporation.<br>"
          : "Conserve esta referencia. No la comparta.<br>" +
            "El puesto elegido determina su posición durante la misión. El interno asignado le será presentado en la sesión informativa.<br>") +
        "<span class='warn'>NOTA: el número de plazas restantes se ha actualizado.</span><br><br>" +
        "&gt; <a href='index.html'>volver al inicio</a> &nbsp;·&nbsp; <a href='mision.html'>leer el resumen de misión</a>" +
        "<br>&gt;&nbsp;<span class='cur'>&nbsp;</span>";
      try { sessionStorage.setItem('atlas_applied', ref); } catch (e) {}

      // primero la carga; al terminar, el acuse de recibo y la felicitación
      var load = loading(pair);
      form.parentNode.insertBefore(load, form);
      form.remove();
      load.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      runLoading(load, pair, function () {
        load.parentNode.insertBefore(ok, load);
        load.remove();
        ok.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
        showSelected({
          pair: pair, ref: ref,
          people: pair
            ? [{ n: nombre, r: puesto }, { n: nombre2, r: puesto2 }]
            : [{ n: nombre, r: puesto }]
        });
      });
    });
  }

  /* --------------------------------------------------------
     6b. carga de la postulación: ~8 s, con pasos y un 99% que se atasca
     -------------------------------------------------------- */
  var CARGA_MS = 8000;

  function ico(name, size) {
    return window.ATLAS.icon ? window.ATLAS.icon(name, size) : '';
  }

  function loading(pair) {
    var el = document.createElement('div');
    el.className = 'loading';
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<div class="ld-fly" aria-hidden="true">' +
        '<span class="ld-a">' + ico('folder', 32) + '</span>' +
        '<span class="ld-doc">' + ico('doc', 24) + '</span>' +
        '<span class="ld-b">' + ico('computer', 32) + '</span>' +
      '</div>' +
      '<p class="ld-h">' + (pair ? 'Enviando sus postulaciones…' : 'Enviando su postulación…') + '</p>' +
      '<p class="ld-s">Esto puede tardar unos segundos. No cierre ni recargue esta página.</p>' +
      '<div class="pbar"><i style="width:0"></i></div>' +
      '<div class="ld-row"><span class="ld-step">Iniciando transmisión…</span><span class="ld-pct">0%</span></div>';
    return el;
  }

  function runLoading(el, pair, done) {
    var steps = [
      [0, 'Verificando datos personales…'],
      [0.18, 'Cotejando con el Índice de Perturbación de la entrevista…'],
      [0.38, pair ? 'Evaluando compatibilidad de la pareja…' : 'Buscando un interno disponible para el puesto restante…'],
      [0.58, 'Transmitiendo al Comité de Continuidad…'],
      [0.74, 'Esperando respuesta del Comité…'],
      [0.97, 'Respuesta recibida.']
    ];
    // avance irregular: rápido, lento, salto, atasco en 99%
    function pct(t) {
      if (t < 0.25) return t / 0.25 * 41;
      if (t < 0.6) return 41 + (t - 0.25) / 0.35 * 32;
      if (t < 0.72) return 73 + (t - 0.6) / 0.12 * 26;
      if (t < 0.96) return 99;
      return 100;
    }
    var bar = el.querySelector('.pbar i');
    var stepEl = el.querySelector('.ld-step');
    var pctEl = el.querySelector('.ld-pct');
    var t0 = Date.now();
    var iv = setInterval(function () {
      var t = Math.min(1, (Date.now() - t0) / CARGA_MS);
      var p = Math.floor(pct(t));
      bar.style.width = p + '%';
      pctEl.textContent = p + '%';
      for (var i = steps.length - 1; i >= 0; i--) {
        if (t >= steps[i][0]) { stepEl.textContent = steps[i][1]; break; }
      }
      if (t >= 1) {
        clearInterval(iv);
        setTimeout(done, 400);
      }
    }, 100);
  }

  /* --------------------------------------------------------
     6c. la felicitación: un popup genérico, feo y demasiado entusiasta.
         no es el estilo de ATLAS-NET. no debería estar aquí.
     -------------------------------------------------------- */
  var LUGAR = 'CENTRAL DE COMANDO';
  var LUGAR_DET = 'Complejo Meridian — Zona 7';
  var ROL = {
    AST: { t: 'ASTRONAUTA', d: 'Plataforma de embarque de la sonda ATLAS-H' },
    OPT: { t: 'OPERADOR EN TIERRA', d: 'Consola principal de la Central de Comando' }
  };

  function arrow(cls) {
    return '<svg class="fz-arrow ' + cls + '" viewBox="0 0 60 60" aria-hidden="true">' +
      '<path d="M4 20 L30 20 L30 6 L56 30 L30 54 L30 40 L4 40 Z" fill="#e01010" stroke="#3a0404" stroke-width="3" stroke-linejoin="round"/></svg>';
  }

  function showSelected(d) {
    var e = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    var cards = d.people.map(function (p, i) {
      return '<div class="fz-card">' +
        '<small>' + (d.pair ? 'POSTULANTE ' + (i + 1) : 'POSTULANTE') + '</small>' +
        '<b>' + e(p.n) + '</b>' +
        '<span class="fz-role">' + ROL[p.r].t + '</span>' +
        '<em>Preséntese en: ' + ROL[p.r].d + '</em></div>';
    }).join('');
    if (!d.pair) {
      cards += '<div class="fz-card fz-int"><small>PUESTO RESTANTE</small><b>INTERNO ATLAS</b>' +
        '<span class="fz-role">' + ROL[d.people[0].r === 'AST' ? 'OPT' : 'AST'].t + '</span>' +
        '<em>Asignado automáticamente. Lo conocerá allí.</em></div>';
    }
    var total = window.ATLAS.inscritos ? window.ATLAS.inscritos() : 40000;
    var fmt = total.toLocaleString('es');
    var sel = d.pair ? 'USTEDES HAN SIDO SELECCIONADOS' : 'USTED HA SIDO SELECCIONADO';
    var mq = ('★ ¡¡FELICIDADES!! ★ ' + sel + ' PARA LA MISIÓN HELIOS-1 ★ DIRÍJA' + (d.pair ? 'NSE' : 'SE') +
      ' A LA ' + LUGAR + ' ★ WOOOOO ★ ').repeat(3);

    var box = document.createElement('div');
    box.id = 'felicidades';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'fz-t');
    box.innerHTML =
      '<div class="fz-box">' +
        '<button type="button" class="fz-x" aria-label="Cerrar">&times;</button>' +
        '<div class="fz-mq" aria-hidden="true"><span>' + mq + '</span></div>' +
        '<h2 id="fz-t" class="fz-big">¡¡¡FELICIDADES!!!</h2>' +
        '<p class="fz-rainbow">' + sel.split(' ').map(function (w, j) {
          return '<span class="w">' + w.split('').map(function (c, i) {
            return '<span style="--k:' + (j * 9 + i) + '">' + c + '</span>';
          }).join('') + '</span>';
        }).join(' ') + '</p>' +
        '<p class="fz-sub">Entre <b>' + fmt + '</b> postulantes, el Comité de Continuidad ' +
          (d.pair ? 'los eligió a ustedes' : 'lo eligió a usted') + '.</p>' +
        '<div class="fz-stage">' + arrow('a1') + arrow('a2') + arrow('a3') + arrow('a4') +
          '<div class="fz-cards">' + cards + '</div></div>' +
        '<div class="fz-go">¡¡DIRÍJA' + (d.pair ? 'NSE' : 'SE') + ' DE INMEDIATO A LA <u>' + LUGAR + '</u>!!' +
          '<small>' + LUGAR_DET + '. Presente' + (d.pair ? 'n' : '') + ' esta pantalla y la referencia <b>' +
          d.ref + '</b> al personal de Atlas.</small></div>' +
        '<div class="fz-row">' +
          '<div class="fz-bubble">CONFÍE EN NOSOTROS…<b>¡¡SOMOS ATLAS!!</b><span>la empresa espacial de confianza desde 1954</span></div>' +
          '<div class="fz-seal" aria-hidden="true"><span class="fz-seal-c">★<br>ATLAS<br>★</span><span class="fz-seal-r">SELLO DE APROBACIÓN</span></div>' +
        '</div>' +
        '<button type="button" class="fz-btn">¡¡¡HAGA CLIC AQUÍ PARA CONFIRMAR!!!</button>' +
        '<p class="fz-foot">SuperPopup Lite 2.0.3 — <a href="#" class="fz-pro">Actualice a PRO</a> para quitar este mensaje</p>' +
      '</div>';
    document.body.appendChild(box);

    function close() {
      box.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(ev) { if (ev.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    box.querySelector('.fz-x').addEventListener('click', close);
    box.querySelector('.fz-btn').addEventListener('click', function () {
      close();
      window.ATLAS.toast('ASISTENCIA CONFIRMADA — LO' + (d.pair ? 'S' : '') + ' ESTAMOS ESPERANDO', { ok: true, ms: 4000 });
    });
    box.querySelector('.fz-pro').addEventListener('click', function (ev) {
      ev.preventDefault();
      window.ATLAS.toast('LICENCIA PRO NO DISPONIBLE EN ESTE TERMINAL');
    });
    box.querySelector('.fz-btn').focus({ preventScroll: true });
  }

  /* --------------------------------------------------------
     7. personas inscritas: crece con el tiempo real y en vivo.
        nunca retrocede (sessionStorage guarda el máximo mostrado).
     -------------------------------------------------------- */
  var T0 = Date.UTC(2026, 8, 1);
  function inscritosBase() {
    return 12480 + Math.floor((Date.now() - T0) / 45000);   // una persona cada 45 s
  }
  var inscritos = inscritosBase();
  try {
    var guardado = parseInt(sessionStorage.getItem('atlas_inscritos'), 10);
    if (guardado > inscritos) inscritos = guardado;
  } catch (e) {}
  window.ATLAS.inscritos = function () { return inscritos; };

  var insEls = document.querySelectorAll('[data-inscritos]');
  if (insEls.length) {
    var paintIns = function (plus) {
      insEls.forEach(function (el) {
        el.querySelector('.odo').textContent = ('0000000' + inscritos).slice(-7);
        var up = el.querySelector('.up');
        if (plus && up) {
          up.textContent = '▲ +' + plus;
          up.classList.remove('on');
          void up.offsetWidth;
          up.classList.add('on');
        }
      });
      try { sessionStorage.setItem('atlas_inscritos', inscritos); } catch (e) {}
    };
    paintIns(0);
    if (!reduce) {
      (function next() {
        setTimeout(function () {
          var plus = Math.random() < 0.75 ? 1 : 2 + Math.floor(Math.random() * 3);
          inscritos += plus;
          paintIns(plus);
          next();
        }, 2200 + Math.random() * 3300);
      })();
    }
  }
})();
