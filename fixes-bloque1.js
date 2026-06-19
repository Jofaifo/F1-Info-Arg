// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 1 — PARCHE MAIN.JS
// Instrucciones: reemplazá cada función indicada en main.js por la versión
// corregida que aparece acá abajo. Se indica con comentarios dónde va cada una.
// ═══════════════════════════════════════════════════════════════════════════════


// ─── FIX 1: renderDriverStandings — agregar .sort() antes de renderizar ───────
// REEMPLAZA la función renderDriverStandings() completa en main.js

function renderDriverStandings() {
    const tbody = document.querySelector('#driver-standings tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // FIX: ordenar por puntos desc, desempate por victorias desc
    const sorted = [...window.drivers].sort((a, b) =>
        b.points - a.points || b.wins - a.wins
    );

    sorted.forEach((driver, idx) => {
        const tr = document.createElement('tr');

        const positionCell = document.createElement('td');
        positionCell.className = 'position';
        positionCell.textContent = idx + 1;  // posición real por orden, no driver.position

        const nameCell = document.createElement('td');
        nameCell.textContent = driver.name;

        const teamCell = document.createElement('td');
        teamCell.appendChild(createTeamCell(driver.team, driver.code, driver.colorClass, driver.teamSlug));

        const pointsCell = document.createElement('td');
        pointsCell.textContent = driver.points;
        pointsCell.className = 'strong-text';

        const detailCell = document.createElement('td');
        detailCell.innerHTML = `<a class="detail-link" href="driver.html?slug=${driver.slug}">Ver</a>`;

        tr.append(positionCell, nameCell, teamCell, pointsCell, detailCell);
        tbody.appendChild(tr);
    });
}


// ─── FIX 2: renderConstructorStandings — agregar .sort() ─────────────────────
// REEMPLAZA la función renderConstructorStandings() completa en main.js

function renderConstructorStandings() {
    const tbody = document.querySelector('#constructor-standings tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // FIX: ordenar por puntos desc
    const sorted = [...window.constructors].sort((a, b) => b.points - a.points);

    sorted.forEach((team, idx) => {
        const tr = document.createElement('tr');

        const positionCell = document.createElement('td');
        positionCell.className = 'position';
        positionCell.textContent = idx + 1;

        const nameCell = document.createElement('td');
        nameCell.appendChild(createTeamCell(team.name, team.code, team.colorClass, team.slug));

        const pointsCell = document.createElement('td');
        pointsCell.textContent = team.points;
        pointsCell.className = 'strong-text';

        const detailCell = document.createElement('td');
        detailCell.innerHTML = `<a class="detail-link" href="team.html?slug=${team.slug}">Ver</a>`;

        tr.append(positionCell, nameCell, pointsCell, detailCell);
        tbody.appendChild(tr);
    });
}


// ─── FIX 3: renderChampionshipLeaders — usa datos reales ordenados ────────────
// REEMPLAZA la función renderChampionshipLeaders() completa en main.js

function renderChampionshipLeaders() {
    var dEl = document.getElementById('driver-leader');
    var tEl = document.getElementById('team-leader');

    if (dEl && window.drivers && window.drivers.length) {
        // FIX: el líder real es el primero al ordenar por puntos
        var d = [...window.drivers].sort((a,b) => b.points - a.points)[0];
        var dColor = (window.teamColors && window.teamColors[d.teamSlug]) || '#888';
        var dFlag = d.flagImg ? '<img src="' + d.flagImg + '" class="detail-flag-img" alt="">' : (d.flag || '');
        dEl.innerHTML =
            '<div class="leader-label">Líder de pilotos</div>' +
            '<div class="leader-name" style="color:' + dColor + '">' + dFlag + ' ' + d.name + '</div>' +
            '<div class="leader-detail">' + d.team + ' · <strong>' + d.points + ' pts</strong></div>' +
            '<a class="detail-link" href="driver.html?slug=' + d.slug + '">Ver →</a>';
    }
    if (tEl && window.constructors && window.constructors.length) {
        var t = [...window.constructors].sort((a,b) => b.points - a.points)[0];
        var tColor = (window.teamColors && window.teamColors[t.slug]) || '#888';
        var tFlag = t.flagImg ? '<img src="' + t.flagImg + '" class="detail-flag-img" alt="">' : (t.flag || '');
        tEl.innerHTML =
            '<div class="leader-label">Líder de constructores</div>' +
            '<div class="leader-name" style="color:' + tColor + '">' + tFlag + ' ' + t.name + '</div>' +
            '<div class="leader-detail"><strong>' + t.points + ' pts</strong></div>' +
            '<a class="detail-link" href="team.html?slug=' + t.slug + '">Ver →</a>';
    }
}


// ─── FIX 4: renderCalendar — nuevo, renderiza desde window.calendar dinámicamente
// AGREGÁ esta función en main.js (en la sección de funciones de página)
// y en initPage(), donde dice `if (body.classList.contains('page-calendar'))`
// reemplazá el `return;` por `renderCalendar(); return;`

function renderCalendar() {
    const list = document.getElementById('calendar-list-dynamic');
    if (!list || !window.calendar) return;

    const sessions = window.calendarSessions || {};
    const supportLabels = { f2: 'F2', f3: 'F3', fa: 'F1 Ac.' };
    const supportClass  = { f2: 'f2', f3: 'f3', fa: 'fa' };
    const foxImgSm  = '<img src="img/Fox Sport.png" alt="Fox" class="tv-logo-sm">';
    const disneyImg = '<img src="img/Disney+.png" alt="Disney+" class="tv-logo-sm">';

    // Dónde va el break de verano (después de la ronda 11 en 2026)
    const SUMMER_BREAK_AFTER = 11;

    let html = '';

    window.calendar.forEach(race => {
        const sess = sessions[race.round] || {};
        const isSprint = !!race.sprint;

        // Clase CSS del <li>
        const liClass = race.status === 'done'     ? 'race-done'
                      : race.status === 'next'     ? 'race-next'
                      : sess.lateNight             ? 'race-upcoming race-latenight'
                      : 'race-upcoming';

        // Chips de categorías de apoyo
        const supportChips = (sess.support || []).map(s =>
            `<span class="support-chip ${supportClass[s]}">${supportLabels[s]}</span>`
        ).join('');

        // Chips de TV (solo en futuras/próxima)
        let tvChips = '';
        if (race.status !== 'done' && sess.tv) {
            const foxBadge    = sess.tv.fox    === 'live'
                ? `<span class="tv-badge live">EN VIVO</span>`
                : `<span class="tv-badge delayed">DIFERIDO</span>`;
            const disneyBadge = `<span class="tv-badge live">EN VIVO</span>`;
            tvChips = `
                <div class="tv-chips">
                    <span class="tv-chip">${foxImgSm} ${foxBadge}</span>
                    <span class="tv-chip">${disneyImg} ${disneyBadge}</span>
                </div>`;
        }

        // Etiqueta de estado
        const statusHtml = race.status === 'done' ? '<span class="race-status done">✅</span>'
                         : race.status === 'next' ? '<span class="race-status next">🔜 PRÓXIMA</span>'
                         : '<span class="race-status">⏳</span>';

        // Ganador (si ya se corrió)
        const winnerHtml = race.status === 'done' && race.winner
            ? `<span class="race-winner">🏆 ${race.winner}</span>`
            : race.status === 'done' ? '<span class="race-winner">🏆 —</span>' : '';

        // Horario de carrera (si hay info de sesiones)
        const raceSession = (sess.sessions || []).find(s => s.type === 'race');
        const raceTimeStr = raceSession ? ` · <strong>${raceSession.time}</strong>` : '';

        // Etiqueta extra en el nombre
        const extraTag = isSprint        ? '<em class="sprint-tag">Sprint</em>' :
                         sess.debut      ? '<em class="debut-tag">debut</em>'   :
                         sess.lateNight  ? '<em class="latenight-tag">madrugada</em>' : '';

        // Horarios de sesiones (solo en no-done)
        let scheduleSections = '';
        if (race.status !== 'done' && sess.sessions && sess.sessions.length) {
            const dotType = { fp: 'fp', qual: 'qual', sprint: 'sprint-sched', race: 'race-dot' };
            scheduleSections = `<div class="race-schedule">` +
                sess.sessions.map(s => `
                    <div class="sched-row${s.type === 'race' ? ' race-row' : ''}">
                        <span class="sched-dot ${dotType[s.type] || 'fp'}"></span>
                        <span class="sched-label">${s.label}</span>
                        <span class="sched-time">${s.day} · ${s.time}</span>
                    </div>`).join('') +
                `</div>`;
        }

        html += `
            <li class="${liClass}">
                <div class="race-main-row">
                    <span class="race-round">R${race.round}</span>
                    <span class="race-info">${race.flag} <strong>${race.name}</strong>${raceTimeStr} ${extraTag}</span>
                    <div class="support-chips-row">${supportChips}</div>
                    ${winnerHtml}
                    ${tvChips}
                    ${statusHtml}
                </div>
                ${scheduleSections}
            </li>`;

        // Insertar break de verano después de la ronda indicada
        if (race.round === SUMMER_BREAK_AFTER) {
            html += `<li class="summer-break">🌴 <em>Pausa de verano europeo</em></li>`;
        }
    });

    list.innerHTML = html;
}


// ─── FIX 5: scorePredict en el Predictor — completa P2 y P3 reales ──────────
// REEMPLAZA la función scorePredict() dentro de renderPredictor() en main.js

function scorePredict(pred, race) {
    if (!pred || !race) return null;
    const actual = window.races.find(r => r.round === race.round);
    if (!actual) return null;

    // FIX: extraer P2 y P3 reales desde raceResults de cada piloto
    const podiumReal = [null, null, null];
    podiumReal[0] = actual.winner || null;
    window.drivers.forEach(d => {
        const idx = window.races.findIndex(r => r.round === race.round);
        if (idx < 0) return;
        const pos = d.raceResults?.[idx];
        if (pos === 2) podiumReal[1] = d.name;
        if (pos === 3) podiumReal[2] = d.name;
    });

    let score = 0;
    const positions = ['p1','p2','p3'];
    positions.forEach((pos, i) => {
        if (!pred[pos] || !podiumReal[i]) return;
        if (pred[pos] === podiumReal[i]) {
            score += 3;   // posición exacta
        } else if (podiumReal.includes(pred[pos])) {
            score += 1;   // piloto correcto, posición incorrecta
        }
    });

    // max teórico: 9 puntos (3 posiciones × 3 pts)
    return { score, max: 9, pct: Math.round((score / 9) * 100), podiumReal };
}


// ─── FIX 6: initPage — agregar renderCalendar() para page-calendar ───────────
// REEMPLAZA el bloque `if (body.classList.contains('page-calendar'))` en initPage()

/*
    if (body.classList.contains('page-calendar')) {
        renderCalendar();       // ← AGREGAR ESTA LÍNEA
        return;
    }
*/


// ─── FIX 7: home stats dinámicos ─────────────────────────────────────────────
// AGREGÁ esta llamada al inicio de la rama page-home en initPage():
// Reemplazá el bloque `if (body.classList.contains('page-home'))` en initPage()

/*
    if (body.classList.contains('page-home')) {
        renderHomeStats();              // ← AGREGAR
        renderChampionshipLeaders();
        renderCountdown();
        return;
    }
*/

// Y AGREGÁ esta función nueva en main.js:
function renderHomeStats() {
    const done      = (window.calendar || []).filter(r => r.status === 'done').length;
    const total     = (window.calendar || []).length;
    const remaining = total - done;

    const statEls = document.querySelectorAll('.hero-stat');
    if (!statEls.length) return;

    const data = [
        { num: done,               label: 'Carreras disputadas' },
        { num: remaining,          label: 'Restantes' },
        { num: window.constructors?.length || 11, label: 'Escuderías' },
        { num: window.drivers?.length || 22,      label: 'Pilotos' },
    ];

    statEls.forEach((el, i) => {
        if (!data[i]) return;
        const numEl = el.querySelector('.stat-number');
        if (numEl) numEl.textContent = data[i].num;
        const spans = el.querySelectorAll('span');
        if (spans[1]) spans[1].textContent = data[i].label;
    });
}
