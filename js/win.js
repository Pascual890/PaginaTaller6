/* ============================================================
   ATLAS — capa de ventanas
   íconos pixelados, barras de título, barra de tareas con menú
   Inicio y avisos emergentes de la convocatoria.
   ============================================================ */
(function () {
  'use strict';

  var A = window.ATLAS = window.ATLAS || {};
  var reduce = !!A.reduce;
  function toast(msg) { if (A.toast) A.toast(msg); }

  /* --------------------------------------------------------
     0. íconos: cuadrículas de texto, un carácter por píxel.
        la paleta es la del sitio.
     -------------------------------------------------------- */
  var PAL = {
    k: '#191712', w: '#efece1', p: '#d6d2c4', g: '#9d9a90', d: '#6d6858',
    r: '#8f1410', R: '#c81e1e', y: '#d6ad3c', Y: '#f0dc8c',
    G: '#37e05f', s: '#1c7a33', b: '#0a1f9c', n: '#05060a'
  };

  var ICONS = {
    computer: [
      '................',
      '.kkkkkkkkkkkkkk.',
      '.kwwwwwwwwwwwdk.',
      '.kwkkkkkkkkkwdk.',
      '.kwkGGGGGGGkwdk.',
      '.kwkGsGGGGGkwdk.',
      '.kwkGGGGGGGkwdk.',
      '.kwkGGGGGGGkwdk.',
      '.kwkkkkkkkkkwdk.',
      '.kwwwwwwwwwRwdk.',
      '.kddddddddddddk.',
      '.kkkkkkkkkkkkkk.',
      '......kddk......',
      '..kkkkkkkkkkkk..',
      '..kppppppppppk..',
      '..kkkkkkkkkkkk..'
    ],
    folder: [
      '................',
      '................',
      '.kkkkk..........',
      'kYYYYYk.........',
      'kYyyyyYkkkkkkkk.',
      'kYYYYYYYYYYYYYyk',
      'kYyyyyyyyyyyyydk',
      'kYyyyyyyyyyyyydk',
      'kYyyyyyyyyyyyydk',
      'kYyyyyyyyyyyyydk',
      'kYyyyyyyyyyyyydk',
      'kYyyyyyyyyyyyydk',
      'kYyyyyyyyyyyyydk',
      'kddddddddddddddk',
      'kkkkkkkkkkkkkkkk',
      '................'
    ],
    sun: [
      '................',
      '.......RR.......',
      '..R....RR....R..',
      '...R........R...',
      '.....kkkkkk.....',
      '....kyyyyyyk....',
      '....kyykkyyk....',
      'RR..kykkkkyk..RR',
      'RR..kykkkkyk..RR',
      '....kyykkyyk....',
      '....kyyyyyyk....',
      '.....kkkkkk.....',
      '...R........R...',
      '..R....RR....R..',
      '.......RR.......',
      '................'
    ],
    people: [
      '................',
      '................',
      '................',
      '..kkk.....kkk...',
      '.kpppk...kpppk..',
      '.kpppk...kpppk..',
      '.kpppk...kpppk..',
      '..kkk.....kkk...',
      '.kkkkk...kkkkk..',
      'krrrrrk.kdddddk.',
      'krrrrrk.kdddddk.',
      'krrrrrk.kdddddk.',
      'krrrrrk.kdddddk.',
      'kkkkkkk.kkkkkkk.',
      '................',
      '................'
    ],
    doc: [
      '................',
      '..kkkkkkkkk.....',
      '..kwwwwwwwkk....',
      '..kwwwwwwwkwk...',
      '..kwggggwwkkkk..',
      '..kwwwwwwwwwdk..',
      '..kwgggggggwdk..',
      '..kwwwwwwwwwdk..',
      '..kwgggggggwdk..',
      '..kwwwwwwwwwdk..',
      '..kwgggggggwdk..',
      '..kwwwwwwwwwdk..',
      '..kwgggggwwwdk..',
      '..kwwwwwwwwwdk..',
      '..kddddddddddk..',
      '..kkkkkkkkkkkk..'
    ],
    form: [
      '................',
      '.kkkkkkkkkkkkk..',
      '.kwwwwwwwwwwwkd.',
      '.kwkkkwwwwwwwkd.',
      '.kwkRkwggggwwkd.',
      '.kwkkkwwwwwwwkd.',
      '.kwwwwwwwwwwwkd.',
      '.kwkkkwwwwwwwkd.',
      '.kwkRkwgggggwkd.',
      '.kwkkkwwwwwwwkd.',
      '.kwwwwwwwwwwwkd.',
      '.kwkkkwwwwwwwkd.',
      '.kwkRkwgggwwwkd.',
      '.kwkkkwwwwwwwkd.',
      '.kkkkkkkkkkkkkd.',
      '..ddddddddddddd.'
    ],
    cabinet: [
      '................',
      '..kkkkkkkkkkkk..',
      '..kwwwwwwwwwwk..',
      '..kwppppppppdk..',
      '..kwppkkkkppdk..',
      '..kwppppppppdk..',
      '..kkkkkkkkkkkk..',
      '..kwwwwwwwwwwk..',
      '..kwppppppppdk..',
      '..kwppkRRkppdk..',
      '..kwppppppppdk..',
      '..kkkkkkkkkkkk..',
      '..kwwwwwwwwwwk..',
      '..kwppkkkkppdk..',
      '..kddddddddddk..',
      '..kkkkkkkkkkkk..'
    ],
    warn: [
      '.......kk.......',
      '......kyyk......',
      '......kyyk......',
      '.....kyyyyk.....',
      '.....kykkyk.....',
      '....kyykkyyk....',
      '....kyykkyyk....',
      '...kyyykkyyyk...',
      '...kyyykkyyyk...',
      '..kyyyykkyyyyk..',
      '..kyyyyyyyyyyk..',
      '.kyyyyykkyyyyyk.',
      '.kyyyyykkyyyyyk.',
      'kyyyyyyyyyyyyyyk',
      'kkkkkkkkkkkkkkkk',
      '................'
    ],
    error: [
      '................',
      '.....kkkkkk.....',
      '...kkRRRRRRkk...',
      '..kRRRRRRRRRRk..',
      '.kRRwwRRRRwwRRk.',
      '.kRRRwwRRwwRRRk.',
      'kRRRRRwwwwRRRRRk',
      'kRRRRRRwwRRRRRRk',
      'kRRRRRRwwRRRRRRk',
      'kRRRRRwwwwRRRRRk',
      '.kRRRwwRRwwRRRk.',
      '.kRRwwRRRRwwRRk.',
      '..kRRRRRRRRRRk..',
      '...kkRRRRRRkk...',
      '.....kkkkkk.....',
      '................'
    ],
    info: [
      '................',
      '.....kkkkkk.....',
      '...kkbbbbbbkk...',
      '..kbbbbwwbbbbk..',
      '.kbbbbbwwbbbbbk.',
      '.kbbbbbbbbbbbbk.',
      'kbbbbbwwwbbbbbbk',
      'kbbbbbbwwbbbbbbk',
      'kbbbbbbwwbbbbbbk',
      'kbbbbbbwwbbbbbbk',
      '.kbbbbbwwbbbbbk.',
      '.kbbbbwwwwbbbbk.',
      '..kbbbbbbbbbbk..',
      '...kkbbbbbbkk...',
      '.....kkkkkk.....',
      '................'
    ],
    terminal: [
      '................',
      '................',
      'kkkkkkkkkkkkkkkk',
      'kwwwwwwwwwwwwwdk',
      'kwkkkkkkkkkkkwdk',
      'kwkGkkkkkkkkkwdk',
      'kwkkGkkkkkkkkwdk',
      'kwkGkGGGkkkkkwdk',
      'kwkkkkkkkkkkkwdk',
      'kwkkkkkkkkkkkwdk',
      'kwkkkkkkkkkkkwdk',
      'kwwwwwwwwwwwwwdk',
      'kddddddddddddddk',
      'kkkkkkkkkkkkkkkk',
      '................',
      '................'
    ],
    image: [
      '................',
      '.kkkkkkkkkkkkkk.',
      '.kwwwwwwwwwwwwk.',
      '.kwnnnnnnnnnnwk.',
      '.kwnnnnnnnyynwk.',
      '.kwnnnwnnnyynwk.',
      '.kwnnnnnnnnnnwk.',
      '.kwnnnsnnnnnnwk.',
      '.kwnnsssnnnnnwk.',
      '.kwnsssssnnsnwk.',
      '.kwsssssssssswk.',
      '.kwwwwwwwwwwwwk.',
      '.kkkkkkkkkkkkkk.',
      '................',
      '................',
      '................'
    ],
    table: [
      '................',
      '.kkkkkkkkkkkkkk.',
      '.krrrrrrrrrrrrk.',
      '.kkkkkkkkkkkkkk.',
      '.kwwwdwwwwdwwwk.',
      '.kwwwdwwwwdwwwk.',
      '.kddddddddddddk.',
      '.kwwwdwwwwdwwwk.',
      '.kwwwdwwwwdwwwk.',
      '.kddddddddddddk.',
      '.kwwwdwwwwdwwwk.',
      '.kwwwdwwwwdwwwk.',
      '.kkkkkkkkkkkkkk.',
      '................',
      '................',
      '................'
    ],
    /* glifos de la barra de título */
    gmin: ['........', '........', '........', '........', '........', '.kkkkkk.', '.kkkkkk.'],
    gmax: ['kkkkkkkkk', 'kkkkkkkkk', 'k.......k', 'k.......k', 'k.......k', 'k.......k', 'kkkkkkkkk'],
    gx:   ['kk....kk', '.kk..kk.', '..kkkk..', '...kk...', '..kkkk..', '.kk..kk.', 'kk....kk']
  };

  // sello de la cabecera, reducido para el botón Inicio
  var SEAL = '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
    '<circle cx="50" cy="50" r="44" fill="none" stroke="#8f1410" stroke-width="9"/>' +
    '<ellipse cx="50" cy="50" rx="46" ry="16" fill="none" stroke="#191712" stroke-width="6" transform="rotate(-24 50 50)"/>' +
    '<circle cx="50" cy="50" r="13" fill="#191712"/></svg>';

  function icon(name, size) {
    var g = ICONS[name];
    if (!g) return '';
    var h = g.length, w = 0, x, y, c, x2, out = '';
    g.forEach(function (row) { if (row.length > w) w = row.length; });
    for (y = 0; y < h; y++) {
      for (x = 0; x < g[y].length; x++) {
        c = g[y].charAt(x);
        if (!PAL[c]) continue;
        x2 = x;
        while (g[y].charAt(x2 + 1) === c) x2++;
        out += '<rect x="' + x + '" y="' + y + '" width="' + (x2 - x + 1) + '" height="1" fill="' + PAL[c] + '"/>';
        x = x2;
      }
    }
    var px = size || w;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + px +
      '" height="' + Math.round(px * h / w) + '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' +
      out + '</svg>';
  }
  A.icon = icon;

  function fillIcons(root) {
    (root || document).querySelectorAll('[data-ico]').forEach(function (el) {
      if (!el.firstChild) el.innerHTML = icon(el.getAttribute('data-ico'), +el.getAttribute('data-size') || 16);
    });
    (root || document).querySelectorAll('.win-btns [data-b]').forEach(function (el) {
      if (!el.firstChild) el.innerHTML = icon('g' + el.getAttribute('data-b'));
    });
  }

  /* --------------------------------------------------------
     1. barras de título y envoltorios de ventana
     -------------------------------------------------------- */
  function titleBar(title, ico) {
    var bar = document.createElement('div');
    bar.className = 'win-title';
    bar.innerHTML = '<span class="ico" data-ico="' + ico + '"></span><span class="t"></span>' +
      '<span class="win-btns" aria-hidden="true"><span data-b="min"></span><span data-b="max"></span><span data-b="x"></span></span>';
    bar.querySelector('.t').textContent = title;
    return bar;
  }

  // envuelve el elemento en una ventana nueva (para .term, .tscroll, formularios, figuras)
  function wrap(el, title, ico, opts) {
    opts = opts || {};
    var w = document.createElement('div');
    w.className = 'win' + (opts.cls ? ' ' + opts.cls : '');
    el.parentNode.insertBefore(w, el);
    w.appendChild(titleBar(title, ico));
    var body = document.createElement('div');
    body.className = 'win-body' + (opts.pad ? '' : ' flush');
    w.appendChild(body);
    body.appendChild(el);
    return w;
  }

  // convierte el elemento mismo en ventana (conserva id, hidden y estilos en línea)
  function inPlace(el, title, ico) {
    var body = document.createElement('div');
    body.className = 'win-body';
    while (el.firstChild) body.appendChild(el.firstChild);
    el.classList.add('win');
    el.appendChild(titleBar(title, ico));
    el.appendChild(body);
    return el;
  }
  A.wrapWin = wrap;

  function clean(t) { return t.replace(/\s+/g, ' ').trim(); }
  function skip(el) { return el.closest('.win, .ad, #modal, .nag'); }

  // página actual
  var NAV = [
    { href: 'index.html', label: 'Inicio', ico: 'computer' },
    { href: 'acerca.html', label: 'Acerca de', ico: 'folder' },
    { href: 'mision.html', label: 'Misión HELIOS-1', ico: 'sun' },
    { href: 'puestos.html', label: 'Puestos', ico: 'people' },
    { href: 'documentos.html', label: 'Documentos', ico: 'doc' },
    { href: 'solicitud.html', label: 'Postulación', ico: 'form' },
    { href: 'archivo.html', label: 'Archivo', ico: 'cabinet' }
  ];
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var page = NAV[0];
  NAV.forEach(function (n) { if (n.href === here) page = n; });

  // la página entera es una ventana
  var doc = document.getElementById('doc');
  if (doc) {
    doc.insertBefore(titleBar('ATLAS-NET — Sistema de Información Pública — ' + page.label, page.ico), doc.firstChild);
  }

  // barra de herramientas con íconos
  document.querySelectorAll('#nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    NAV.forEach(function (n) {
      if (n.href === href) a.insertAdjacentHTML('afterbegin', '<span class="ico" data-ico="' + n.ico + '"></span>');
    });
  });

  // terminales: la cabecera verde pasa a la barra de título
  document.querySelectorAll('.term').forEach(function (t) {
    if (skip(t)) return;
    var hdr = t.querySelector('.hdr');
    var title = hdr ? clean(hdr.textContent) : 'ATLAS-NET — Terminal';
    if (hdr) hdr.remove();
    wrap(t, title, 'terminal');
  });

  // tablas de datos
  document.querySelectorAll('.tscroll').forEach(function (t) {
    if (skip(t)) return;
    wrap(t, t.getAttribute('data-win') || 'ATLAS-NET — Registro', t.getAttribute('data-win-ico') || 'table');
  });

  // recuadros y fichas: el h4 pasa a ser el título
  document.querySelectorAll('.box, .ficha').forEach(function (b) {
    if (skip(b)) return;
    var h = b.querySelector(':scope > h4');
    var title = b.getAttribute('data-win') || (h ? clean(h.textContent) : 'ATLAS-NET — Aviso');
    if (h) h.remove();
    inPlace(b, title, b.getAttribute('data-win-ico') || 'info');
  });

  // formulario de postulación
  var form = document.getElementById('solicitud');
  if (form && !skip(form)) wrap(form, 'SOLICITUD_HELIOS-1.FRM — Formulario de postulación', 'form', { pad: true });

  // figuras: visor de imágenes
  document.querySelectorAll('figure .frame').forEach(function (f) {
    if (skip(f)) return;
    var img = f.querySelector('img');
    var name = img ? (img.getAttribute('src') || '').split('/').pop() : 'imagen';
    wrap(f, name + ' — Visor ATLAS', 'image', { cls: 'inline' });
  });

  // imagen rota: diálogo de error
  document.querySelectorAll('.broken').forEach(function (b) {
    if (skip(b)) return;
    var m = /[\w-]+\.(gif|jpe?g|png)/i.exec(b.textContent);
    var file = m ? m[0] : 'imagen';
    var x = b.querySelector('b');
    if (x && /\[x\]/i.test(x.textContent)) x.remove();
    inPlace(b, file + ' — Error', 'error');
    var body = b.querySelector('.win-body');
    var txt = document.createElement('span');
    while (body.firstChild) txt.appendChild(body.firstChild);
    body.innerHTML = '<span class="ico" data-ico="error" data-size="32"></span>';
    body.appendChild(txt);
    var ok = document.createElement('span');
    ok.className = 'btn';
    ok.textContent = 'Aceptar';
    ok.addEventListener('click', function () {
      toast('404 — ' + file.toUpperCase() + ' NO SE ENCUENTRA EN ESTE TERMINAL');
    });
    body.appendChild(ok);
  });

  // botones de título de ventanas del sistema: no obedecen
  var NOPE = {
    min: 'NO SE PUEDE MINIMIZAR — VENTANA DEL SISTEMA ATLAS-NET',
    max: 'ESTA VENTANA YA ESTÁ EN SU TAMAÑO AUTORIZADO',
    x: 'ESTA VENTANA NO PUEDE CERRARSE DESDE ESTE TERMINAL'
  };
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.win-btns [data-b]');
    if (!btn || btn.closest('.nag')) return;
    var w = btn.closest('.win') || btn.closest('#doc');
    if (btn.closest('.ad') && btn.getAttribute('data-b') === 'x') {
      toast('ESTE ANUNCIO NO PUEDE CERRARSE. POSTÚLESE.');
    } else {
      toast(NOPE[btn.getAttribute('data-b')]);
    }
    if (w && !reduce) {
      w.classList.remove('nope');
      void w.offsetWidth;
      w.classList.add('nope');
    }
  });

  /* --------------------------------------------------------
     2. anuncio del inicio: la cascada se arma al entrar en pantalla
     -------------------------------------------------------- */
  var ads = [].slice.call(document.querySelectorAll('[data-postular-ad]'));

  // el anuncio "está en pantalla" si se ven al menos 140px (o la mitad, si es más bajo)
  function adOnScreen() {
    var vh = window.innerHeight;
    return ads.some(function (a) {
      var r = a.getBoundingClientRect();
      var seen = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      return seen >= Math.min(140, r.height * 0.5);
    });
  }

  // si el usuario vuelve al anuncio, los avisos sobran
  var scrollQueued = false;
  window.addEventListener('scroll', function () {
    if (scrollQueued || !nagOpen()) return;
    scrollQueued = true;
    setTimeout(function () {
      scrollQueued = false;
      if (nagOpen() && adOnScreen()) closeNags();
    }, 120);
  }, { passive: true });

  // la cascada del anuncio se arma cada vez que entra en pantalla
  if ('IntersectionObserver' in window && !reduce) {
    ads.forEach(function (ad) {
      if (!ad.classList.contains('ad')) return;
      ad.classList.add('armed');
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.intersectionRatio >= 0.3) ad.classList.add('play');
          else if (!en.isIntersecting) ad.classList.remove('play');
        });
      }, { threshold: [0, 0.3] }).observe(ad);
    });
  }

  /* --------------------------------------------------------
     3. barra de tareas y menú Inicio
     -------------------------------------------------------- */
  var bar = document.createElement('div');
  bar.id = 'taskbar';
  bar.innerHTML =
    '<button type="button" id="start" aria-haspopup="true" aria-expanded="false" aria-controls="startmenu">' +
      SEAL + '<span>ATLAS</span></button>' +
    '<button type="button" class="task active" title="' + page.label + '">' +
      '<span class="ico" data-ico="' + page.ico + '"></span><span>' + page.label + ' — ATLAS-NET</span></button>' +
    '<div id="tray"><span class="ico" data-ico="sun" title="Monitor solar: activo"></span><span id="clock">12:00</span></div>';
  document.body.appendChild(bar);

  var menu = document.createElement('div');
  menu.id = 'startmenu';
  menu.hidden = true;
  var items = NAV.map(function (n) {
    return '<a href="' + n.href + '"><span class="ico" data-ico="' + n.ico + '" data-size="32"></span>' + n.label + '</a>';
  }).join('');
  menu.innerHTML =
    '<div class="sm-band"><b>ATLAS<span>-NET</span></b></div>' +
    '<div class="sm-list" role="menu">' + items +
      '<div class="sm-sep"></div>' +
      '<a href="solicitud.html" class="hot"><span class="ico" data-ico="warn" data-size="32"></span>¡Postularme ahora!</a>' +
      '<div class="sm-sep"></div>' +
      '<button type="button" data-off><span class="ico" data-ico="computer" data-size="32"></span>Apagar el terminal…</button>' +
    '</div>';
  document.body.appendChild(menu);

  var startBtn = document.getElementById('start');
  function setMenu(open) {
    menu.hidden = !open;
    startBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  startBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(menu.hidden);
  });
  document.addEventListener('click', function (e) {
    if (!menu.hidden && !menu.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  menu.querySelector('[data-off]').addEventListener('click', function () {
    setMenu(false);
    toast('OPERACIÓN NO PERMITIDA — EL TERMINAL PERMANECE ENCENDIDO');
  });
  bar.querySelector('.task.active').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  var clock = document.getElementById('clock');
  function tick() {
    var d = new Date();
    clock.textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }
  tick();
  setInterval(tick, 15000);

  /* --------------------------------------------------------
     4. avisos emergentes: aparecen cada cierto tiempo mientras el
        anuncio de postulación no está en pantalla. se cierran con ✕,
        con el botón secundario o con Escape. cada vez vuelven más.
        override de prueba: ?avisos=rapido
     -------------------------------------------------------- */
  var fast = /[?&]avisos=rapido/.test(location.search);
  var FIRST = fast ? 3000 : 18000;   // primer aviso
  var EVERY = fast ? 8000 : 45000;   // pausa después de cerrar uno
  var RETRY = 4000;                  // si no es buen momento, reintentar

  var NAGS = [
    { t: '¿TODAVÍA NO SE HA POSTULADO?', p: 'Quedan <b>dos plazas</b> en la Misión HELIOS-1. El Sol no va a esperar a que termine de leer.', no: 'Seguir leyendo' },
    { t: '¡ESTA ES SU SEÑAL!', p: 'Llegó hasta aquí. Eso ya es más de lo que hizo casi cualquier otro visitante. <b>Postúlese.</b>', no: 'Todavía no' },
    { t: 'PLAZA DE ASTRONAUTA: LIBRE', p: 'Alguien va a ocuparla. <b>¿Por qué no usted?</b> No necesita formación técnica.', no: 'Que la ocupe otro' },
    { t: '¡NO NECESITA EXPERIENCIA!', p: 'Sólo seguir instrucciones mientras ocurre algo que no le resulta familiar. <b>Usted puede hacerlo.</b>', no: 'Más tarde' },
    { t: '¿Y SI VUELVE A PASAR?', p: 'El 17 de julio de 1982 el Sol se apagó durante cuatro décimas de segundo. HELIOS-1 existe para que no se repita. <b>Postúlese hoy.</b>', no: 'No me importa el Sol' },
    { t: '¡TRAIGA A ALGUIEN!', p: 'Postúlense en pareja: una persona va al espacio, la otra guía desde Tierra. <b>Dos plazas. Dos personas.</b>', no: 'Cerrar (por ahora)' }
  ];

  var open = [];
  var shownCount = 0;
  var timer = null;
  var taskAlert = null;

  function nagOpen() { return open.length > 0; }
  function applied() {
    try { return !!sessionStorage.getItem('atlas_applied'); } catch (e) { return false; }
  }
  function badMoment() {
    var ae = document.activeElement;
    var modal = document.getElementById('modal');
    return document.hidden || nagOpen() || adOnScreen() ||
      (modal && modal.classList.contains('on')) || !menu.hidden ||
      (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName));
  }
  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(tryShow, ms);
  }
  function tryShow() {
    if (applied()) return;
    if (badMoment()) return schedule(RETRY);
    showNags();
  }

  function nagEl(msg, front) {
    var n = document.createElement('div');
    n.className = 'win nag' + (front ? ' front' : ' ghost');
    if (front) {
      n.setAttribute('role', 'alertdialog');
      n.setAttribute('aria-labelledby', 'nag-t');
      n.setAttribute('aria-describedby', 'nag-p');
    } else {
      n.setAttribute('aria-hidden', 'true');
    }
    n.innerHTML =
      '<div class="win-title"><span class="ico" data-ico="warn"></span>' +
        '<span class="t">ATLAS-NET — Aviso de convocatoria</span>' +
        '<span class="win-btns"><button type="button" data-b="x" aria-label="Cerrar aviso"></button></span></div>' +
      '<div class="nag-b">' +
        '<span class="ico" data-ico="warn" data-size="32"></span>' +
        '<div><h3' + (front ? ' id="nag-t"' : '') + '>' + msg.t + '</h3><p' + (front ? ' id="nag-p"' : '') + '>' + msg.p + '</p></div>' +
        '<div class="nag-btns">' +
          '<a class="btn primary" href="solicitud.html">¡POSTULARME YA!</a>' +
          '<button type="button" class="btn" data-no>' + msg.no + '</button>' +
        '</div>' +
        '<p class="nag-f">Este aviso se repetirá hasta que se postule.</p>' +
      '</div>';
    fillIcons(n);
    return n;
  }

  function place(els) {
    var vw = window.innerWidth, vh = window.innerHeight;
    var front = els[els.length - 1];
    var w = front.offsetWidth, h = front.offsetHeight;
    var step = vw < 500 ? 8 : 16;
    var span = step * (els.length - 1);
    var minX = 8 + span, maxX = Math.max(minX, vw - w - 8);
    var minY = 8 + span, maxY = Math.max(minY, vh - h - 44);
    var x = Math.round(minX + Math.random() * (maxX - minX));
    var y = Math.round(minY + Math.random() * (maxY - minY));
    els.forEach(function (el, i) {
      var back = els.length - 1 - i;
      el.style.left = (x - back * step) + 'px';
      el.style.top = (y - back * step) + 'px';
    });
  }

  function showNags() {
    var msg = NAGS[shownCount % NAGS.length];
    var count = Math.min(1 + shownCount, 5);
    shownCount++;
    var els = [];
    for (var i = 0; i < count; i++) els.push(nagEl(msg, i === count - 1));
    // se agregan todos invisibles para poder medir y ubicar
    els.forEach(function (el) { el.style.visibility = 'hidden'; document.body.appendChild(el); });
    place(els);
    open = els;
    els.forEach(function (el, i) {
      setTimeout(function () { if (open.indexOf(el) > -1) el.style.visibility = ''; }, reduce ? 0 : i * 90);
    });
    var front = els[els.length - 1];
    front.querySelector('[data-b=x]').addEventListener('click', closeNags);
    front.querySelector('[data-no]').addEventListener('click', closeNags);
    drag(front);

    // botón parpadeante en la barra de tareas
    taskAlert = document.createElement('button');
    taskAlert.type = 'button';
    taskAlert.className = 'task alert';
    taskAlert.innerHTML = '<span class="ico" data-ico="warn"></span><span>¡AVISO! Postúlese</span>';
    fillIcons(taskAlert);
    taskAlert.addEventListener('click', function () {
      if (reduce) return;
      front.classList.remove('front');
      void front.offsetWidth;
      front.classList.add('front');
    });
    bar.insertBefore(taskAlert, document.getElementById('tray'));
  }

  function closeNags() {
    open.forEach(function (el) { el.remove(); });
    open = [];
    if (taskAlert) { taskAlert.remove(); taskAlert = null; }
    schedule(EVERY);
  }

  // arrastrar la ventana por su barra de título
  function drag(win) {
    var t = win.querySelector('.win-title');
    var sx, sy, ox, oy, on = false;
    t.addEventListener('pointerdown', function (e) {
      if (e.target.closest('[data-b]')) return;
      on = true;
      sx = e.clientX; sy = e.clientY;
      ox = win.offsetLeft; oy = win.offsetTop;
      t.setPointerCapture(e.pointerId);
    });
    t.addEventListener('pointermove', function (e) {
      if (!on) return;
      var x = Math.min(Math.max(ox + e.clientX - sx, -win.offsetWidth + 60), window.innerWidth - 60);
      var y = Math.min(Math.max(oy + e.clientY - sy, 0), window.innerHeight - 60);
      win.style.left = x + 'px';
      win.style.top = y + 'px';
    });
    t.addEventListener('pointerup', function () { on = false; });
    t.addEventListener('pointercancel', function () { on = false; });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nagOpen()) closeNags();
  });

  // no hay avisos en la página del formulario ni después de postularse
  if (!document.getElementById('solicitud') && !applied()) schedule(FIRST);

  fillIcons(document);
})();
