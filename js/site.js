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
    var err = form.querySelector('.ferr');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var problems = [];
      var nombre = form.nombre.value.trim();
      var edad = parseInt(form.edad.value, 10);
      var contacto = form.contacto.value.trim();
      var motiv = form.motivacion.value.trim();
      if (!nombre) problems.push('NOMBRE COMPLETO');
      if (!(edad >= 18)) problems.push('EDAD (18+)');
      if (!contacto) problems.push('CONTACTO');
      if (!form.querySelector('input[name=modalidad]:checked')) problems.push('MODALIDAD');
      if (!form.querySelector('input[name=puesto]:checked')) problems.push('PUESTO');
      if (!motiv) problems.push('MOTIVACIÓN');
      if (!form.querySelector('input[name=sueno]:checked') || !form.querySelector('input[name=sonido]:checked')) problems.push('EVALUACIÓN PERCEPTIVA');
      if (!form.disp.checked || !form.nda.checked) problems.push('DECLARACIONES');
      if (problems.length) {
        err.textContent = 'ERROR — CAMPOS INCOMPLETOS: ' + problems.join(' / ');
        err.classList.add('show');
        err.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
        return;
      }
      var puesto = form.querySelector('input[name=puesto]:checked').value;
      var ref = 'HELIOS-1/83-' + puesto + '-' + String(Math.floor(1000 + Math.random() * 9000));
      var ok = document.createElement('div');
      ok.className = 'term';
      ok.innerHTML =
        "<div class='hdr'>ATLAS CORPORATION — SISTEMA DE POSTULACIÓN — ACUSE DE RECIBO</div>" +
        "POSTULACIÓN REGISTRADA ............ <span class='warn'>OK</span><br>" +
        "REFERENCIA ...................... " + ref + "<br>" +
        "POSTULANTE ...................... " + nombre.toUpperCase().replace(/</g, '&lt;') + "<br>" +
        "PUESTO .......................... " + (puesto === 'AST' ? 'ASTRONAUTA (POS-AST-01)' : 'OPERADOR EN TIERRA (POS-OPT-01)') + "<br>" +
        "CONVOCATORIA .................... PÚBLICA 1983<br>" +
        "ÍNDICE DE PERTURBACIÓN .......... <span class='warn'>PROCESADO POR EL EQUIPO TÉCNICO</span><br>" +
        "RESPUESTA ESTIMADA .............. 5–10 DÍAS HÁBILES<br><br>" +
        "Conserve esta referencia. No la comparta.<br>" +
        "El puesto elegido determina su posición durante la misión. Los seleccionados recibirán el documento de instrucciones de Atlas Corporation.<br>" +
        "<span class='warn'>NOTA: el número de plazas restantes se ha actualizado.</span><br><br>" +
        "&gt; <a href='index.html'>volver al inicio</a> &nbsp;·&nbsp; <a href='mision.html'>leer el resumen de misión</a>" +
        "<br>&gt;&nbsp;<span class='cur'>&nbsp;</span>";
      form.parentNode.insertBefore(ok, form);
      form.remove();
      ok.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      try { sessionStorage.setItem('atlas_applied', ref); } catch (e) {}
    });
  }
})();
