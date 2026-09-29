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
- **Versión anterior, intacta:** carpeta `v1/` — https://pascual890.github.io/PaginaTaller6/v1/
  y rama `version-original` en GitHub (congelada, no se publica).

Si el grupo prefiere la anterior: volver `main` al estado de la rama `version-original`
(guardando antes la nueva en otra rama, p. ej. `version-recorrido`). Cuando el grupo
decida, la carpeta `v1/` se puede borrar.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: bienvenida, **procedimiento en 3 pasos**, anuncio de postulación, resumen corto, monitor solar |
| `acerca.html` | Ficha institucional, lema, cronología con el hueco 1965–81 (**Egg 1** en la entrada 1982: el memo del Apagón) |
| `mision.html` | **Misión y puestos** (fusionadas): fichas, objetivo, simulación, los dos puestos, requisitos, cronograma, beneficios, NT-1982-011 |
| `puestos.html` | Sólo redirige a `mision.html#puestos` |
| `documentos.html` | 3 documentos abiertos que se leen en un visor + 5 restringidos con el custodio tachado (**Egg 2**, opcional) |
| `solicitud.html` | Formulario corto; al enviar, A.R. interrumpe con el acta (`<template id="acta-tpl">`, la misma acta que en archivo.html); carga, acuse y memorando del Comité |
| `archivo.html` | Bloqueado (403) mientras A.R. lo abre; abierto = clímax: nota de A.R., acta del Comité, toma 07 del portavoz |
| `css/style.css` | Estilos; los del recorrido van al final |
| `js/site.js` | Estado compartido (`ATLAS.store`), feed, contador, redacciones, formulario, memorando final |
| `js/win.js` | Capa de ventanas estilo sistema 95, barra de tareas, avisos oficiales de postulación. **Sólo son ventana** los elementos marcados con `data-win` (`.term`, `.tscroll`, `.box`, `.ficha`), el formulario y el visor de la Fig. 1; el resto conserva su diseño de página. Las ventanas incrustadas no llevan botones de minimizar/maximizar/cerrar (sólo los diálogos que sí se cierran, y la ✕ del anuncio del Inicio, que a propósito responde "no puede cerrarse, postúlese") |
| `js/recorrido.js` | **Nuevo:** pantalla de acceso, mensajes de A.R., apertura de /archive/ (con lo tachado), interrupción del envío con el acta, archivo, visor de documentos |
| `js/eggs.js` | Los cinco easter eggs (1 y 2 cuentan como campos leídos) |
| `v1/` | **Copia congelada de la versión anterior** (hasta el 28/09/2026). No se toca. |

La cabecera y el pie están repetidos en cada página (no hay includes): si cambias
algo ahí, cámbialo en los 6 archivos (`puestos.html` sólo redirige).
Los CSS/JS se cargan con `?v=6`: si se cambian después de publicar, subir el número
en los 6 HTML para que nadie vea una versión en caché.

## El recorrido (versión 2, corta)

Duración pensada: **2–3 minutos**. La web tiene un solo trabajo: *el participante se postula
y, en el camino, descubre que Atlas no controla lo que hace*. Las dos cosas son obligatorias;
todo lo demás es extra para curiosos.

**Acceso → Inicio → (Misión y puestos) → Formulario → A.R. interrumpe el envío → Memorando → VR**

1. **Acceso.** Pantalla negra con *ACCEDER AL TERMINAL* e instrucción única: "Revise la
   convocatoria y envíe su postulación". Marca el inicio (sin tiempo límite). El sitio no
   afirma en ningún lado que el participante haya pasado por una entrevista.
2. **Inicio:** procedimiento en 2 pasos (misión y puestos → postulación) y el anuncio.
3. **A.R.** aparece al salir del Inicio (o a los 40 s, `AR1_MS`), tomando una ventana de
   aviso: *"No firmen todavía. Estoy abriendo un archivo que Atlas no quiere que vean. Me
   faltan las claves: están tachadas en DOCUMENTOS…"*. No examina: pide ayuda.
   Desde ese momento no vuelven los avisos oficiales de postulación.
4. **Formulario corto:** nombre, modalidad, puesto, evaluación perceptiva (conecta con el
   video) y una sola casilla de declaración.
5. **Al apretar Enviar, A.R. interrumpe** (obligatorio): *"Listo. Antes de firmar, miren
   esto."* y muestra el **acta del Comité** (hipótesis sin verificar, "¿qué ocurre si el
   fenómeno responde?" → no determinable, 0 de 38 empleados aceptan, no se informa a los
   participantes). El botón *Enviar de todas formas* aparece a los 2,5 s. Si ya vieron el
   Archivo, sólo pregunta "¿Firman igual?".
6. **Carga de 3 s → memorando del Comité**, que dice "Consta en el registro de este terminal
   la lectura de un documento reservado" (o que accedieron a /archive/).
7. **Final de A.R.:** *"Ya está. Los van a llevar a la Central de Comando."*

**Extra — el Archivo.** La barra "A.R. /archive/ ▓▓░░░" de la barra de tareas avanza un
tercio con cada campo tachado leído (5 en Documentos + el bloque 1982 de Acerca de) y
muestra "A.R.: ESO ME SIRVE — 33%". Con 3 (`CLAVES`) A.R. dice "Listo. Abrí /archive/."
y se abre: nota breve de A.R., acta y la toma 07 del portavoz.
Sin avisos encima mientras se lee.

### Grabación del portavoz

Mientras no haya audio, el reproductor muestra "ARCHIVO DAÑADO" y la transcripción. Para
usar una grabación real: poner el archivo en `audio/` y su ruta en `data-src` de
`#toma07` en `archivo.html` (p. ej. `data-src="audio/portavoz_toma07.mp3"`).

### Para las pruebas con usuarios

- **Entre participantes:** entrar a `index.html?reset` (o cerrar la pestaña y abrir otra).
  Vuelve a salir la pantalla de acceso.
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
3. **Acceso denegado** (`documentos.html`, `archivo.html`, tabla de Inicio): clic en
   cualquier archivo restringido → glitch + "ACCESO DENEGADO — INTENTO REGISTRADO".
   El contador vive en `sessionStorage` y se muestra en el pie de todas las páginas
   y en la tabla de estado de Inicio. Máximo un intento cada 500 ms.
4. **Censura activa** (pie de todas las páginas + ficha de Acerca de + ventana en
   Misión): cada 15–19 s todos los campos censurados parpadean en rojo a la vez.
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
aviso de Atlas y se transforma). Sólo aparecen si el anuncio de postulación (`[data-postular-ad]`: el
anuncio del Inicio y el recuadro final de Puestos) no está en pantalla, y se
cierran solas si el usuario vuelve a él. No aparecen en `solicitud.html`, mientras
se escribe en un campo, con la pestaña oculta ni después de enviar la postulación.
Se cierran con ✕, con el botón secundario o con Escape, y se pueden arrastrar.

Para probarlos sin esperar, añade `?avisos=rapido` a la URL (3 s / 8 s).

## Después de postularse

Al enviar el formulario (después del acta de A.R.) aparece una carga de ~3 s (`CARGA_MS` en `js/site.js`) con
pasos y un 99% que se atasca; luego el acuse de recibo y, encima, un popup de
notificación de selección del Comité de Continuidad (memorando mecanografiado con
timbre rojo e instrucciones frías, una de ellas tachada) con el nombre y el puesto
de cada postulante y el lugar al que deben ir. El lugar
se cambia en `LUGAR`, `LUGAR_DET` y `ROL` (`js/site.js`, sección 6c).

El anuncio del Inicio muestra las personas inscritas: crece una cada 45 s de tiempo
real desde el 1/9/2026 y además sube en vivo; nunca retrocede (`atlas_inscritos`).

## Estado compartido (sessionStorage)

Prefijo `atlas2_` (la copia `v1/` usa `atlas_`, así no se mezclan):
`t0` (inicio de la sesión), `visited` (páginas vistas), `hall` (campos tachados
leídos), `ar` (mensajes de A.R. ya mostrados), `acta` (vio el acta al enviar),
`archivo` (entró al Archivo abierto),
`nags` (avisos oficiales mostrados), `attempts` (intentos), `visits` (contador),
`inscritos`, `applied` (referencia de solicitud). Se borra al cerrar la pestaña o con `?reset`.
