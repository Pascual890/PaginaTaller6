/* ============================================================
   ATLAS — sonidos de terminal (sutiles)
   Todo se sintetiza con Web Audio: no hay archivos de audio.
   Uso desde los otros scripts: ATLAS.sfx('nombre')
     click   botones y enlaces (se engancha solo, por delegación)
     key     máquina de escribir de A.R. / líneas de arranque
     aviso   aparece una ventana (A.R., aviso de convocatoria)
     toma    A.R. toma la ventana (ráfaga de estática)
     ok      toast de confirmación / hallazgo
     error   toast de error u operación no permitida
     paso    avance de la barra de carga del envío
   El parlante de la barra de tareas (junto al reloj) silencia todo;
   la preferencia queda en localStorage.
   Carga antes de site.js para que ATLAS.sfx exista desde el inicio.
   ============================================================ */
(function () {
  'use strict';

  var A = window.ATLAS = window.ATLAS || {};
  var KEY = 'atlas2_mute';
  var VOL = 0.5;                       // volumen general (0–1)

  var muted = false;
  try { muted = localStorage.getItem(KEY) === '1'; } catch (e) {}

  var ctx = null, master = null, noiseBuf = null;
  function audio() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }
    master = ctx.createGain();
    master.gain.value = VOL;
    master.connect(ctx.destination);
    // medio segundo de ruido blanco para clics y estática
    noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }
  // el navegador sólo deja sonar después de una interacción
  function unlock() {
    var c = audio();
    if (c && c.state === 'suspended') c.resume();
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, unlock, { capture: true, passive: true });
  });

  /* --- piezas ------------------------------------------------- */
  function tone(freq, start, dur, gain, type) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(master);
    o.start(start); o.stop(start + dur + 0.02);
  }
  function noise(start, dur, gain, freq, q) {
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf;
    s.loop = dur > 0.5;
    f.type = 'bandpass';
    f.frequency.setValueAtTime(freq, start);
    f.Q.value = q || 1;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(start, Math.random() * 0.3); s.stop(start + dur + 0.02);
    return f;
  }

  var SFX = {
    // tecla mecánica corta
    click: function (t) {
      noise(t, 0.025, 0.22, 2600, 1.4);
      tone(180, t, 0.03, 0.05, 'triangle');
    },
    // tic de teletipo, con un poco de variación para que no suene a metrónomo
    key: function (t) {
      noise(t, 0.012, 0.07, 3200 + Math.random() * 900, 2);
    },
    // pitido de terminal: dos tonos breves
    aviso: function (t) {
      tone(880, t, 0.09, 0.06);
      tone(660, t + 0.11, 0.12, 0.05);
    },
    // A.R. entra en la ventana: estática que se cierra
    toma: function (t) {
      var f = noise(t, 0.22, 0.12, 900, 0.8);
      f.frequency.exponentialRampToValueAtTime(3500, t + 0.2);
      tone(55, t, 0.18, 0.05, 'sawtooth');
    },
    ok: function (t) {
      tone(660, t, 0.06, 0.04);
      tone(990, t + 0.07, 0.09, 0.04);
    },
    error: function (t) {
      tone(150, t, 0.16, 0.05, 'square');
    },
    paso: function (t) {
      tone(1320, t, 0.025, 0.025);
    }
  };

  var last = {};
  A.sfx = function (name) {
    if (muted || !SFX[name]) return;
    var c = audio();
    if (!c || c.state !== 'running') return;
    // evita amontonar el mismo sonido (p. ej. clic + aviso en el mismo instante)
    var now = c.currentTime;
    if (last[name] && now - last[name] < 0.03) return;
    last[name] = now;
    try { SFX[name](now + 0.005); } catch (e) {}
  };

  /* --- clics: botones, enlaces y opciones del formulario ------- */
  var CLICK = 'button, a[href], .btn, summary, label, select, ' +
    'input[type=checkbox], input[type=radio], input[type=submit], input[type=button]';
  document.addEventListener('pointerdown', function (e) {
    if (e.button && e.button !== 0) return;
    var el = e.target.closest && e.target.closest(CLICK);
    if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
    // el primer clic además desbloquea el audio: sonar cuando termine de arrancar
    var c = audio();
    if (c && c.state !== 'running') c.resume().then(function () { A.sfx('click'); }, function () {});
    else A.sfx('click');
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = document.activeElement;
    if (el && el.matches && el.matches('button, a[href], .btn, summary')) A.sfx('click');
  }, true);

  /* --- parlante en la barra de tareas (lo crea win.js) ---------- */
  var PIX = {
    on: [
      '................',
      '.......k........',
      '......kk.....d..',
      '.....kwk..d...d.',
      '.kkkkwwk...d..d.',
      '.kwwwwwk.d..d..d',
      '.kwwwwwk..d.d..d',
      '.kwwwwwk..d.d..d',
      '.kwwwwwk.d..d..d',
      '.kkkkwwk...d..d.',
      '.....kwk..d...d.',
      '......kk.....d..',
      '.......k........',
      '................'
    ],
    off: [
      '................',
      '.......k........',
      '......kk........',
      '.....kwk........',
      '.kkkkwwk........',
      '.kwwwwwk.R...R..',
      '.kwwwwwk..R.R...',
      '.kwwwwwk...R....',
      '.kwwwwwk..R.R...',
      '.kkkkwwk.R...R..',
      '.....kwk........',
      '......kk........',
      '.......k........',
      '................'
    ]
  };
  var COL = { k: '#000', w: '#fff', d: '#555', R: '#c0201a' };
  function pix(g) {
    var out = '';
    g.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var c = row.charAt(x);
        if (COL[c]) out += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + COL[c] + '"/>';
      }
    });
    return '<svg viewBox="0 0 16 14" width="16" height="14" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' + out + '</svg>';
  }

  function makeToggle() {
    var tray = document.getElementById('tray');
    if (!tray || document.getElementById('snd')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'snd';
    function paint() {
      b.innerHTML = pix(muted ? PIX.off : PIX.on);
      b.title = muted ? 'Sonido: apagado' : 'Sonido: encendido';
      b.setAttribute('aria-label', b.title);
      b.setAttribute('aria-pressed', muted ? 'true' : 'false');
    }
    b.addEventListener('click', function () {
      muted = !muted;
      try { localStorage.setItem(KEY, muted ? '1' : '0'); } catch (e) {}
      paint();
      if (!muted) { unlock(); A.sfx('ok'); }
    });
    paint();
    tray.insertBefore(b, tray.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', makeToggle);
  else makeToggle();
})();
