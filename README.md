https://pascual890.github.io/PaginaTaller6/


# Atlas Corporation — Sistema de Información Pública ATLAS-NET (prototipo Taller 6)

Experiencia 2 del proyecto: la web oficial de Atlas Corporation dentro del relato
(convocatoria pública 1983 para la Misión HELIOS-1, tras el Apagón del 17/07/1982) y,
por debajo, el mapa de sus secretos. Narrativa de referencia:
`Atlas_Corporation_Narrativa_Integrada.docx`.

Sitio estático: HTML + CSS + JS sin frameworks. Abre `index.html` con doble clic
o sírvelo con cualquier servidor local (p. ej. `python -m http.server 8477`).

## Versiones

- **Versión nueva (recorrido):** raíz del sitio — https://pascual890.github.io/PaginaTaller6/
- **Versión de las pruebas de usabilidad:** carpeta `prueba/` — https://pascual890.github.io/PaginaTaller6/prueba/
  (copia del commit `4841910`, lo que estaba publicado el 29/09; guarda su avance con el prefijo
  `atlasp_` para no mezclarse con la raíz). No se toca.
- **Versión anterior, intacta:** carpeta `v1/` — https://pascual890.github.io/PaginaTaller6/v1/
  y rama `version-original` en GitHub (congelada, no se publica).

Si el grupo prefiere la anterior: volver `main` al estado de la rama `version-original`
(guardando antes la nueva en otra rama, p. ej. `version-recorrido`). Cuando el grupo
decida, la carpeta `v1/` se puede borrar.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: bienvenida (empresa y Apagón en tres frases) con una foto, "Qué es la Misión HELIOS-1" (como en la versión anterior: dos párrafos, enlace a la Misión, monitor solar, Fig. 1 disco solar y Fig. 2 `sombra_02.gif` rota a propósito) y "El Sol necesita a dos personas" (el texto del antiguo anuncio, sin el recuadro) con una foto por puesto. Ver *Imágenes del Inicio* |
| `acerca.html` | **Fuera de la barra** (sólo en el pie y el menú Inicio): ficha institucional, lema, cronología con el hueco 1965–81 (**Egg 1** en la entrada 1982: el memo del Apagón) |
| `mision.html` | **Misión y puestos**, resumida: lo esencial en tres datos (qué / cuándo / quiénes), los dos puestos, la simulación y una **letra chica** plegada (requisitos, cronograma, condiciones, NT-1982-011) |
| `puestos.html` | Sólo redirige a `mision.html#puestos` |
| `documentos.html` | 3 documentos abiertos que se leen en un visor + 5 restringidos con el custodio tachado (**Egg 2**, opcional). Debajo de la tabla, **/archive/** (antes `archivo.html`): 403 mientras A.R. lo abre; abierto = clímax: acta del Comité y toma 07 del portavoz (A.R. lo anuncia en su panel) |
| `solicitud.html` | Formulario corto; al enviar, A.R. interrumpe con el acta (`<template id="acta-tpl">`, versión corta del acta de /archive/); carga, acuse y memorando del Comité |
| `archivo.html` | Sólo redirige a `documentos.html#archive` |
| `css/style.css` | Estilos; los del recorrido van al final |
| `js/site.js` | Estado compartido (`ATLAS.store`), feed, contador, redacciones, formulario, memorando final |
| `js/win.js` | Capa de ventanas estilo sistema 95, barra de tareas, avisos oficiales de postulación. **Sólo son ventana** los elementos marcados con `data-win` (`.term`, `.tscroll`, `.box`, `.ficha`) y el formulario; el resto conserva su diseño de página. Las ventanas incrustadas no llevan botones de minimizar/maximizar/cerrar (sólo los diálogos que sí se cierran) |
| `js/recorrido.js` | Pantalla de acceso, **pestaña de A.R.** (abajo a la derecha) y sus mensajes, apertura de /archive/ (con lo tachado), interrupción del envío con el acta, archivo, visor de documentos, ✓ en la barra de 4 botones y botón *Siguiente / Continuar* (abajo) |
| `js/eggs.js` | Los cinco easter eggs (1 y 2 cuentan como campos leídos) |
| `v1/` | **Copia congelada de la versión anterior** (hasta el 28/09/2026). No se toca. |
| `prueba/` | **Copia congelada de la versión de las pruebas de usabilidad** (commit `4841910`, 29/09/2026). No se toca. |

La cabecera y el pie están repetidos en cada página (no hay includes): si cambias
algo ahí, cámbialo en los 5 archivos (`puestos.html` y `archivo.html` sólo redirigen).
Los CSS/JS se cargan con `?v=15`: si se cambian después de publicar, subir el número
en los 5 HTML para que nadie vea una versión en caché.

## El recorrido (versión 2, corta)

Duración pensada: **2–3 minutos**. La web tiene un solo trabajo: *el participante se postula
y, en el camino, descubre que Atlas no controla lo que hace*. Las dos cosas son obligatorias;
todo lo demás es extra para curiosos.

**Acceso → Inicio → Misión y puestos → Documentos → Formulario → A.R. interrumpe el envío → Memorando → VR**

1. **Acceso.** Pantalla negra con *ACCEDER AL TERMINAL* e instrucción única: "Revise la
   convocatoria y envíe su postulación". Marca el inicio (sin tiempo límite). El sitio no
   afirma en ningún lado que el participante haya pasado por una entrevista.
2. **Inicio → Misión y puestos → Documentos → Postulación**, siempre en ese orden (ver
   *Barra de navegación* abajo). Cada página tiene poco texto: la Misión se lee en tres
   datos y dos puestos; lo demás está plegado en la letra chica.
3. **A.R.** aparece al salir del Inicio (o a los 40 s, `AR1_MS`), tomando una ventana de
   aviso: *"No firmen todavía. Estoy abriendo un archivo que Atlas no quiere que vean. Me
   faltan las claves: están tachadas en DOCUMENTOS…"*. No examina: pide ayuda.
   Desde ese momento no vuelven los avisos oficiales de postulación. Al cerrar el mensaje,
   A.R. queda como **pestaña abajo a la derecha** (ver abajo).
4. **Formulario corto:** primero la modalidad (individual o en pareja: en las pruebas, con el
   nombre arriba no se entendía si iban uno o dos nombres), después nombre, puesto,
   evaluación perceptiva (conecta con el video) y una sola casilla de declaración.
5. **Al apretar Enviar, A.R. interrumpe** (obligatorio): *"Listo. Antes de firmar, miren
   esto."* y muestra el **acta del Comité** (hipótesis sin verificar, "¿qué ocurre si el
   fenómeno responde?" → no determinable, 0 de 38 empleados aceptan, no se informa a los
   participantes). El botón *Enviar de todas formas* aparece a los 2,5 s. Si ya vieron el
   Archivo, sólo pregunta "¿Firman igual?".
6. **Carga de 3 s → memorando del Comité**, que dice "Consta en el registro de este terminal
   la lectura de un documento reservado" (o que accedieron a /archive/).
7. **Final de A.R.:** *"Ya está. Los van a llevar a la Central de Comando."*

**Barra de navegación: 4 botones**, en el orden del recorrido: *Inicio · Misión y puestos ·
Documentos · Postulación*. Es también el procedimiento (ya no hay una barra de pasos aparte):
la página actual va en rojo y las ya vistas llevan ✓. Abajo de cada página hay un solo botón,
*Siguiente: …* (en la Postulación manda el botón Enviar). Documentos va antes de la
Postulación porque es adonde manda A.R. **Acerca de** salió de la barra; la página sigue en
el pie y en el menú Inicio para curiosos,
con su botón *Continuar: …* al primer paso pendiente (marcado con borde punteado).

**La pestaña de A.R.** Desde su primer mensaje, A.R. vive en una pestaña negra abajo a la
derecha, encima de la barra de tareas. Cerrar el mensaje (*Cerrar*, *Entendido*, *Después*,
el botón _ o Escape) lo guarda en la pestaña, que parpadea para mostrar adónde fue; un clic en
la pestaña vuelve a abrir el último mensaje (sin la máquina de escribir). La pestaña también
muestra el avance de /archive/ (`/archive/ ▓▓░░░ 33%` → `/archive/ ABIERTO`).

**Extra — /archive/ (opcional, debajo de la tabla de Documentos).** La pestaña de A.R.
avanza un tercio con cada campo tachado leído
(5 en Documentos + el bloque 1982 de Acerca de) y muestra "A.R.: ESO ME SIRVE — 33%". Con 3
(`CLAVES`) el 403 de debajo de la tabla se reemplaza por lo abierto: el acta y la toma 07 del
portavoz. **En ese momento A.R. escribe**, aunque su mensaje anterior siga abierto o el
archivo ya esté en pantalla: *"Listo. Abrí /archive/. Está en esta página, debajo de la tabla.
No les voy a decir que no vayan. Atlas dice que sabe lo que hace. Lean esto y decidan
ustedes."* (antes era el LEAME.TXT del archivo, que nadie veía), con un botón *Ver /archive/*
que lleva hasta ahí. Cuenta como leído (`archivo`) cuando el acta aparece en pantalla; si A.R.
ya avisó, su mensaje vuelve a la pestaña para dejar leer y no interrumpe más. El botón *Siguiente*
nunca se bloquea: quien no lo abre igual ve el acta al enviar.

### Imágenes del Inicio

Guardar los archivos en `img/inicio/` con estos nombres (horizontales 4:3, ~1200×900 px;
se recortan al marco). Mientras falte alguno se ve como imagen rota: "IMAGEN NO
DISPONIBLE" con el nombre del archivo que falta.

| Figura | Archivo | Dónde |
|---|---|---|
| ATLAS-A, 1958 (sin número) | `img/inicio/atlas.jpg` | junto a la bienvenida |
| Fig. 1 — Disco solar | `img/sol_19820717_1200.jpg` | ya está (visor ATLAS, en "Qué es la Misión") |
| Fig. 3 — Astronauta | `img/inicio/astronauta.jpg` | "El Sol necesita a dos personas" |
| Fig. 4 — Operador en Tierra | `img/inicio/operador.jpg` | "El Sol necesita a dos personas" |

Las fotos nuevas (`figure class="foto"`) llevan el marco de época pero no la ventana del
visor (sólo el disco solar es un archivo abierto). Pie de foto y texto alternativo: `index.html`.

### Grabación del portavoz

Mientras no haya audio, el reproductor muestra "ARCHIVO DAÑADO" y la transcripción. Para
usar una grabación real: poner el archivo en `audio/` y su ruta en `data-src` de
`#toma07` en `documentos.html` (p. ej. `data-src="audio/portavoz_toma07.mp3"`).

### Para las pruebas con usuarios

- **Entre participantes:** botón **ATLAS** (abajo a la izquierda) → **Cerrar sesión…**.
  Borra la sesión y vuelve a la pantalla de acceso. Es lo mismo que entrar a
  `index.html?reset` o cerrar la pestaña y abrir otra (F5 sólo recarga, no reinicia).
- **Otras pruebas:** `?avisos=rapido`, `?motion=reduce`.

## Cómo disparar cada easter egg

1. **Bloque 1982** (`acerca.html`, cronología): mantener presionado el bloque rojo
   2 segundos (mouse o táctil). Si sueltas antes, se reinicia. Al revelarse aparece
   el link "[Ver documento filtrado →]" que abre el memorando del día del Apagón
   ("correlación confirmada con registros de archivo — Protocolo de silencio activado").
2. **Celdas redactadas** (`documentos.html`, columna Custodio): una por archivo
   restringido, con texto real (memo del Apagón, registro 1962, Kessler 1979,
   expediente médico del portavoz, mapa de casos con la Zona 7 = Central de Comando).
   Se leen seleccionando/arrastrando encima (en móvil: pulsación larga y arrastrar).
   Cada una muestra "CAMPO RESTRINGIDO LEÍDO — n DE 6" y queda revelada. La pista la da
   A.R.; después de su primer mensaje las celdas pulsan con un borde rojo.
3. **Acceso denegado** (`documentos.html`): clic en cualquier archivo restringido →
   glitch + "ACCESO DENEGADO — INTENTO REGISTRADO".
   El contador vive en `sessionStorage` y se muestra en el pie de todas las páginas. Máximo un intento cada 500 ms.
4. **Censura activa** (pie de todas las páginas + ficha de Acerca de + fecha en el
   dato CUÁNDO de Misión): cada 15–19 s todos los campos censurados parpadean en rojo a la vez.
   Mantener presionado uno ~0,8 s revela su dato real durante 1,5 s.
5. **Ojos en el mapa del sitio** (pie): el recuadro negro con los enlaces del mapa
   del sitio tiene un canvas detrás (la revelación final: los puntos de luz son ojos). Cada 8–12 s aparece un punto de luz solo; al
   mover el cursor o el dedo por encima, los puntos siguen al puntero con inercia.

## Movimiento reducido

Si Windows/macOS tiene desactivados los efectos de animación
(sólo con `?motion=reduce`), el sitio muestra las variantes estáticas que pide la
documentación: el bloque 1982 se revela con un toque simple, los campos
censurados llevan borde punteado y se revelan con un toque, y no hay marquee ni
parpadeos.

Para forzar una variante, añade a la URL:
`?motion=full` (todo animado) o `?motion=reduce` (estático).

## Avisos emergentes de postulación

`js/win.js` abre **un** aviso que invita a postularse, 25 s después de entrar, sólo si
A.R. todavía no apareció (después A.R. "toma" ese canal: su primer mensaje empieza como un
aviso de Atlas y se transforma). No aparecen en `solicitud.html`, mientras
se escribe en un campo, con la pestaña oculta ni después de enviar la postulación.
Se cierran con ✕, con el botón secundario o con Escape, y se pueden arrastrar.

Para probarlos sin esperar, añade `?avisos=rapido` a la URL (3 s / 8 s).

## Después de postularse

Al enviar el formulario (después del acta de A.R.) aparece una carga de ~3 s (`CARGA_MS` en `js/site.js`) con
pasos y un 99% que se atasca; luego el acuse de recibo y, encima, un popup de
notificación de selección del Comité de Continuidad (memorando mecanografiado con
timbre rojo e instrucciones frías) con el nombre y el puesto
de cada postulante y el lugar al que deben ir. El lugar
se cambia en `LUGAR`, `LUGAR_DET` y `ROL` (`js/site.js`, sección 6c).

El memorando dice "de entre N postulantes": N crece una persona cada 45 s de tiempo
real desde el 1/9/2026 (`ATLAS.inscritos` en `js/site.js`).

## Estado compartido (sessionStorage)

Prefijo `atlas2_` (la copia `v1/` usa `atlas_`, así no se mezclan):
`t0` (inicio de la sesión), `visited` (páginas vistas), `hall` (campos tachados
leídos), `ar` (mensajes de A.R. ya mostrados), `arLast` (el que reabre la pestaña), `acta` (vio el acta al enviar),
`archivo` (el acta de /archive/ llegó a la pantalla),
`nags` (avisos oficiales mostrados), `attempts` (intentos), `visits` (contador),
`applied` (referencia de solicitud). Se borra al cerrar la pestaña o con `?reset`.
