/* ============================================================
   AEOI — interacciones normales del sitio
   (feed, contador, redacciones, nav, formulario, modal)
   ============================================================ */
(function () {
  'use strict';

  // prefers-reduced-motion manda, salvo override de prueba: ?motion=full | ?motion=reduce
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var m = /[?&]motion=(full|reduce)/.exec(location.search);
  if (m) reduce = (m[1] === 'reduce');
  window.AEOI = window.AEOI || {};
  window.AEOI.reduce = reduce;
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
  window.AEOI.toast = function (msg, opts) {
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
    window.AEOI.openModal = function () { modal.classList.add('on'); };
    window.AEOI.closeModal = function () { modal.classList.remove('on'); };
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('close')) {
        e.preventDefault();
        window.AEOI.closeModal();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') window.AEOI.closeModal();
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
      window.AEOI.toast('ESPEJO EN INGLÉS NO DISPONIBLE — ÚLTIMA SINCRONIZACIÓN 1997-09-01');
    });
  }

  /* --------------------------------------------------------
     2b. enlaces muertos: los PDF abiertos y los documentos legales
         no están en este servidor. Nunca lo estuvieron.
     -------------------------------------------------------- */
  document.querySelectorAll('a.dead').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var name = a.textContent.trim();
      window.AEOI.toast('404 — ' + name.toUpperCase() + ' NO SE ENCUENTRA EN ESTE SERVIDOR');
    });
  });

  /* --------------------------------------------------------
     3. el feed. se lee como telemetría, deriva como otra cosa.
     -------------------------------------------------------- */
  document.querySelectorAll('[data-feed]').forEach(function (box) {
    var kind = box.getAttribute('data-feed');
    var lines;
    if (kind === 'telemetry') {
      lines = [
        "04:17:02  TLM   ALT [CLASIF.]  TEMP 21.4C   ARRAY v2.4 OK",
        "04:17:09  CH-A  BARRIDO 0-90 GRAD ...... COMPLETO",
        "04:17:16  CH-A  RETORNO 47.300 MHZ ..... NOMINAL",
        "04:17:23  CH-C  IONOSFERA ............... NOMINAL",
        "04:17:31  CH-B  RETORNO 47.300 MHZ ..... NOMINAL",
        "04:17:38  DS-07 SEÑAL ................... <span class='bar'>&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;</span>",
        "04:17:45  CH-B  RETORNO 47.300 MHZ ..... <span class='warn'>NO PROGRAMADO</span>",
        "04:17:52  CH-A  BARRIDO 0-90 GRAD ...... COMPLETO",
        "04:17:59  TLM   OPERADOR VOZ ............ GRABANDO",
        "04:18:06  CH-B  ORIGEN RUMBO ............ <span class='warn'>ACERCÁNDOSE</span>",
        "04:18:13  CH-C  IONOSFERA ............... NOMINAL",
        "04:18:20  TLM   OPERADOR VOZ ............ <span class='bad'>SIN RESPUESTA</span>"
      ];
    } else {
      lines = [
        "04:17:02  CH-A  ALT NOMINAL   TEMP NOMINAL   ARRAY v2.4 OK",
        "04:17:09  CH-A  BARRIDO 0-90 GRAD ...... COMPLETO",
        "04:17:16  CH-A  RETORNO 47.300 MHZ ..... NOMINAL",
        "04:17:23  CH-A  REGISTRO VOZ OPERADOR .. GRABANDO",
        "04:17:31  CH-A  BARRIDO 0-90 GRAD ...... COMPLETO",
        "04:17:38  CH-A  RETORNO 47.300 MHZ ..... NOMINAL",
        "04:17:45  CH-B  RETORNO 47.300 MHZ ..... <span class='warn'>NO PROGRAMADO</span>",
        "04:17:52  CH-A  BARRIDO 0-90 GRAD ...... COMPLETO",
        "04:17:59  CH-A  RETORNO 47.300 MHZ ..... NOMINAL",
        "04:18:06  CH-B  ORIGEN RUMBO ............ <span class='warn'>ACERCÁNDOSE</span>",
        "04:18:13  CH-A  REGISTRO VOZ OPERADOR .. GRABANDO",
        "04:18:20  CH-A  RETORNO 47.300 MHZ ..... NOMINAL"
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
      var saved = parseInt(sessionStorage.getItem('aeoi_visits'), 10);
      if (saved) n = saved;
    } catch (e) {}
    function paintCounter() {
      c.textContent = ('00000000' + n).slice(-8);
      try { sessionStorage.setItem('aeoi_visits', n); } catch (e) {}
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
      if (!form.disp.checked || !form.nda.checked) problems.push('DECLARACIONES');
      if (problems.length) {
        err.textContent = 'ERROR — CAMPOS INCOMPLETOS: ' + problems.join(' / ');
        err.classList.add('show');
        err.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
        return;
      }
      var puesto = form.querySelector('input[name=puesto]:checked').value;
      var ref = 'OMM-7B/04-' + puesto + '-' + String(Math.floor(1000 + Math.random() * 9000));
      var ok = document.createElement('div');
      ok.className = 'term';
      ok.innerHTML =
        "<div class='hdr'>AEOI — SISTEMA DE GESTIÓN DE SOLICITUDES — ACUSE DE RECIBO</div>" +
        "SOLICITUD REGISTRADA ............ <span class='warn'>OK</span><br>" +
        "REFERENCIA ...................... " + ref + "<br>" +
        "SOLICITANTE ..................... " + nombre.toUpperCase().replace(/</g, '&lt;') + "<br>" +
        "PUESTO .......................... " + (puesto === 'OB' ? 'OPERADOR ORBITAL (POS-OB-01)' : 'OPERADOR DE CONTROL EN TIERRA (POS-CT-01)') + "<br>" +
        "CICLO ........................... 04<br>" +
        "RESPUESTA ESTIMADA .............. 5–10 DÍAS HÁBILES<br><br>" +
        "Conserve esta referencia. No la comparta.<br>" +
        "<span class='warn'>NOTA: el número de plazas restantes se ha actualizado.</span><br><br>" +
        "&gt; <a href='index.html'>volver al inicio</a> &nbsp;·&nbsp; <a href='mision.html'>leer el resumen de misión</a>" +
        "<br>&gt;&nbsp;<span class='cur'>&nbsp;</span>";
      form.parentNode.insertBefore(ok, form);
      form.remove();
      ok.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      try { sessionStorage.setItem('aeoi_applied', ref); } catch (e) {}
    });
  }
})();
