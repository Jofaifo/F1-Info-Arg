function getTeamImage(teamSlug) {
    const team = window.findConstructorBySlug(teamSlug);
    return team && team.image ? team.image : null;
}

function searcher(query) {
    if (!query || typeof query !== 'string') return [];
    const q = query.trim().toLowerCase();

    const driverMatches = window.drivers
        .filter(driver =>
            driver.name.toLowerCase().includes(q) ||
            driver.team.toLowerCase().includes(q) ||
            (driver.nationality && driver.nationality.toLowerCase().includes(q)) ||
            (driver.code && driver.code.toLowerCase().includes(q))
        )
        .map(driver => ({ ...driver, type: 'driver' }));

    const constructorMatches = window.constructors
        .filter(team =>
            team.name.toLowerCase().includes(q) ||
            (team.origin && team.origin.toLowerCase().includes(q)) ||
            (team.engine && team.engine.toLowerCase().includes(q))
        )
        .map(team => ({ ...team, type: 'constructor' }));

    return [...driverMatches, ...constructorMatches];
}

function createTeamCell(teamName, code, colorClass, teamSlug) {
    const span = document.createElement('span');
    span.className = `team-chip ${colorClass}`.trim();

    const teamImage = teamSlug ? getTeamImage(teamSlug) : null;
    if (teamImage) {
        const img = document.createElement('img');
        img.className = 'team-cell-logo';
        img.src = teamImage;
        img.alt = `${teamName} logo`;
        span.appendChild(img);
    }

    const logo = document.createElement('span');
    logo.className = 'logo-badge';
    logo.textContent = code;

    const text = document.createElement('span');
    text.textContent = teamName;

    span.appendChild(logo);
    span.appendChild(text);
    return span;
}

function createEntityCard(entity, type) {
    const wrapper = document.createElement('article');
    wrapper.className = 'entity-card';

    const imageSrc = type === 'constructor' ? entity.image : getTeamImage(entity.teamSlug);
    if (imageSrc) {
        const img = document.createElement('img');
        img.className = 'entity-logo';
        img.src = imageSrc;
        img.alt = `${entity.name} logo`;
        wrapper.appendChild(img);
    }

    const badge = document.createElement('span');
    badge.className = `logo-badge ${entity.colorClass}`.trim();
    badge.textContent = entity.code;

    const title = document.createElement('h3');
    title.textContent = entity.name;

    const meta = document.createElement('p');
    meta.className = 'entity-meta';
    meta.textContent = type === 'driver' ? `${entity.team} • ${entity.points} pts` : `${entity.points} pts`;

    const info = document.createElement('p');
    info.className = 'entity-description';
    info.textContent = type === 'driver' ? entity.bio : entity.description;

    const link = document.createElement('a');
    link.className = 'detail-link';
    link.href = type === 'driver' ? `driver.html?slug=${entity.slug}` : `team.html?slug=${entity.slug}`;
    link.textContent = 'Ver mini página';

    wrapper.append(badge, title, meta, info, link);
    return wrapper;
}

function renderDriverStandings() {
    const tbody = document.querySelector('#driver-standings tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    window.drivers.forEach(driver => {
        const tr = document.createElement('tr');

        const positionCell = document.createElement('td');
        positionCell.className = 'position';
        positionCell.textContent = driver.position;

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

function renderConstructorStandings() {
    const tbody = document.querySelector('#constructor-standings tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    window.constructors.forEach(team => {
        const tr = document.createElement('tr');

        const positionCell = document.createElement('td');
        positionCell.className = 'position';
        positionCell.textContent = team.position;

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

function renderCards(containerId, list, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    list.forEach(item => {
        container.appendChild(createEntityCard(item, type));
    });
}

function renderSearchResults(results) {
    const resultsList = document.getElementById('search-results');
    if (!resultsList) return;
    resultsList.innerHTML = '';

    if (!results.length) {
        const emptyItem = document.createElement('li');
        emptyItem.textContent = 'Escribe un nombre de piloto o escudería para buscar.';
        emptyItem.className = 'empty-message';
        resultsList.appendChild(emptyItem);
        return;
    }

    results.forEach(entry => {
        const li = document.createElement('li');
        li.className = 'search-result-item';

        const label = entry.type === 'driver' ? 'Piloto' : 'Escudería';
        const link = entry.type === 'driver' ? `driver.html?slug=${entry.slug}` : `team.html?slug=${entry.slug}`;
        const imageSrc = entry.type === 'driver' ? getTeamImage(entry.teamSlug) : entry.image;

        li.innerHTML = `
            ${imageSrc ? `<img class="search-result-logo" src="${imageSrc}" alt="${entry.name} logo">` : ''}
            <div class="search-result-content">
                <strong>${entry.name}</strong>
                <span class="result-type">${label}</span>
                <span class="result-points">${entry.points} pts</span>
            </div>
            <a class="detail-link-inline" href="${link}">Ver mini página</a>
        `;
        resultsList.appendChild(li);
    });
}

function getSlugFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
}

function renderDriverDetail(slug) {
    const driver = window.findDriverBySlug(slug);
    const detail = document.getElementById('detail-content');
    const title = document.getElementById('detail-title');
    const subtitle = document.getElementById('detail-subtitle');
    if (!detail || !title || !subtitle) return;

    if (!driver) {
        title.textContent = 'Piloto no encontrado';
        subtitle.textContent = 'Prueba con otra búsqueda o regresa a la lista de pilotos.';
        detail.innerHTML = '<p class="empty-message">No existe esta mini página de piloto.</p>';
        return;
    }

    const color = (window.teamColors && window.teamColors[driver.teamSlug]) || '#888';
    const leader = window.drivers[0];
    const gap = driver.position === 1 ? 'Líder' : `-${leader.points - driver.points} pts del líder`;

    // Bandera real
    const flagHtml = driver.flagImg
        ? `<img src="${driver.flagImg}" alt="${driver.nationality}" class="detail-flag-img">`
        : `<span>${driver.flag || ''}</span>`;

    // Foto del piloto
    const photoHtml = driver.photo
        ? `<img class="driver-photo" src="${driver.photo}" alt="${driver.name}" style="border: 3px solid ${color}; box-shadow: 0 0 18px ${color}44;">`
        : '';

    // Logo del equipo
    const teamObj = window.findConstructorBySlug(driver.teamSlug);
    const teamLogoHtml = teamObj && teamObj.image
        ? `<img class="detail-team-logo" src="${teamObj.image}" alt="${teamObj.name}">`
        : '';

    // Tabla de resultados por carrera
    const racesDone = window.races || [];
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
    const raceRows = racesDone.map((race, i) => {
        const pos = driver.raceResults ? driver.raceResults[i] : null;
        const posLabel = pos == null
            ? '<span class="dnf">—</span>'
            : pos <= 3 ? `${medals[pos]} ${pos}º` : `${pos}º`;
        const pts = pos && pos >= 1 && pos <= 10 ? [25,18,15,12,10,8,6,4,2,1][pos-1] : 0;
        const rowClass = pos === 1 ? 'row-win' : (pos && pos <= 3 ? 'row-podium' : '');
        return `<tr class="${rowClass}">
            <td>${race.flag} ${race.name}${race.sprint ? ' <em class="sprint-tag">S</em>' : ''}</td>
            <td class="pos-cell">${posLabel}</td>
            <td class="pts-mini">${pts > 0 ? '+' + pts : '—'}</td>
        </tr>`;
    }).join('');

    // Gráfico SVG puntos acumulados
    const cumPts = window.getCumulativePoints ? window.getCumulativePoints(driver) : [];
    let chartHtml = '';
    if (cumPts.length > 1) {
        const W = 400, H = 150;
        const PAD = { top: 12, right: 16, bottom: 28, left: 36 };
        const iW = W - PAD.left - PAD.right;
        const iH = H - PAD.top - PAD.bottom;
        const maxPts = Math.max(...cumPts, 1);
        const n = cumPts.length;
        const xS = i => PAD.left + (i / (n - 1)) * iW;
        const yS = v => PAD.top + iH - (v / maxPts) * iH;
        const polyPts = cumPts.map((v, i) => `${xS(i)},${yS(v)}`).join(' ');
        const areaPts = [`${xS(0)},${PAD.top + iH}`,
            ...cumPts.map((v, i) => `${xS(i)},${yS(v)}`),
            `${xS(n - 1)},${PAD.top + iH}`].join(' ');
        const xLabels = racesDone.map((r, i) =>
            `<text x="${xS(i)}" y="${H - 4}" text-anchor="middle" fill="#555" font-size="9">${r.short}</text>`
        ).join('');
        const yLines = [0, 0.5, 1].map(t => {
            const y = PAD.top + iH - t * iH;
            return `<line x1="${PAD.left}" x2="${PAD.left + iW}" y1="${y}" y2="${y}" stroke="rgba(255,255,255,0.06)"/>
                    <text x="${PAD.left - 4}" y="${y + 4}" text-anchor="end" fill="#555" font-size="9">${Math.round(t * maxPts)}</text>`;
        }).join('');
        const dots = cumPts.map((v, i) =>
            `<circle cx="${xS(i)}" cy="${yS(v)}" r="4" fill="${color}" stroke="#111" stroke-width="2"><title>${racesDone[i]?.name}: ${v} pts</title></circle>`
        ).join('');
        chartHtml = `<div class="chart-wrapper">
            <h4 class="chart-title">Evolución de puntos</h4>
            <svg viewBox="0 0 ${W} ${H}" class="points-chart">
                <defs><linearGradient id="ag-${driver.slug}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
                </linearGradient></defs>
                ${yLines}${xLabels}
                <polygon points="${areaPts}" fill="url(#ag-${driver.slug})"/>
                <polyline points="${polyPts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
                ${dots}
            </svg></div>`;
    }

    title.innerHTML = `${flagHtml} ${driver.name}`;
    subtitle.textContent = `${driver.team} · ${driver.points} pts · P${driver.position}`;

    detail.innerHTML = `
        <div class="detail-grid">
            <div class="detail-card-main">
                <div class="driver-hero">
                    ${photoHtml}
                    <div class="driver-hero-info">
                        ${teamLogoHtml}
                        <div class="driver-stats-row">
                            <div class="driver-stat-pill" style="border-color:${color}">
                                <span class="stat-pill-num">${driver.wins}</span>
                                <span class="stat-pill-label">Victorias</span>
                            </div>
                            <div class="driver-stat-pill" style="border-color:${color}">
                                <span class="stat-pill-num">${driver.podiums}</span>
                                <span class="stat-pill-label">Podios</span>
                            </div>
                            <div class="driver-stat-pill" style="border-color:${color}">
                                <span class="stat-pill-num">${driver.poles || 0}</span>
                                <span class="stat-pill-label">Poles</span>
                            </div>
                            <div class="driver-stat-pill" style="border-color:${color}">
                                <span class="stat-pill-num">${driver.fastestLaps || 0}</span>
                                <span class="stat-pill-label">V. Rápidas</span>
                            </div>
                        </div>
                        <ul class="detail-list">
                            <li><strong>Posición:</strong> ${driver.position}º <span class="muted-text">(${gap})</span></li>
                            <li><strong>Puntos:</strong> ${driver.points}</li>
                            <li><strong>Nacionalidad:</strong> ${driver.nationality}</li>
                            <li><strong>Edad:</strong> ${driver.age} años</li>
                        </ul>
                    </div>
                </div>
                <p class="driver-bio">${driver.bio}</p>
                ${racesDone.length ? `
                <div class="race-results-table">
                    <h4>Resultados 2026</h4>
                    <table class="results-mini-table">
                        <thead><tr><th>Carrera</th><th>Pos.</th><th>Pts.</th></tr></thead>
                        <tbody>${raceRows}</tbody>
                    </table>
                </div>` : ''}
            </div>
            <div class="detail-aside">
                ${chartHtml}
                <h3 style="margin-top:1.25rem">Equipo</h3>
                <a class="team-link" href="team.html?slug=${driver.teamSlug}" style="color:${color}">${driver.team} →</a>
            </div>
        </div>`;
}

function renderTeamDetail(slug) {
    const team = window.findConstructorBySlug(slug);
    const detail = document.getElementById('detail-content');
    const title = document.getElementById('detail-title');
    const subtitle = document.getElementById('detail-subtitle');
    if (!detail || !title || !subtitle) return;

    if (!team) {
        title.textContent = 'Escudería no encontrada';
        subtitle.textContent = 'Prueba con otra búsqueda o regresa a la lista de equipos.';
        detail.innerHTML = '<p class="empty-message">No existe esta mini página de escudería.</p>';
        return;
    }

    const color = (window.teamColors && window.teamColors[team.slug]) || '#888';
    const leader = window.constructors[0];
    const gap = team.position === 1 ? 'Líder' : `-${leader.points - team.points} pts del líder`;

    const teamImage = team.image
        ? `<img class="detail-image" src="${team.image}" alt="${team.name} logo">`
        : '';

    // Banderas origen y base
    const originFlagHtml = team.originFlag
        ? `<img src="${team.originFlag}" class="detail-flag-img" alt=""> ${team.origin}`
        : team.origin || '—';
    const baseFlagHtml = team.baseFlag
        ? `<img src="${team.baseFlag}" class="detail-flag-img" alt=""> ${team.base}`
        : team.base || '—';

    // Pilotos con foto, bandera y puntos
    const driverCards = team.topDrivers.map(name => {
        const d = window.drivers.find(x => x.name === name);
        if (!d) return '';
        const dColor = (window.teamColors && window.teamColors[d.teamSlug]) || '#888';
        const pct = team.points > 0 ? Math.round((d.points / team.points) * 100) : 0;
        const dFlag = d.flagImg ? `<img src="${d.flagImg}" class="detail-flag-img" alt="">` : (d.flag || '');
        const dPhoto = d.photo ? `<img src="${d.photo}" class="driver-card-photo" alt="${d.name}" style="border-color:${dColor}">` : '';
        return `<div class="team-driver-card">
            ${dPhoto}
            <div class="team-driver-info">
                <div class="team-driver-name">${dFlag} <a href="driver.html?slug=${d.slug}" style="color:${dColor}">${d.name}</a></div>
                <div class="driver-bar-track" style="margin-top:0.4rem">
                    <div class="driver-bar-fill" style="width:${pct}%;background:${dColor}"></div>
                </div>
                <div class="team-driver-pts"><strong>${d.points}</strong> pts</div>
            </div>
        </div>`;
    }).join('');

    title.innerHTML = `${team.flagImg ? `<img src="${team.flagImg}" class="detail-flag-img" alt="">` : (team.flag || '')} ${team.name}`;
    subtitle.textContent = `${team.points} pts · P${team.position} · ${team.championships} campeonatos`;

    detail.innerHTML = `
        <div class="detail-grid">
            <div class="detail-card-main">
                ${teamImage}
                <p class="driver-bio">${team.description}</p>
                <ul class="detail-list">
                    <li><strong>Posición:</strong> ${team.position}º <span class="muted-text">(${gap})</span></li>
                    <li><strong>Puntos:</strong> ${team.points}</li>
                    <li><strong>Origen:</strong> ${originFlagHtml}</li>
                    <li><strong>Base:</strong> ${baseFlagHtml}</li>
                    <li><strong>Team Principal:</strong> ${team.teamPrincipal}</li>
                    <li><strong>Motor:</strong> ${team.engine}</li>
                    <li><strong>Campeonatos:</strong> ${team.championships}</li>
                </ul>
            </div>
            <div class="detail-aside">
                <h3>Pilotos</h3>
                <div class="team-drivers-grid">${driverCards}</div>
            </div>
        </div>`;
}

function initSearcher() {
    const input = document.getElementById('search-input');
    if (!input) return;

    input.addEventListener('input', () => {
        const results = searcher(input.value);
        renderSearchResults(results);
    });

    renderSearchResults([]);
}


// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function renderCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const nextRace = (window.calendar || []).find(r => r.status === 'next' || r.status === 'upcoming');
    if (!nextRace) { el.style.display = 'none'; return; }
    const raceDate = new Date(`${nextRace.date}T${nextRace.time ? nextRace.time + ':00' : '12:00:00'}-03:00`);

    // Next sprint: find upcoming sprint weekend after current race
    const nextSprint = (window.calendar || []).find(r =>
        (r.status === 'next' || r.status === 'upcoming') && r.sprint && r.round !== nextRace.round
    );
    const sprintTag = nextRace.sprint
        ? '<span class="cd-sprint-badge">🏎 Fin de semana Sprint</span>'
        : (nextSprint ? '<span class="cd-next-sprint">Próximo Sprint: ' + nextSprint.flag + ' ' + nextSprint.name + ' (R' + nextSprint.round + ')</span>' : '');

    function tick() {
        const diff = raceDate - new Date();
        if (diff <= 0) { el.innerHTML = '<span class="countdown-live">¡EN VIVO AHORA!</span>'; return; }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        el.innerHTML =
            '<div class="countdown-label">Próxima: ' + (nextRace.flag || '') + ' ' + nextRace.name + '</div>' +
            sprintTag +
            '<div class="countdown-time">' +
            '<span class="cd-unit"><strong>' + d + '</strong><small>días</small></span>' +
            '<span class="cd-sep">:</span>' +
            '<span class="cd-unit"><strong>' + String(h).padStart(2,'0') + '</strong><small>hs</small></span>' +
            '<span class="cd-sep">:</span>' +
            '<span class="cd-unit"><strong>' + String(m).padStart(2,'0') + '</strong><small>min</small></span>' +
            '<span class="cd-sep">:</span>' +
            '<span class="cd-unit"><strong>' + String(s).padStart(2,'0') + '</strong><small>seg</small></span>' +
            '</div>' +
            (nextRace.time ? '<div class="countdown-hour">🇦🇷 ' + nextRace.time + ' hs Argentina · Fox Sports / Disney+</div>' : '');
    }
    tick();
    setInterval(tick, 1000);
}

// ─── LÍDERES EN HOME ─────────────────────────────────────────────────────────
function renderChampionshipLeaders() {
    var dEl = document.getElementById('driver-leader');
    var tEl = document.getElementById('team-leader');
    if (dEl && window.drivers && window.drivers.length) {
        var d = window.drivers[0];
        var dColor = (window.teamColors && window.teamColors[d.teamSlug]) || '#888';
        var dFlag = d.flagImg ? '<img src="' + d.flagImg + '" class="detail-flag-img" alt="">' : (d.flag || '');
        dEl.innerHTML =
            '<div class="leader-label">Líder de pilotos</div>' +
            '<div class="leader-name" style="color:' + dColor + '">' + dFlag + ' ' + d.name + '</div>' +
            '<div class="leader-detail">' + d.team + ' · <strong>' + d.points + ' pts</strong></div>' +
            '<a class="detail-link" href="driver.html?slug=' + d.slug + '">Ver →</a>';
    }
    if (tEl && window.constructors && window.constructors.length) {
        var t = window.constructors[0];
        var tColor = (window.teamColors && window.teamColors[t.slug]) || '#888';
        var tFlag = t.flagImg ? '<img src="' + t.flagImg + '" class="detail-flag-img" alt="">' : (t.flag || '');
        tEl.innerHTML =
            '<div class="leader-label">Líder de constructores</div>' +
            '<div class="leader-name" style="color:' + tColor + '">' + tFlag + ' ' + t.name + '</div>' +
            '<div class="leader-detail"><strong>' + t.points + ' pts</strong></div>' +
            '<a class="detail-link" href="team.html?slug=' + t.slug + '">Ver →</a>';
    }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function initPage() {
    var body = document.body;

    if (body.classList.contains('page-home')) {
        renderChampionshipLeaders();
        renderCountdown();
        return;
    }
    if (body.classList.contains('page-search')) {
        initSearcher();
        return;
    }
    if (body.classList.contains('page-calendar')) {
        return;
    }
    if (body.classList.contains('page-drivers')) {
        renderDriverStandings();
        renderCards('driver-cards', window.drivers, 'driver');
        initSearcher();
        return;
    }
    if (body.classList.contains('page-teams')) {
        renderConstructorStandings();
        renderCards('team-cards', window.constructors, 'constructor');
        initSearcher();
        return;
    }
    if (body.classList.contains('page-driver-detail')) {
        renderDriverDetail(getSlugFromQuery());
        initSearcher();
        return;
    }
    if (body.classList.contains('page-team-detail')) {
        renderTeamDetail(getSlugFromQuery());
        initSearcher();
        return;
    }
    if (body.classList.contains('page-compare')) {
        initCompare();
        return;
    }
    if (body.classList.contains('page-circuits')) {
        renderCircuits();
        return;
    }
    if (body.classList.contains('page-glossary')) {
        initGlossary();
        return;
    }
    if (body.classList.contains('page-rookies')) {
        renderRookies();
        return;
    }
    if (body.classList.contains('page-today')) {
        initToday();
        return;
    }
    if (body.classList.contains('page-liveries')) {
        renderLiveries();
        return;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}

// ─── COMPARADOR DE PILOTOS ────────────────────────────────────────────────────
function initCompare() {
    const selA = document.getElementById('driver-a');
    const selB = document.getElementById('driver-b');
    if (!selA || !selB) return;

    window.drivers.forEach((d, i) => {
        const optA = document.createElement('option');
        optA.value = d.slug;
        optA.textContent = d.name + ' (' + d.team + ')';
        selA.appendChild(optA);

        const optB = document.createElement('option');
        optB.value = d.slug;
        optB.textContent = d.name + ' (' + d.team + ')';
        selB.appendChild(optB);
    });

    // Default to first two drivers
    if (selA.options.length > 1) selB.selectedIndex = 1;

    // Auto compare on selection change
    selA.addEventListener('change', runCompare);
    selB.addEventListener('change', runCompare);
    document.getElementById('compare-btn').addEventListener('click', runCompare);

    runCompare();
}

function runCompare() {
    const slugA = document.getElementById('driver-a').value;
    const slugB = document.getElementById('driver-b').value;
    const dA = window.findDriverBySlug(slugA);
    const dB = window.findDriverBySlug(slugB);
    const result = document.getElementById('compare-result');
    if (!dA || !dB || !result) return;

    if (slugA === slugB) {
        result.className = 'card compare-same-warning';
        result.innerHTML = '<p>Seleccioná dos pilotos distintos para comparar.</p>';
        return;
    }

    const colA = window.getTeamColor(dA.teamSlug);
    const colB = window.getTeamColor(dB.teamSlug);
    const racesDone = (window.races || []);
    const cumA = window.getCumulativePoints(dA);
    const cumB = window.getCumulativePoints(dB);

    function statBar(valA, valB, label, formatFn) {
        const fmt = formatFn || (v => v);
        const maxVal = Math.max(valA, valB, 1);
        const pctA = (valA / maxVal) * 100;
        const pctB = (valB / maxVal) * 100;
        const winnerA = valA > valB ? 'compare-stat-winner' : '';
        const winnerB = valB > valA ? 'compare-stat-winner' : '';
        return `<div class="cmp-stat-row">
            <div class="cmp-stat-a ${winnerA}">
                <span class="cmp-val" style="color:${colA}">${fmt(valA)}</span>
                <div class="cmp-bar-track"><div class="cmp-bar-fill" style="width:${pctA}%;background:${colA}"></div></div>
            </div>
            <div class="cmp-stat-label">${label}</div>
            <div class="cmp-stat-b ${winnerB}">
                <div class="cmp-bar-track cmp-bar-right"><div class="cmp-bar-fill cmp-bar-fill-right" style="width:${pctB}%;background:${colB}"></div></div>
                <span class="cmp-val" style="color:${colB}">${fmt(valB)}</span>
            </div>
        </div>`;
    }

    // Race-by-race comparison table
    const raceRows = racesDone.map((race, i) => {
        const posA = dA.raceResults ? dA.raceResults[i] : null;
        const posB = dB.raceResults ? dB.raceResults[i] : null;
        const pts = [25,18,15,12,10,8,6,4,2,1];
        const ptsA = posA && posA >= 1 && posA <= 10 ? pts[posA-1] : 0;
        const ptsB = posB && posB >= 1 && posB <= 10 ? pts[posB-1] : 0;
        const clsA = posA !== null && (posB === null || posA < posB) ? 'cmp-race-winner' : '';
        const clsB = posB !== null && (posA === null || posB < posA) ? 'cmp-race-winner' : '';
        return `<tr>
            <td class="cmp-race-cell ${clsA}" style="${clsA ? 'color:'+colA : ''}">${posA !== null ? posA+'º' : '—'} <span class="cmp-race-pts">${ptsA > 0 ? '+'+ptsA : ''}</span></td>
            <td class="cmp-race-name">${race.flag} ${race.name}${race.sprint ? ' <em class="sprint-tag">S</em>' : ''}</td>
            <td class="cmp-race-cell ${clsB}" style="${clsB ? 'color:'+colB : ''}">${posB !== null ? posB+'º' : '—'} <span class="cmp-race-pts">${ptsB > 0 ? '+'+ptsB : ''}</span></td>
        </tr>`;
    }).join('');

    // SVG dual-line chart
    let chartHtml = '';
    if (cumA.length > 1 && cumB.length > 1) {
        const W = 500, H = 160;
        const PAD = { top: 12, right: 16, bottom: 28, left: 40 };
        const iW = W - PAD.left - PAD.right;
        const iH = H - PAD.top - PAD.bottom;
        const n = racesDone.length;
        const maxPts = Math.max(...cumA, ...cumB, 1);
        const xS = i => PAD.left + (i / (n - 1)) * iW;
        const yS = v => PAD.top + iH - (v / maxPts) * iH;

        const polyA = cumA.map((v, i) => `${xS(i)},${yS(v)}`).join(' ');
        const polyB = cumB.map((v, i) => `${xS(i)},${yS(v)}`).join(' ');
        const xLabels = racesDone.map((r, i) =>
            `<text x="${xS(i)}" y="${H - 4}" text-anchor="middle" fill="#555" font-size="9">${r.short}</text>`
        ).join('');
        const dotsA = cumA.map((v, i) =>
            `<circle cx="${xS(i)}" cy="${yS(v)}" r="4" fill="${colA}" stroke="#111" stroke-width="2"><title>${racesDone[i]?.name}: ${v} pts</title></circle>`
        ).join('');
        const dotsB = cumB.map((v, i) =>
            `<circle cx="${xS(i)}" cy="${yS(v)}" r="4" fill="${colB}" stroke="#111" stroke-width="2"><title>${racesDone[i]?.name}: ${v} pts</title></circle>`
        ).join('');

        chartHtml = `<div class="cmp-chart-wrap">
            <h4 class="chart-title">Evolución de puntos</h4>
            <div class="cmp-chart-legend">
                <span><span class="cmp-legend-dot" style="background:${colA}"></span> ${dA.name}</span>
                <span><span class="cmp-legend-dot" style="background:${colB}"></span> ${dB.name}</span>
            </div>
            <svg viewBox="0 0 ${W} ${H}" class="points-chart cmp-chart-svg">
                ${xLabels}
                <polyline points="${polyA}" fill="none" stroke="${colA}" stroke-width="2.5" stroke-linejoin="round"/>
                <polyline points="${polyB}" fill="none" stroke="${colB}" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="6 3"/>
                ${dotsA}${dotsB}
            </svg>
        </div>`;
    }

    result.className = 'compare-result-visible';
    result.innerHTML = `
        <!-- Headers -->
        <div class="cmp-headers">
            <div class="cmp-header-a card" style="border-top:3px solid ${colA}">
                <img src="${dA.flagImg || ''}" class="detail-flag-img" alt="">
                <div class="cmp-hname" style="color:${colA}">${dA.name}</div>
                <div class="cmp-hteam">${dA.team}</div>
                <div class="cmp-hpts">${dA.points} pts · P${dA.position}</div>
            </div>
            <div class="cmp-vs-badge">VS</div>
            <div class="cmp-header-b card" style="border-top:3px solid ${colB}">
                <img src="${dB.flagImg || ''}" class="detail-flag-img" alt="">
                <div class="cmp-hname" style="color:${colB}">${dB.name}</div>
                <div class="cmp-hteam">${dB.team}</div>
                <div class="cmp-hpts">${dB.points} pts · P${dB.position}</div>
            </div>
        </div>

        <!-- Estadísticas -->
        <div class="card cmp-stats-card">
            <h3>Estadísticas</h3>
            <div class="cmp-stats-grid">
                ${statBar(dA.points, dB.points, 'Puntos')}
                ${statBar(dA.wins, dB.wins, 'Victorias')}
                ${statBar(dA.podiums, dB.podiums, 'Podios')}
                ${statBar(dA.poles || 0, dB.poles || 0, 'Poles')}
                ${statBar(dA.fastestLaps || 0, dB.fastestLaps || 0, 'V. Rápidas')}
                ${statBar(dA.age, dB.age, 'Edad', v => v + ' años')}
            </div>
        </div>

        <!-- Gráfico -->
        ${chartHtml ? '<div class="card">' + chartHtml + '</div>' : ''}

        <!-- Carrera a carrera -->
        ${raceRows ? `<div class="card cmp-race-card">
            <h3>Carrera a carrera</h3>
            <table class="cmp-race-table">
                <thead>
                    <tr>
                        <th style="color:${colA}">${dA.code}</th>
                        <th>Carrera</th>
                        <th style="color:${colB}">${dB.code}</th>
                    </tr>
                </thead>
                <tbody>${raceRows}</tbody>
            </table>
        </div>` : ''}
    `;
}

// ─── CIRCUITOS ───────────────────────────────────────────────────────────────
async function fetchCircuitSVG(slug) {
    try {
        const res = await fetch(`img/circuits/${slug}.svg`);
        if (!res.ok) return null;
        const text = await res.text();
        // Extract just the path data from the SVG
        const match = text.match(/<path[^>]+d="([^"]+)"/);
        const vbMatch = text.match(/viewBox="([^"]+)"/);
        return { d: match ? match[1] : null, viewBox: vbMatch ? vbMatch[1] : '0 0 500 500' };
    } catch { return null; }
}

function renderCircuits() {
    const grid = document.getElementById('circuits-grid');
    if (!grid || !window.circuits) return;

    // Render shells first, then async fill in SVGs
    grid.innerHTML = (window.circuits || []).map(c => {
        const flagHtml = c.flagImg ? `<img src="${c.flagImg}" class="detail-flag-img" alt="">` : (c.flag || '');
        return `<div class="card circuit-card" id="cc-${c.slug}">
            <div class="circuit-header">
                <div>
                    <div class="circuit-country">${flagHtml} ${c.country} · ${c.city}</div>
                    <h3 class="circuit-name">${c.name}</h3>
                </div>
                <div class="circuit-year">Desde ${c.firstGP}</div>
            </div>
            <div class="circuit-layout-wrap" id="clw-${c.slug}">
                <div class="circuit-svg-loading"></div>
            </div>
            <div class="circuit-stats">
                <div class="circuit-stat"><span class="cs-val">${c.length} km</span><span class="cs-label">Longitud</span></div>
                <div class="circuit-stat"><span class="cs-val">${c.laps}</span><span class="cs-label">Vueltas</span></div>
                <div class="circuit-stat"><span class="cs-val">${c.lapRecord}</span><span class="cs-label">Récord de vuelta</span></div>
            </div>
            <div class="circuit-record-holder">${c.lapRecordHolder} · ${c.lapRecordYear}</div>
            <p class="circuit-desc">${c.description}</p>
        </div>`;
    }).join('');

    // Async load each SVG
    window.circuits.forEach(async c => {
        const wrap = document.getElementById(`clw-${c.slug}`);
        if (!wrap) return;
        const svgData = await fetchCircuitSVG(c.slug);
        if (svgData && svgData.d) {
            wrap.innerHTML = `<svg viewBox="${svgData.viewBox}" class="circuit-svg" xmlns="http://www.w3.org/2000/svg">
                <path d="${svgData.d}" fill="none" stroke="${c.color}" stroke-width="5"
                      stroke-linejoin="round" stroke-linecap="round" opacity="0.3"/>
                <path d="${svgData.d}" fill="none" stroke="${c.color}" stroke-width="2.5"
                      stroke-linejoin="round" stroke-linecap="round"/>
            </svg>`;
        } else {
            wrap.innerHTML = `<div class="circuit-no-svg">Trazado no disponible</div>`;
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOQUE 1 — GLOSARIO, ROOKIES, ESTE DÍA EN LA F1, LIVRÉES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── DATOS: GLOSARIO F1 2026 ─────────────────────────────────────────────────
window.glossaryTerms = [
    // Reglamento 2026 — novedades
    {
        term: 'MOS',
        full: 'Manual Override System',
        cat: '2026',
        tag: 'NUEVO 2026',
        def: 'Reemplaza al DRS desde 2026. El piloto activa manualmente un modo de mayor potencia eléctrica en las zonas designadas de la pista. A diferencia del DRS, no abre un alerón trasero sino que boost la MGU-K para generar hasta 350 kW adicionales. Se puede usar en zonas de detección marcadas por la FIA, igual que el antiguo DRS.'
    },
    {
        term: 'Power Unit 2026',
        full: 'Nueva Unidad de Potencia',
        cat: '2026',
        tag: 'NUEVO 2026',
        def: 'El reglamento 2026 introdujo motores completamente nuevos: el componente eléctrico (MGU-K) ahora aporta aproximadamente el 50% de la potencia total (~350 kW frente a ~120 kW anteriores). La MGU-H fue eliminada. El motor de combustión interna (ICE) sigue siendo un V6 turbo de 1.6L pero optimizado para correr con combustibles 100% sostenibles (e-fuels).'
    },
    {
        term: 'E-Fuels',
        full: 'Combustibles sostenibles',
        cat: '2026',
        tag: 'NUEVO 2026',
        def: 'Desde 2026, todos los autos de F1 corren con combustibles 100% sostenibles, elaborados a partir de residuos agrícolas, biológicos o captura de carbono. No son eléctricos — el motor sigue quemando combustible, pero con huella de carbono neta cero.'
    },
    {
        term: 'Active Aerodynamics',
        full: 'Aerodinámica activa',
        cat: '2026',
        tag: 'NUEVO 2026',
        def: 'En 2026 los autos tienen elementos aerodinámicos que cambian su posición en carrera de forma automática: modo "Z" (baja resistencia) en rectas y modo "X" (máxima carga) en curvas. El sistema lo gestiona la ECU y no el piloto directamente, reemplazando la función del DRS.'
    },
    {
        term: 'MGU-K',
        full: 'Motor Generator Unit – Kinetic',
        cat: 'Motor',
        def: 'Unidad que recupera energía cinética durante el frenado y la devuelve como potencia eléctrica al acelerar. En 2026 es el componente eléctrico principal de la power unit, aportando hasta 350 kW — mucho más que en generaciones anteriores. La MGU-H fue eliminada.'
    },
    {
        term: 'ICE',
        full: 'Internal Combustion Engine',
        cat: 'Motor',
        def: 'El motor de combustión interna de la F1: V6 turboalimentado de 1.6 litros que gira hasta 15.000 RPM. Desde 2026 corre exclusivamente con e-fuels. Cada piloto puede usar un máximo de 4 ICE por temporada antes de recibir penalidades en la grilla.'
    },
    {
        term: 'ERS',
        full: 'Energy Recovery System',
        cat: 'Motor',
        def: 'Sistema de recuperación de energía. En 2026 solo incluye la MGU-K (ya no hay MGU-H). Recupera energía en los frenos y la almacena en la batería para ser usada como boost eléctrico, especialmente en las zonas de activación del MOS.'
    },
    {
        term: 'Parc Fermé',
        full: 'Parque cerrado',
        cat: 'Reglamento',
        def: 'Período en el que los equipos no pueden hacer cambios significativos al auto. Comienza al final de la clasificación y termina al arrancar la carrera. En fines de semana Sprint, el parc fermé es más largo. Cambios no autorizados implican largada desde el pit lane.'
    },
    {
        term: 'Undercut',
        full: 'Estrategia de adelantamiento por boxes',
        cat: 'Estrategia',
        def: 'Estrategia donde un piloto entra al pit lane antes que su rival, monta neumáticos frescos y da una vuelta rápida para salir adelante cuando el rival haga su propia parada. Efectivo cuando hay tráfico o cuando los neumáticos nuevos generan mucho tiempo por vuelta.'
    },
    {
        term: 'Overcut',
        full: 'Estrategia inversa al undercut',
        cat: 'Estrategia',
        def: 'Lo opuesto al undercut: el piloto espera más que su rival para hacer la parada, confiando en que puede mantener el ritmo con neumáticos más gastados y salir adelante aprovechando que el rival pierde tiempo al detenerse en boxes primero.'
    },
    {
        term: 'Degración',
        full: 'Degradación de neumáticos',
        cat: 'Neumáticos',
        def: 'Pérdida de rendimiento de un neumático a lo largo de su vida útil. Alta degradación significa que el piloto debe hacer más paradas o cuidar más los gomas. Es uno de los factores estratégicos más importantes de cada carrera.'
    },
    {
        term: 'Graining',
        full: 'Granulación del neumático',
        cat: 'Neumáticos',
        def: 'Fenómeno donde pequeños trozos de goma se desprenden del neumático y se adhieren a la superficie, creando una capa irregular que reduce el agarre. Suele ocurrir al inicio de un stint cuando el neumático aún no llegó a la temperatura óptima. Diferente a la degradación estructural.'
    },
    {
        term: 'Stint',
        full: 'Período entre paradas',
        cat: 'Estrategia',
        def: 'El período de vueltas que un piloto completa con el mismo juego de neumáticos entre paradas en boxes. Una carrera de dos paradas tiene tres stints. La duración y ritmo de cada stint es clave para la estrategia.'
    },
    {
        term: 'VSC',
        full: 'Virtual Safety Car',
        cat: 'Carrera',
        def: 'Procedimiento de neutralización donde todos los pilotos deben reducir velocidad a un delta mínimo sin necesidad de agruparse detrás del Safety Car físico. Se activa ante incidentes menores. Es momento clave para hacer paradas en boxes sin perder mucho tiempo.'
    },
    {
        term: 'Safety Car',
        full: 'Auto de seguridad',
        cat: 'Carrera',
        def: 'Vehículo oficial que sale a pista ante incidentes graves, obligando a todos los pilotos a formar una fila detrás suyo a baja velocidad. No se permite adelantar. Las paradas durante el Safety Car son muy valoradas porque el tiempo perdido en boxes se minimiza.'
    },
    {
        term: 'Formation Lap',
        full: 'Vuelta de formación',
        cat: 'Carrera',
        def: 'La vuelta que dan todos los pilotos antes de la salida para calentar neumáticos y frenos, y formar la grilla en las posiciones correctas. Los pilotos realizan zigzags para generar calor en los neumáticos.'
    },
    {
        term: 'Pit Window',
        full: 'Ventana de parada',
        cat: 'Estrategia',
        def: 'El rango de vueltas en el que estratégicamente conviene hacer una parada en boxes. Los equipos calculan la pit window considerando degradación de neumáticos, tráfico y posibles Safety Cars.'
    },
    {
        term: 'Flat Spot',
        full: 'Zona plana en el neumático',
        cat: 'Neumáticos',
        def: 'Desgaste plano en un punto del neumático causado por el bloqueo de ruedas en una frenada. Genera vibración en el auto y puede forzar una parada no planeada en boxes si el daño es severo.'
    },
    {
        term: 'FIA',
        full: 'Fédération Internationale de l\'Automobile',
        cat: 'Organización',
        def: 'El organismo rector del automovilismo mundial. Establece y hace cumplir el Reglamento Deportivo y Técnico de la F1. Los comisarios deportivos de la FIA son los encargados de investigar y sancionar incidentes en carrera.'
    },
    {
        term: 'FOM',
        full: 'Formula One Management',
        cat: 'Organización',
        def: 'La empresa comercial que administra los derechos televisivos, de marketing y la organización logística del campeonato de F1. Es propiedad de Liberty Media. Diferente a la FIA, que es el ente regulador.'
    },
    {
        term: 'Parrilla de largada',
        full: 'Grid de salida',
        cat: 'Carrera',
        def: 'Las posiciones de inicio de la carrera, determinadas por los tiempos de clasificación. El piloto más rápido en la Q3 larga desde la pole position. Las posiciones pueden modificarse por penalidades (cambio de motor, incidentes).'
    },
    {
        term: 'Pole Position',
        full: 'Primera posición en la grilla',
        cat: 'Carrera',
        def: 'La posición número 1 de la grilla de largada, otorgada al piloto más rápido en la sesión de clasificación. Da una ventaja importante en circuitos donde adelantar es difícil (como Mónaco o Hungaroring). Vale 1 punto adicional si se registra la vuelta más rápida en Q1, Q2 o Q3.'
    },
    {
        term: 'Q1 / Q2 / Q3',
        full: 'Fases de clasificación',
        cat: 'Clasificación',
        def: 'La clasificación se divide en tres segmentos eliminatorios. Q1 (18 min): eliminan los 5 más lentos. Q2 (15 min): eliminan otros 5. Q3 (12 min): los 10 restantes pelean por la pole. En Q2, los pilotos que avanzan a Q3 deben largar con los neumáticos usados en Q2.'
    },
    {
        term: 'Sprint',
        full: 'Carrera Sprint',
        cat: 'Formato',
        def: 'Carrera corta de aproximadamente 100 km (un tercio de la distancia normal) que se disputa algunos fines de semana. En 2026 hay 6 fines de semana Sprint. La grilla Sprint se determina en una clasificación específica (Sprint Shootout). Los puntos son reducidos: 8-7-6-5-4-3-2-1 para los top 8.'
    },
    {
        term: 'Sprint Shootout',
        full: 'Clasificación para el Sprint',
        cat: 'Formato',
        def: 'La sesión de clasificación que determina la grilla de la carrera Sprint en los fines de semana que la incluyen. Es independiente de la clasificación principal y no afecta la grilla de la carrera del domingo.'
    },
    {
        term: 'Marbles',
        full: 'Bolitas de goma',
        cat: 'Pista',
        def: 'Pequeños trozos de goma que se acumulan fuera de la línea de carrera durante la carrera. Si un piloto sale de la trayectoria ideal (por ejemplo en una maniobra de adelantamiento), puede pisar marbles y perder agarre repentinamente.'
    },
    {
        term: 'DRS',
        full: 'Drag Reduction System',
        cat: 'Histórico',
        tag: 'ELIMINADO 2026',
        def: 'Sistema que permitía abrir el alerón trasero para reducir resistencia aerodinámica y facilitar adelantamientos. Estuvo vigente desde 2011 hasta 2025. En 2026 fue reemplazado por el MOS (Manual Override System) y la aerodinámica activa del nuevo reglamento.'
    },
    {
        term: 'MGU-H',
        full: 'Motor Generator Unit – Heat',
        cat: 'Histórico',
        tag: 'ELIMINADO 2026',
        def: 'Unidad que recuperaba energía del turbocompresor (calor de los gases de escape) y la convertía en electricidad. Era el componente más complejo y costoso de la power unit 2014–2025. Fue eliminada en 2026 para reducir costos y atraer nuevos fabricantes de motores.'
    },
    {
        term: 'Concorde Agreement',
        full: 'Acuerdo Concorde',
        cat: 'Organización',
        def: 'El contrato entre la FIA, la FOM y los equipos que regula la participación en el campeonato, la distribución de los ingresos comerciales y las reglas de gobernanza. El acuerdo vigente va hasta 2029.'
    },
    {
        term: 'Cost Cap',
        full: 'Límite de presupuesto',
        cat: 'Reglamento',
        def: 'Límite al gasto de los equipos introducido en 2021. En 2026 es de aproximadamente 135 millones de dólares por temporada para los equipos grandes, con ajustes según posición en el campeonato. Excederlo resulta en penalidades deportivas y económicas.'
    },
    {
        term: 'Punto extra por VR',
        full: 'Punto por vuelta rápida',
        cat: 'Puntuación',
        def: 'Desde 2019, el piloto que registra la vuelta más rápida de la carrera recibe 1 punto extra, pero solo si termina dentro de los top 10. En 2026 este sistema sigue vigente. No aplica en las carreras Sprint.'
    },
];

// ─── DATOS: ESTE DÍA EN LA F1 ─────────────────────────────────────────────────
// Formato: { month: 1-12, day: 1-31, year, title, desc, category }
window.f1History = [
    { month:1,  day:8,  year:1980, title:'Jody Scheckter anuncia su retiro', desc:'El campeón del mundo 1979 con Ferrari anuncia oficialmente su retiro de la Fórmula 1 tras una temporada 1980 complicada.', category:'Pilotos' },
    { month:1,  day:17, year:2019, title:'Presentación del Williams FW42', desc:'Williams presenta el FW42, su monoplaza para la temporada 2019, iniciando la era de presentaciones digitales de autos en F1.', category:'Equipos' },
    { month:2,  day:1,  year:2014, title:'Reglamento turbo V6', desc:'Entra en vigor el nuevo reglamento que introduce los motores turbo V6 híbridos en F1, los llamados power units que dominaron hasta 2025.', category:'Reglamento' },
    { month:2,  day:14, year:2020, title:'Ferrari SF1000', desc:'Ferrari presenta el SF1000, el auto con el que Charles Leclerc y Sebastian Vettel disputarían la temporada 2020.', category:'Equipos' },
    { month:3,  day:8,  year:1992, title:'Mansell gana en Sudáfrica', desc:'Nigel Mansell arranca la temporada 1992 con victoria en Kyalami, camino a su único título mundial con Williams.', category:'Carreras' },
    { month:3,  day:15, year:1970, title:'Debut del Lotus 72', desc:'El revolucionario Lotus 72 de Colin Chapman hace su debut, introduciendo la distribución de peso adelantada y los pontones laterales que cambiarían el diseño de los autos de F1.', category:'Técnica' },
    { month:3,  day:26, year:2000, title:'Michael Schumacher gana el GP de Australia', desc:'Schumacher arranca el año 2000 dominando en Melbourne, temporada en la que lograría su primer título con Ferrari tras 21 años de sequía del equipo.', category:'Carreras' },
    { month:4,  day:1,  year:2001, title:'Ralf Schumacher gana en San Marino', desc:'Ralf Schumacher logra su segunda victoria en F1 en Imola, por delante de su hermano Michael en un doblete histórico de los Schumacher.', category:'Carreras' },
    { month:4,  day:19, year:1970, title:'Fallece Bruce McLaren', desc:'El fundador del equipo McLaren fallece en un accidente probando el McLaren Can-Am en Goodwood. Tenía 32 años. Su equipo continuaría y se convertiría en uno de los más exitosos de la historia.', category:'Pilotos' },
    { month:5,  day:3,  year:1987, title:'Alain Prost gana en Bélgica', desc:'Prost victorioso en Spa, en una temporada dominada por la rivalidad con Senna dentro del equipo McLaren.', category:'Carreras' },
    { month:5,  day:10, year:1994, title:'Funeral de Ayrton Senna', desc:'Brasil despide a Ayrton Senna con un funeral de estado en São Paulo. Millones de personas se agolparon en las calles para despedir al tricampeón del mundo.', category:'Pilotos' },
    { month:5,  day:23, year:1982, title:'Gilles Villeneuve fallece en Bélgica', desc:'El querido piloto canadiense fallece tras un accidente durante la clasificación del GP de Bélgica en Zolder. El circuito de Montreal lleva su nombre en su honor.', category:'Pilotos' },
    { month:6,  day:5,  year:2011, title:'Sebastian Vettel en Monaco', desc:'Vettel gana en Montecarlo dominando toda la carrera y ampliando su ventaja en el campeonato 2011, temporada en la que se consagraría bicampeón del mundo.', category:'Carreras' },
    { month:6,  day:11, year:1950, title:'Primer GP de la historia', desc:'Se disputa el primer Gran Premio del Campeonato Mundial de Fórmula 1 en Silverstone. Giuseppe Farina gana la carrera y se convertiría en el primer campeón del mundo de F1.', category:'Historia' },
    { month:6,  day:14, year:1998, title:'Michael Schumacher gana en Canadá', desc:'Schumacher victorioso en Montreal con Ferrari, en una de las mejores actuaciones del año en su marcha hacia el título. Fue la primera victoria de Ferrari en Canadá desde 1985.', category:'Carreras' },
    { month:6,  day:20, year:2010, title:'Mark Webber gana en Valencia', desc:'Webber logra una memorable victoria en el GP de Europa disputado en el circuito urbano de Valencia, en una carrera con múltiples incidentes.', category:'Carreras' },
    { month:7,  day:2,  year:2017, title:'Lewis Hamilton gana en Austria', desc:'Hamilton derrota a su compañero Bottas en el Red Bull Ring en una carrera cerrada, manteniendo su ventaja en el campeonato 2017.', category:'Carreras' },
    { month:7,  day:14, year:1996, title:'Damon Hill campeón virtual', desc:'Hill gana en Alemania y ya parece imparable hacia su primer título mundial, que confirmaría más adelante en Japón.', category:'Carreras' },
    { month:7,  day:18, year:2021, title:'Verstappen y Hamilton chocan en Silverstone', desc:'El choque en la primera curva de Copse entre Verstappen y Hamilton se convierte en uno de los más polémicos de la historia reciente. Verstappen se lleva el peor parte y Hamilton gana.', category:'Incidentes' },
    { month:7,  day:22, year:2007, title:'Ferrari presenta el sistema KERS', desc:'Ferrari anuncia que trabaja en el sistema de recuperación de energía cinética que introduciría en 2009, anticipándose a los cambios técnicos que vendrían.', category:'Técnica' },
    { month:8,  day:1,  year:1976, title:'Niki Lauda sobrevive al fuego en Nürburgring', desc:'Niki Lauda sufre un terrible accidente en el Nürburgring y casi pierde la vida entre las llamas de su Ferrari. Su recuperación y regreso apenas 40 días después sigue siendo una de las historias más increíbles del deporte.', category:'Historia' },
    { month:8,  day:13, year:2000, title:'Schumacher 41 victorias, récord de Prost', desc:'Michael Schumacher supera el récord de 41 victorias en F1 de Alain Prost al ganar en Hungría, convirtiéndose en el piloto con más victorias de la historia (hasta ese momento).', category:'Récords' },
    { month:8,  day:27, year:2023, title:'Verstappen récord de victorias consecutivas', desc:'Max Verstappen gana su décima carrera consecutiva en el GP de Bélgica, rompiendo el récord histórico de victorias seguidas en una misma temporada.', category:'Récords' },
    { month:9,  day:3,  year:2017, title:'Lewis Hamilton supera 300 puntos en 2017', desc:'Hamilton en racha imparable hacia su cuarto título, superando los 300 puntos en el campeonato de pilotos en la primera mitad de la temporada 2017.', category:'Récords' },
    { month:9,  day:7,  year:2008, title:'Felipe Massa gana en Italia', desc:'Massa victorioso en Monza en su temporada más competitiva, en la que estuvo a un punto de ganar el campeonato del mundo perdido en el último segundo en Brasil.', category:'Carreras' },
    { month:9,  day:11, year:2022, title:'Charles Leclerc gana en Monza', desc:'Leclerc triunfa en el Templo de la Velocidad ante su tifosi, logrando una de sus victorias más emotivas con Ferrari.', category:'Carreras' },
    { month:9,  day:20, year:2015, title:'Lewis Hamilton campeón del mundo', desc:'Hamilton se consagra tricampeón del mundo en Japón con tres carreras de antelación, igualdando a Niki Lauda y Nelson Piquet. Sería el primero de cuatro títulos consecutivos.', category:'Campeones' },
    { month:10, day:2,  year:2016, title:'Nico Rosberg gana en Malasia', desc:'Victoria de Rosberg en un fin de semana en que el motor de Hamilton falla, cambiando el rumbo del campeonato 2016 que Rosberg terminaría ganando.', category:'Carreras' },
    { month:10, day:9,  year:2022, title:'Verstappen tetracampeón potencial', desc:'Verstappen se acerca al segundo título en Japón 2022 en circunstancias confusas con la lluvia y el Safety Car. Sería el inicio de la era dominante de Red Bull.', category:'Campeones' },
    { month:10, day:21, year:2018, title:'Lewis Hamilton, quinto campeonato', desc:'Hamilton iguala a Juan Manuel Fangio con cinco títulos mundiales al ganar en México 2018, consolidándose como uno de los más grandes de la historia.', category:'Campeones' },
    { month:11, day:1,  year:2020, title:'Hamilton iguala récord de Schumacher', desc:'Lewis Hamilton gana su séptimo campeonato del mundo en Turquía 2020, igualando el récord histórico de Michael Schumacher que parecía inalcanzable.', category:'Récords' },
    { month:11, day:14, year:2021, title:'Verstappen lidera el campeonato en Brasil', desc:'Verstappen y Hamilton electrizan a la F1 con una batalla épica en Interlagos. Hamilton remonta desde el fondo y gana, pero el holandés mantiene la ventaja en el campeonato.', category:'Carreras' },
    { month:11, day:22, year:2020, title:'Primer GP de Las Vegas nocturno', desc:'La F1 anuncia oficialmente el retorno del Gran Premio de Las Vegas para 2023, corriendo de noche por el Strip, con un formato completamente nuevo y espectacular.', category:'Historia' },
    { month:12, day:8,  year:2019, title:'Carlos Sainz firma con McLaren', desc:'Sainz anuncia su fichaje por McLaren para 2019 luego de destacarse en Renault, iniciando el período de mayor crecimiento de su carrera.', category:'Pilotos' },
    { month:12, day:12, year:2021, title:'Max Verstappen, primer campeón holandés', desc:'En la vuelta más dramática de la historia de la F1, Verstappen supera a Hamilton en la última vuelta del GP de Abu Dhabi 2021 para ganar su primer campeonato del mundo.', category:'Campeones' },
];

// ─── DATOS: ROOKIES 2026 ──────────────────────────────────────────────────────
window.rookieSlugs = [
    'kimi-antonelli',
    'isack-hadjar',
    'arvid-lindblad',
    'gabriel-bortoleto',
    'oliver-bearman',
];

window.rookieExtra = {
    'kimi-antonelli': {
        dob: '25 de agosto de 2006',
        hometown: 'Bolonia, Italia',
        champion: 'F2 2024',
        quote: '"Siempre soñé con esto. Ahora tengo que demostrarlo carrera a carrera."',
        highlight: 'Lidera el campeonato en su primera temporada completa — el rookie más joven en lograrlo.',
    },
    'isack-hadjar': {
        dob: '28 de febrero de 2005',
        hometown: 'París, Francia',
        champion: 'F2 2024 (subcampeón)',
        quote: '"Cada vuelta es un aprendizaje. Estoy absorbiendo todo lo que puedo."',
        highlight: 'Consistente debut con Red Bull Racing, sumando puntos importantes.',
    },
    'arvid-lindblad': {
        dob: '26 de septiembre de 2007',
        hometown: 'Newark, Reino Unido',
        champion: 'F3 2024',
        quote: '"Soy el más joven de la parrilla pero eso no me detiene."',
        highlight: 'Con 18 años, uno de los pilotos más jóvenes en debutar en la historia de la F1.',
    },
    'gabriel-bortoleto': {
        dob: '14 de octubre de 2004',
        hometown: 'São Paulo, Brasil',
        champion: 'F3 2023, F2 2024',
        quote: '"Brasil vuelve a tener un piloto peleando en F1. Eso me llena de orgullo."',
        highlight: 'Campeón de F2 y F3 consecutivo — uno de los rookies más preparados de los últimos años.',
    },
    'oliver-bearman': {
        dob: '8 de mayo de 2005',
        hometown: 'Chelmsford, Reino Unido',
        champion: 'F2 2023 (subcampeón)',
        quote: '"Ya corrí para Ferrari en 2024. Ahora quiero demostrar que puedo pelear arriba con regularidad."',
        highlight: 'Ya tenía experiencia en F1 por sustituciones. Su primera temporada completa confirma su talento.',
    },
};

// ─── RENDER: GLOSARIO ─────────────────────────────────────────────────────────
function renderGlossary(filter = '', catFilter = 'Todos') {
    const list = document.getElementById('glossary-list');
    const empty = document.getElementById('glossary-empty');
    const emptyQ = document.getElementById('glossary-empty-q');
    if (!list) return;

    const q = filter.trim().toLowerCase();
    const terms = window.glossaryTerms.filter(t => {
        const matchCat = catFilter === 'Todos' || t.cat === catFilter;
        const matchQ = !q ||
            t.term.toLowerCase().includes(q) ||
            (t.full && t.full.toLowerCase().includes(q)) ||
            t.def.toLowerCase().includes(q);
        return matchCat && matchQ;
    });

    if (terms.length === 0) {
        list.innerHTML = '';
        empty.style.display = '';
        if (emptyQ) emptyQ.textContent = filter;
        return;
    }
    empty.style.display = 'none';

    // Group by category
    const bycat = {};
    terms.forEach(t => {
        if (!bycat[t.cat]) bycat[t.cat] = [];
        bycat[t.cat].push(t);
    });

    const catOrder = ['2026', 'Motor', 'Estrategia', 'Neumáticos', 'Carrera', 'Clasificación', 'Formato', 'Pista', 'Reglamento', 'Puntuación', 'Organización', 'Histórico'];
    const orderedCats = catOrder.filter(c => bycat[c]).concat(Object.keys(bycat).filter(c => !catOrder.includes(c)));

    list.innerHTML = orderedCats.map(cat => `
        <div class="glossary-cat-section">
            <h3 class="glossary-cat-title">${cat}</h3>
            <div class="glossary-cat-items">
                ${bycat[cat].map(t => `
                    <div class="card glossary-item">
                        <div class="glossary-item-header">
                            <div>
                                <span class="glossary-term">${t.term}</span>
                                ${t.full ? `<span class="glossary-full">— ${t.full}</span>` : ''}
                            </div>
                            ${t.tag ? `<span class="glossary-tag ${t.tag.includes('ELIM') ? 'tag-eliminated' : 'tag-new'}">${t.tag}</span>` : ''}
                        </div>
                        <p class="glossary-def">${t.def}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function initGlossary() {
    const catsEl = document.getElementById('glossary-cats');
    const searchEl = document.getElementById('glossary-search');
    if (!catsEl || !searchEl) return;

    // Build category filters
    const cats = ['Todos', ...new Set(window.glossaryTerms.map(t => t.cat))];
    const catOrder = ['Todos', '2026', 'Motor', 'Estrategia', 'Neumáticos', 'Carrera', 'Clasificación', 'Formato', 'Pista', 'Reglamento', 'Puntuación', 'Organización', 'Histórico'];
    const orderedCats = catOrder.filter(c => cats.includes(c)).concat(cats.filter(c => !catOrder.includes(c)));

    let activeCat = 'Todos';
    catsEl.innerHTML = orderedCats.map(c => `
        <button class="glossary-cat-btn ${c === 'Todos' ? 'active' : ''}" data-cat="${c}">${c}</button>
    `).join('');

    catsEl.addEventListener('click', e => {
        const btn = e.target.closest('.glossary-cat-btn');
        if (!btn) return;
        activeCat = btn.dataset.cat;
        catsEl.querySelectorAll('.glossary-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGlossary(searchEl.value, activeCat);
    });

    searchEl.addEventListener('input', () => renderGlossary(searchEl.value, activeCat));

    renderGlossary();
}

// ─── RENDER: ROOKIES ──────────────────────────────────────────────────────────
function renderRookies() {
    const grid = document.getElementById('rookies-grid');
    const chartEl = document.getElementById('rookies-compare-chart');
    if (!grid) return;

    const rookies = (window.rookieSlugs || [])
        .map(s => window.drivers.find(d => d.slug === s))
        .filter(Boolean);

    grid.innerHTML = rookies.map(d => {
        const color = window.getTeamColor(d.teamSlug);
        const extra = (window.rookieExtra || {})[d.slug] || {};
        const cum = window.getCumulativePoints(d);
        const lastPts = cum.length > 0 ? cum[cum.length - 1] : 0;

        // Mini sparkline
        const W = 200, H = 50;
        const maxP = Math.max(...cum, 1);
        const n = cum.length;
        let sparkline = '';
        if (n > 1) {
            const pts = cum.map((v, i) => `${20 + (i/(n-1))*(W-40)},${H - 8 - (v/maxP)*(H-16)}`).join(' ');
            sparkline = `<svg viewBox="0 0 ${W} ${H}" class="rookie-sparkline">
                <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
                ${cum.map((v, i) => `<circle cx="${20 + (i/(n-1))*(W-40)}" cy="${H - 8 - (v/maxP)*(H-16)}" r="3" fill="${color}"/>`).join('')}
            </svg>`;
        }

        return `<div class="card rookie-card" style="border-top: 3px solid ${color}">
            <div class="rookie-header">
                <img src="${d.flagImg || ''}" class="detail-flag-img" alt="">
                <div>
                    <h3 class="rookie-name" style="color:${color}">${d.name}</h3>
                    <div class="rookie-team">${d.team} · #${d.code}</div>
                </div>
                <div class="rookie-pos">P${d.position}</div>
            </div>
            ${extra.highlight ? `<div class="rookie-highlight">⭐ ${extra.highlight}</div>` : ''}
            <div class="rookie-stats-row">
                <div class="rookie-stat"><span class="rs-val" style="color:${color}">${d.points}</span><span class="rs-label">Puntos</span></div>
                <div class="rookie-stat"><span class="rs-val" style="color:${color}">${d.wins}</span><span class="rs-label">Victorias</span></div>
                <div class="rookie-stat"><span class="rs-val" style="color:${color}">${d.podiums}</span><span class="rs-label">Podios</span></div>
                <div class="rookie-stat"><span class="rs-val" style="color:${color}">${d.poles || 0}</span><span class="rs-label">Poles</span></div>
            </div>
            ${sparkline ? `<div class="rookie-sparkline-wrap">${sparkline}</div>` : ''}
            <div class="rookie-extra">
                ${extra.dob ? `<div class="rookie-info-row"><span>🎂</span><span>${extra.dob}</span></div>` : ''}
                ${extra.hometown ? `<div class="rookie-info-row"><span>📍</span><span>${extra.hometown}</span></div>` : ''}
                ${extra.champion ? `<div class="rookie-info-row"><span>🏆</span><span>${extra.champion}</span></div>` : ''}
                ${extra.quote ? `<blockquote class="rookie-quote">${extra.quote}</blockquote>` : ''}
            </div>
            <a href="driver.html?slug=${d.slug}" class="rookie-detail-link" style="color:${color}">Ver perfil completo →</a>
        </div>`;
    }).join('');

    // Comparison chart
    if (chartEl && rookies.length > 1) {
        const W = 600, H = 180;
        const PAD = { top: 12, right: 20, bottom: 28, left: 36 };
        const iW = W - PAD.left - PAD.right;
        const iH = H - PAD.top - PAD.bottom;
        const n = window.races.length;
        const allCums = rookies.map(d => window.getCumulativePoints(d));
        const maxPts = Math.max(...allCums.flat(), 1);
        const xS = i => PAD.left + (n > 1 ? (i / (n-1)) * iW : iW/2);
        const yS = v => PAD.top + iH - (v / maxPts) * iH;

        const lines = rookies.map((d, ri) => {
            const cum = allCums[ri];
            const color = window.getTeamColor(d.teamSlug);
            const poly = cum.map((v, i) => `${xS(i)},${yS(v)}`).join(' ');
            const dots = cum.map((v, i) => `<circle cx="${xS(i)}" cy="${yS(v)}" r="4" fill="${color}" stroke="#111" stroke-width="1.5"><title>${d.name}: ${v} pts</title></circle>`).join('');
            return `<polyline points="${poly}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
                    ${dots}`;
        }).join('');

        const xLabels = window.races.map((r, i) =>
            `<text x="${xS(i)}" y="${H - 4}" text-anchor="middle" fill="#555" font-size="9">${r.short}</text>`
        ).join('');

        const legend = rookies.map((d, ri) => {
            const color = window.getTeamColor(d.teamSlug);
            return `<span style="display:inline-flex;align-items:center;gap:4px;margin-right:12px">
                <span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block"></span>
                <span style="font-size:0.78rem;color:#aaa">${d.name.split(' ')[1] || d.name}</span>
            </span>`;
        }).join('');

        chartEl.innerHTML = `
            <div style="margin-bottom:0.5rem">${legend}</div>
            <svg viewBox="0 0 ${W} ${H}" style="width:100%">
                ${xLabels}${lines}
            </svg>`;
    }
}

// ─── RENDER: ESTE DÍA EN LA F1 ────────────────────────────────────────────────
let todayOffset = 0;

function renderToday(offset) {
    const mainEl = document.getElementById('today-main');
    const moreEl = document.getElementById('today-more');
    const labelEl = document.getElementById('today-date-label');
    const navLabelEl = document.getElementById('today-nav-label');
    if (!mainEl) return;

    const d = new Date();
    d.setDate(d.getDate() + offset);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const months = ['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const dateStr = `${day} de ${months[month]}`;

    if (labelEl) labelEl.textContent = dateStr;
    if (navLabelEl) navLabelEl.textContent = dateStr;

    const facts = (window.f1History || []).filter(f => f.month === month && f.day === day);

    const catColors = {
        'Historia': '#FF8700', 'Campeones': '#FFD700', 'Récords': '#00D2BE',
        'Carreras': '#E10600', 'Pilotos': '#6692FF', 'Técnica': '#64C4FF',
        'Equipos': '#FF8700', 'Reglamento': '#B6BABD', 'Incidentes': '#ff4444',
    };

    if (facts.length === 0) {
        mainEl.innerHTML = `
            <div class="today-empty">
                <div style="font-size:2.5rem;margin-bottom:0.75rem">🏎</div>
                <h3>Sin registros para el ${dateStr}</h3>
                <p>No hay hechos históricos registrados para este día. ¡Todavía puede pasar algo!</p>
            </div>`;
        if (moreEl) moreEl.innerHTML = '';
        return;
    }

    // Main feature: the most significant fact (latest year or most important)
    const main = facts[0];
    const color = catColors[main.category] || '#888';
    mainEl.innerHTML = `
        <div class="today-cat-label" style="color:${color}">${main.category}</div>
        <div class="today-year">${main.year}</div>
        <h2 class="today-title">${main.title}</h2>
        <p class="today-desc">${main.desc}</p>
    `;

    // More facts this day
    if (moreEl) {
        const rest = facts.slice(1);
        if (rest.length > 0) {
            moreEl.innerHTML = `
                <h3 class="today-more-title">También pasó un ${dateStr}…</h3>
                ${rest.map(f => {
                    const c = catColors[f.category] || '#888';
                    return `<div class="card today-more-card">
                        <div class="today-more-header">
                            <span class="today-cat-label" style="color:${c}">${f.category}</span>
                            <span class="today-more-year">${f.year}</span>
                        </div>
                        <strong class="today-more-fact-title">${f.title}</strong>
                        <p class="today-more-desc">${f.desc}</p>
                    </div>`;
                }).join('')}`;
        } else {
            moreEl.innerHTML = '';
        }
    }
}

function initToday() {
    const mainEl = document.getElementById('today-main');
    if (!mainEl) return;
    renderToday(0);
    document.getElementById('prev-day-btn')?.addEventListener('click', () => {
        todayOffset--;
        renderToday(todayOffset);
    });
    document.getElementById('next-day-btn')?.addEventListener('click', () => {
        todayOffset++;
        renderToday(todayOffset);
    });
}

// ─── RENDER: LIVRÉES ──────────────────────────────────────────────────────────
function renderLiveries() {
    const grid = document.getElementById('liveries-grid');
    if (!grid) return;

    grid.innerHTML = (window.constructors || []).map(team => {
        const drivers = window.drivers.filter(d => d.teamSlug === team.slug);
        const c1 = team.color || '#888';
        // Generate a simple livery SVG based on team colors
        const livSvg = generateLiverySVG(team);

        return `<div class="card livery-card" style="border-top: 3px solid ${c1}">
            <div class="livery-team-header">
                <img src="${team.flagImg || ''}" class="detail-flag-img" alt="">
                <div>
                    <h3 class="livery-team-name" style="color:${c1}">${team.name}</h3>
                    <div class="livery-engine">${team.engine} Power Unit · ${team.base}</div>
                </div>
            </div>
            <div class="livery-svg-wrap">
                ${livSvg}
            </div>
            <div class="livery-colors">
                ${getLiveryColors(team).map(col => `
                    <div class="livery-color-chip">
                        <div class="livery-color-swatch" style="background:${col.hex}"></div>
                        <span class="livery-color-name">${col.name}</span>
                    </div>
                `).join('')}
            </div>
            <div class="livery-drivers">
                ${drivers.map(d => `
                    <a href="driver.html?slug=${d.slug}" class="livery-driver-chip">
                        <img src="${d.flagImg}" class="livery-driver-flag" alt="">
                        <span>${d.name}</span>
                        <span class="livery-driver-num" style="color:${c1}">#${d.code}</span>
                    </a>
                `).join('')}
            </div>
        </div>`;
    }).join('');
}

function getLiveryColors(team) {
    const palettes = {
        'mercedes':        [{ hex:'#00D2BE', name:'Petronas Teal' }, { hex:'#000000', name:'Negro' }, { hex:'#FFFFFF', name:'Blanco' }],
        'ferrari':         [{ hex:'#E10600', name:'Rosso Corsa' }, { hex:'#FFCC00', name:'Giallo' }, { hex:'#FFFFFF', name:'Blanco' }],
        'mclaren':         [{ hex:'#FF8700', name:'Papaya Orange' }, { hex:'#000000', name:'Negro' }, { hex:'#0090D0', name:'Azul Zak' }],
        'red-bull-racing': [{ hex:'#3671C6', name:'Azul RBR' }, { hex:'#CC1E4A', name:'Rojo' }, { hex:'#FFC906', name:'Amarillo' }],
        'alpine':          [{ hex:'#0093CC', name:'Azul Alpine' }, { hex:'#FF69B4', name:'Rosa BWT' }, { hex:'#FFFFFF', name:'Blanco' }],
        'racing-bulls':    [{ hex:'#6692FF', name:'Azul claro' }, { hex:'#CC1E4A', name:'Rojo' }, { hex:'#FFFFFF', name:'Blanco' }],
        'haas':            [{ hex:'#B6BABD', name:'Gris' }, { hex:'#E10600', name:'Rojo' }, { hex:'#FFFFFF', name:'Blanco' }],
        'williams':        [{ hex:'#64C4FF', name:'Azul Williams' }, { hex:'#FFFFFF', name:'Blanco' }, { hex:'#E10600', name:'Rojo Martini' }],
        'audi':            [{ hex:'#C0C0C0', name:'Plata Audi' }, { hex:'#000000', name:'Negro' }, { hex:'#BB0A30', name:'Rojo' }],
        'cadillac':        [{ hex:'#00827F', name:'Verde oscuro' }, { hex:'#FFD700', name:'Dorado' }, { hex:'#FFFFFF', name:'Blanco' }],
        'aston-martin':    [{ hex:'#358C75', name:'British Racing Green' }, { hex:'#FFD700', name:'Dorado' }, { hex:'#FFFFFF', name:'Blanco' }],
    };
    return palettes[team.slug] || [{ hex: team.color, name: 'Color principal' }];
}

function generateLiverySVG(team) {
    const c = team.color || '#888';
    const cols = getLiveryColors(team);
    const c2 = cols[1]?.hex || '#222';
    const c3 = cols[2]?.hex || '#fff';
    // Simple F1 car silhouette side view using SVG paths
    return `<svg viewBox="0 0 400 160" class="livery-svg" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <ellipse cx="200" cy="148" rx="140" ry="8" fill="rgba(0,0,0,0.3)"/>
        <!-- Body main -->
        <path d="M 60,90 L 75,70 L 100,60 L 140,52 L 200,50 L 260,52 L 295,58 L 315,68 L 330,80 L 335,90 L 330,98 L 60,98 Z"
              fill="${c}" />
        <!-- Cockpit -->
        <path d="M 155,52 L 165,38 L 185,32 L 210,32 L 230,36 L 240,50 Z"
              fill="${c2}" opacity="0.9"/>
        <!-- Nose -->
        <path d="M 60,90 L 75,70 L 85,78 L 80,90 Z" fill="${c2}"/>
        <!-- Rear wing -->
        <rect x="318" y="60" width="18" height="38" rx="3" fill="${c2}"/>
        <rect x="310" y="56" width="34" height="7" rx="3" fill="${c}"/>
        <!-- Front wing -->
        <rect x="42" y="90" width="30" height="5" rx="2" fill="${c}"/>
        <rect x="36" y="92" width="42" height="4" rx="2" fill="${c2}"/>
        <!-- Side pods -->
        <path d="M 150,90 L 150,108 L 270,108 L 280,98 L 290,90 Z"
              fill="${c2}" opacity="0.7"/>
        <!-- Wheels -->
        <circle cx="105" cy="108" r="22" fill="#1a1a1a" stroke="#333" stroke-width="2"/>
        <circle cx="105" cy="108" r="13" fill="#2a2a2a"/>
        <circle cx="105" cy="108" r="5" fill="${c}"/>
        <circle cx="295" cy="108" r="22" fill="#1a1a1a" stroke="#333" stroke-width="2"/>
        <circle cx="295" cy="108" r="13" fill="#2a2a2a"/>
        <circle cx="295" cy="108" r="5" fill="${c}"/>
        <!-- Halo -->
        <path d="M 165,38 Q 195,28 225,35" fill="none" stroke="${c3}" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
        <!-- Livery accent stripe -->
        <path d="M 100,60 L 310,68" fill="none" stroke="${c3}" stroke-width="3" opacity="0.4"/>
        <!-- Team name -->
        <text x="200" y="82" text-anchor="middle" fill="${c3}" font-size="11"
              font-weight="900" font-family="Arial" opacity="0.85" letter-spacing="2">${team.name.toUpperCase()}</text>
    </svg>`;
}

