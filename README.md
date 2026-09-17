# AEOI — Servidor de Información Pública (prototipo Taller 6)

Sitio estático: HTML + CSS + JS sin frameworks. Abre `index.html` con doble clic
o sírvelo con cualquier servidor local (p. ej. `python -m http.server 8477`).

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: bienvenida, resumen, estado de misión, señal en vivo, puestos, índice de documentos |
| `acerca.html` | Ficha institucional, valores, cronología (**Egg 1** en la entrada 1997) |
| `mision.html` | Fichas, telemetría, alcance, cronograma, elegibilidad, nota técnica TN-1997-047 |
| `puestos.html` | Los dos puestos, elegibilidad, beneficios |
| `documentos.html` | Tabla de archivos (**Egg 2** y **Egg 3**) |
| `solicitud.html` | Formulario de solicitud con validación y acuse de recibo (sin backend) |
| `archivo.html` | 403 + índice en caché (**Egg 3**) |
| `css/style.css` | Estilos, incluidos los de los eggs (sección al final) |
| `js/site.js` | Interacciones normales: feed, contador, redacciones `.rd`, formulario, toast, modal |
| `js/eggs.js` | Los cinco easter eggs |

La cabecera y el pie están repetidos en cada página (no hay includes): si cambias
algo ahí, cámbialo en los 7 archivos.

## Cómo disparar cada easter egg

1. **Bloque 1997** (`acerca.html`, cronología): mantener presionado el bloque rojo
   2 segundos (mouse o táctil). Si sueltas antes, se reinicia. Al revelarse aparece
   el link "[Ver documento filtrado →]" que abre el memorando.
2. **Celdas redactadas** (`documentos.html`): las celdas negras son texto real.
   Selecciónalo arrastrando (en móvil: pulsación larga y arrastrar). Cada celda
   nueva muestra "HALLAZGO REGISTRADO — n DE 10".
3. **Acceso denegado** (`documentos.html`, `archivo.html`, tabla de Inicio): clic en
   cualquier archivo restringido → glitch + "ACCESO DENEGADO — INTENTO REGISTRADO".
   El contador vive en `sessionStorage` y se muestra en el pie de todas las páginas
   y en la tabla de estado de Inicio. Máximo un intento cada 500 ms.
4. **Censura activa** (pie de todas las páginas + ficha de Acerca de + altitud en
   Misión): cada 15–19 s todos los campos censurados parpadean en rojo a la vez.
   Mantener presionado uno ~0,8 s revela su dato real durante 1,5 s.
5. **Ojos en el mapa del sitio** (pie): el recuadro negro con los enlaces del mapa
   del sitio tiene un canvas detrás. Cada 8–12 s aparece un punto de luz solo; al
   mover el cursor o el dedo por encima, los puntos siguen al puntero con inercia.

## Movimiento reducido

Si Windows/macOS tiene desactivados los efectos de animación
(`prefers-reduced-motion`), el sitio muestra las variantes estáticas que pide la
documentación: el bloque 1997 se revela con un toque simple, los campos
censurados llevan borde punteado y se revelan con un toque, y no hay marquee ni
parpadeos.

Para forzar una variante sin tocar el sistema, añade a la URL:
`?motion=full` (todo animado) o `?motion=reduce` (estático).

## Estado compartido (sessionStorage)

`aeoi_attempts` (intentos), `aeoi_egg2found` (celdas descubiertas),
`aeoi_egg2tip` (tooltip mostrado), `aeoi_visits` (contador), `aeoi_applied`
(referencia de solicitud). Se borra al cerrar la pestaña.
