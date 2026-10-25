# F1 Info ARG 🏎️🇦🇷

Sitio web en español con la temporada 2026 de la Fórmula 1: clasificación de pilotos y equipos, calendario con horarios en hora argentina, resultados carrera a carrera, estadísticas, comparador, predictor, trivia y más. Funciona como app instalable (PWA) y no necesita servidor: son archivos estáticos.

## Qué hay en cada página

| Página | Qué muestra |
|---|---|
| `index.html` | Próxima carrera con cuenta regresiva, banner "en vivo", líder y accesos rápidos |
| `drivers.html` / `driver.html` | Clasificación de pilotos y ficha de cada uno |
| `teams.html` / `team.html` | Clasificación de constructores y ficha de cada equipo |
| `calendar.html` | Calendario completo, sesiones de cada fin de semana y export a calendario (.ics) |
| `circuits.html` | Datos y trazado de cada circuito |
| `compare.html` | Comparador de dos pilotos |
| `stats.html`, `timeline.html` | Récords de la temporada y evolución del campeonato |
| `predictor.html`, `trivia.html` | Juegos |
| `rookies.html`, `glossary.html`, `today.html`, `search.html` | Rookies, glosario, "Este día en la F1" y buscador |
| `admin-login.html`, `admin.html` | Panel para cargar resultados (ver más abajo) |

## Estructura del código

- `data.js` — **todos los datos de la temporada**: carreras, pilotos, equipos, circuitos y calendario. También define `getSortedDrivers()` (orden oficial del campeonato con desempate) y `getRoundPoints()` (puntos de cada fin de semana).
- `calendar-sessions.js` — horarios de cada sesión (práctica, clasificación, sprint, carrera) en hora argentina.
- `main.js` — la lógica de todas las páginas; cada una se activa según la clase del `<body>`.
- `style.css` — estilos (tema oscuro y claro).
- `sw.js`, `manifest.json` — service worker y manifiesto de la PWA (funcionan en la raíz de un dominio o en una subcarpeta).
- `tools/check-data.js` — chequeo de coherencia de los datos.

## Cómo se guardan los resultados

Cada piloto tiene `raceResults` y `sprintResults`, con una posición por ronda (`sprintResults` vale `null` si esa ronda no tuvo sprint). **Los puntos, victorias y podios se calculan a partir de esas posiciones**; los equipos suman los puntos de sus pilotos. El estado de cada carrera (`done`, `next`, `upcoming`) se calcula con la fecha de hoy al cargar el sitio.

## Cargar una carrera nueva

1. Abrí `admin-login.html` e ingresá.
2. En el panel, pestaña **Resultado de carrera**: elegí la ronda, cargá las 22 posiciones (o traelas con el botón de sincronización) y guardá. Si hubo sprint, cargalo en la pestaña **Sprint**: queda pendiente hasta que guardes la carrera.
3. **Exportá `data.js`** (o publicalo directo a GitHub desde el panel).
4. Antes de subir los cambios, corré el chequeo:

```bash
node tools/check-data.js
```

Si algo no cierra (puntos que no coinciden, un día de la semana mal escrito, una imagen que falta…), el script lo lista.

## Seguridad del panel de admin

El login del panel es solo una barrera de la interfaz: el código es público y funciona en el navegador. Para protegerlo de verdad, ponelo detrás de **Cloudflare Access** (o similar) para `/admin*`, y si lo usás para publicar en GitHub, creá un token limitado a este repositorio.

## Publicarlo

Son archivos estáticos, se pueden servir desde cualquier hosting (Cloudflare Pages, GitHub Pages, Netlify…). Para ver el sitio en tu computadora:

```bash
python3 -m http.server 8000
# y abrí http://localhost:8000
```

> Para que las vistas previas al compartir un link (Open Graph) muestren una imagen, hay que agregar `og:image` con la URL completa del sitio.
