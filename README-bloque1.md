# Bloque 1 — Corrección de bugs

## Archivos que te doy

| Archivo | Qué es |
|---|---|
| `calendar.html` | Versión nueva — renderizado dinámico, reemplaza el anterior completo |
| `calendar-sessions.js` | Nuevo archivo con horarios de sesiones por ronda |
| `fixes-bloque1.js` | Funciones corregidas para pegar en `main.js` |
| `fixes-bloque1-datajs.txt` | Instrucciones para los cambios en `data.js` e `index.html` |

---

## Orden de aplicación

### 1. Archivo nuevo — copiar directo al proyecto
- **`calendar-sessions.js`** → copiar al root del proyecto (mismo nivel que `data.js`)

### 2. calendar.html — reemplazar completo
- Reemplazar `calendar.html` existente con el nuevo

### 3. main.js — reemplazar 3 funciones + agregar 2

**Reemplazar las funciones existentes:**
- `renderDriverStandings()` → sort por puntos, posición calculada en tiempo real
- `renderConstructorStandings()` → sort por puntos
- `renderChampionshipLeaders()` → usa sort real en vez de asumir orden del array

**Agregar funciones nuevas:**
- `renderCalendar()` → renderiza `window.calendar` dinámicamente
- `renderHomeStats()` → calcula "Carreras disputadas / Restantes" desde el array
- `scorePredict()` → reemplaza la versión vieja dentro de `renderPredictor()` *(ver nota abajo)*

**Actualizar `initPage()`:**
```js
// Bloque page-calendar — de esto:
if (body.classList.contains('page-calendar')) {
    return;
}
// A esto:
if (body.classList.contains('page-calendar')) {
    renderCalendar();
    return;
}

// Bloque page-home — agregar renderHomeStats():
if (body.classList.contains('page-home')) {
    renderHomeStats();          // ← agregar
    renderChampionshipLeaders();
    renderCountdown();
    return;
}
```

> **Nota sobre scorePredict:** esta función vive _dentro_ de `renderPredictor()`, no es una función de alto nivel. Buscá `function scorePredict(pred, race)` adentro de `renderPredictor` y reemplazala.

### 4. data.js — 2 cambios puntuales
- Cambiar `engine: 'Renault'` por `engine: 'Mercedes'` en el constructor Alpine
- Eliminar la última oración de la entrada `Pole Position` en `window.glossaryTerms` (la que menciona "Vale 1 punto en Q1/Q2/Q3")

### 5. index.html — 2 cambios puntuales
- Cambiar `href="livrées.html"` por `href="livrees.html"` en la quick-link card de Livrées
- Los 4 `<span class="stat-number">` del `.hero-stats` → cambiar los números hardcodeados (7, 17, 11, 22) por `—`, el JS los va a llenar

### 6. admin.html — 3 cambios en el script inline
- Eliminar `const resultIdx = adminRaces.length - 1;` (código muerto)
- Agregar validación de posiciones duplicadas antes de guardar
- Agregar guard anti-doble-sprint

### 7. calendar.html — agregar script
Agregar antes de `data.js`:
```html
<script src="calendar-sessions.js"></script>
```

---

## Bugs corregidos en este bloque

| # | Bug | Dónde |
|---|---|---|
| 1 | Standings no ordenados por puntos | `main.js` |
| 2 | Standings constructores no ordenados | `main.js` |
| 3 | Líder del home no necesariamente el primero del array | `main.js` |
| 4 | calendar.html hardcodeado y desincronizado | `calendar.html` → dinámico |
| 5 | Stats del home (7 carreras, 17 restantes) hardcodeados | `index.html` + `main.js` |
| 6 | Link roto `livrées.html` con tilde | `index.html` |
| 7 | Motor Alpine dice Renault en data pero Mercedes en trivia | `data.js` |
| 8 | Glosario Pole Position con frase incorrecta | `data.js` |
| 9 | Predictor nunca puntúa P2 y P3 | `main.js` |
| 10 | Admin: código muerto `resultIdx` | `admin.html` |
| 11 | Admin: posiciones duplicadas no validadas | `admin.html` |
| 12 | Admin Sprint: doble suma de puntos si se guarda dos veces | `admin.html` |
