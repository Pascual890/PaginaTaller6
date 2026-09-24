https://pascual890.github.io/PaginaTaller6/


# Atlas Corporation — Sistema de Información Pública ATLAS-NET (prototipo Taller 6)

Experiencia 2 del proyecto: la web oficial de Atlas Corporation dentro del relato
(convocatoria pública 1983 para la Misión HELIOS-1, tras el Apagón del 17/07/1982) y,
por debajo, el mapa de sus secretos. Narrativa de referencia:
`Atlas_Corporation_Narrativa_Integrada.docx`.

Sitio estático: HTML + CSS + JS sin frameworks. Abre `index.html` con doble clic
o sírvelo con cualquier servidor local (p. ej. `python -m http.server 8477`).

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: bienvenida, resumen de HELIOS-1, estado de misión, monitor solar, puestos, índice de documentos |
| `acerca.html` | Ficha institucional, lema ("La humanidad creyó…"), valores, cronología con el hueco 1965–81 (**Egg 1** en la entrada 1982) |
| `mision.html` | Fichas, simulación predictiva, hipótesis de la onda solar, cronograma, elegibilidad, nota técnica NT-1982-011 |
| `puestos.html` | Astronauta / Operador en Tierra, elegibilidad, beneficios |
| `documentos.html` | Tabla de archivos: los 5 documentos ocultos de la narrativa (**Egg 2** y **Egg 3**) |
| `solicitud.html` | Formulario de postulación (rol → Experiencia 3) con evaluación perceptiva, validación y acuse de recibo (sin backend) |
| `archivo.html` | 403 + índice en caché (**Egg 3**) |
| `css/style.css` | Estilos, incluidos los de los eggs (sección al final) |
| `js/site.js` | Interacciones normales: feed, contador, redacciones `.rd`, formulario, toast, modal |
| `js/eggs.js` | Los cinco easter eggs |
| `js/win.js` | Capa de ventanas estilo sistema 95: íconos pixelados, barras de título, barra de tareas con menú Inicio y avisos emergentes de postulación |

La cabecera y el pie están repetidos en cada página (no hay includes): si cambias
algo ahí, cámbialo en los 7 archivos.

## Cómo disparar cada easter egg

1. **Bloque 1982** (`acerca.html`, cronología): mantener presionado el bloque rojo
   2 segundos (mouse o táctil). Si sueltas antes, se reinicia. Al revelarse aparece
   el link "[Ver documento filtrado →]" que abre el memorando del día del Apagón
   ("correlación confirmada con registros de archivo — Protocolo de silencio activado").
2. **Celdas redactadas** (`documentos.html`): las celdas negras son texto real
   (registro 1962, artículo Kessler 1979, expediente médico del portavoz, mapa de
   casos psicóticos con la Zona 7 = Central de Comando).
   Selecciónalo arrastrando (en móvil: pulsación larga y arrastrar). Cada celda
   nueva muestra "HALLAZGO REGISTRADO — n DE 10". No hay ninguna explicación en
   pantalla, a propósito: se descubre solo.
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
(`prefers-reduced-motion`), el sitio muestra las variantes estáticas que pide la
documentación: el bloque 1982 se revela con un toque simple, los campos
censurados llevan borde punteado y se revelan con un toque, y no hay marquee ni
parpadeos.

Para forzar una variante sin tocar el sistema, añade a la URL:
`?motion=full` (todo animado) o `?motion=reduce` (estático).

## Avisos emergentes de postulación

`js/win.js` abre ventanas de aviso que invitan a postularse: la primera a los 18 s
y otra 45 s después de cerrar la anterior; cada vez llegan más ventanas apiladas
(hasta 5). Sólo aparecen si el anuncio de postulación (`[data-postular-ad]`: el
anuncio del Inicio y el recuadro final de Puestos) no está en pantalla, y se
cierran solas si el usuario vuelve a él. No aparecen en `solicitud.html`, mientras
se escribe en un campo, con la pestaña oculta ni después de enviar la postulación.
Se cierran con ✕, con el botón secundario o con Escape, y se pueden arrastrar.

Para probarlos sin esperar, añade `?avisos=rapido` a la URL (3 s / 8 s).

## Después de postularse

Al enviar el formulario aparece una carga de ~8 s (`CARGA_MS` en `js/site.js`) con
pasos y un 99% que se atasca; luego el acuse de recibo y, encima, un popup de
notificación de selección del Comité de Continuidad (memorando mecanografiado con
timbre rojo e instrucciones frías, una de ellas tachada) con el nombre y el puesto
de cada postulante y el lugar al que deben ir. El lugar
se cambia en `LUGAR`, `LUGAR_DET` y `ROL` (`js/site.js`, sección 6c).

El anuncio del Inicio muestra las personas inscritas: crece una cada 45 s de tiempo
real desde el 1/9/2026 y además sube en vivo; nunca retrocede (`atlas_inscritos`).

## Estado compartido (sessionStorage)

`atlas_attempts` (intentos), `atlas_egg2found` (celdas descubiertas),
`atlas_visits` (contador), `atlas_inscritos` (inscritos), `atlas_applied`
(referencia de solicitud). Se borra al cerrar la pestaña.
