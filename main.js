// ─── UTILIDADES ──────────────────────────────────────────────────────────────
function getTeamImage(teamSlug) {
    const team = window.findConstructorBySlug(teamSlug);
    return team && team.image ? team.image : null;
}

function getTeamHexColor(teamSlug) {
    return window.teamColors[teamSlug] || '#888';
}

function searcher(query) {
    if (!query || typeof query !== 'string') return [];
    const q = query.trim().toLowerCase();
    const driverMatches = window.drivers
        .filter(d => d.name.toLowerCase().includes(q) || d.team.toLowerCase().includes(q))
        .map(d => ({ ...d, type: 'driver' }));
    const constructorMatches = window.constructors
        .filter(t => t.name.toLowerCase().includes(q))
        .map(t => ({ ...t, type: 'constructor' }));
    return [...driverMatches, ...constructorMatches];
}

// ─── CHIP DE EQUIPO ──────────────────────────────────────────────────────────
function createTeamCell(teamName, code, colorClass, teamSlug) {
    const span = document.createElement('span');
    span.className = `team-chip ${colorClass}`.trim();

    const color = getTeamHexColor(teamSlug);
    span.style.borderLeft = `3px solid ${color}`;

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
    logo.style.background = color;
    logo.style.color = isLight(color) ? '#111' : '#fff';

    const text = document.createElement('span');
    text.textContent = teamName;

    span.appendChild(logo);
    span.appendChild(text);
    return span;
}

function isLight(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

// ─── TARJETA DE ENTIDAD ───────────────────────────────────────────────────────
function createEntityCard(entity, type) {
    const wrapper = document.createElement('article');
    wrapper.className = 'entity-card';

    const color = getTeamHexColor(type === 'driver' ? entity.teamSlug : entity.slug);
    wrapper.style.borderTop = `3px solid ${color}`;

    const imageSrc = type === 'constructor' ? entity.image : getTeamImage(entity.teamSlug);
    if (imageSrc) {
        const img = document.createElement('img');
        img.className = 'entity-logo';
        img.src = imageSrc;
        img.alt = `${entity.name} logo`;
        wrapper.appendChild(img);
    }

    const header = document.createElement('div');
    header.className = 'entity-card-header';

    const flagSpan = document.createElement('span');
    flagSpan.className = 'entity-flag';
    flagSpan.textContent = entity.flag || '';

    const badge = document.createElement('span');
    badge.className = `logo-badge ${entity.colorClass}`.trim();
    badge.textContent = entity.code;
    badge.style.background = color;
    badge.style.color = isLight(color) ? '#111' : '#fff';

    header.appendChild(flagSpan);
    header.appendChild(badge);

    const title = document.createElement('h3');
    title.textContent = entity.name;

    const meta = document.createElement('p');
    meta.className = 'entity-meta';
    meta.textContent = type === 'driver'
        ? `${entity.team} • ${entity.points} pts`
        : `${entity.points} pts`;

    const info = document.createElement('p');
    info.className = 'entity-description';
    info.textContent = type === 'driver' ? entity.bio : entity.description;

    const link = document.createElement('a');
    link.className = 'detail-link';
    link.href = type === 'driver'
        ? `driver.html?slug=${entity.slug}`
        : `team.html?slug=${entity.slug}`;
    link.textContent = 'Ver mini página →';

    wrapper.append(header, title, meta, info, link);
    return wrapper;
}

// ─── TABLA DE PILOTOS ─────────────────────────────────────────────────────────
function renderDriverStandings() {
    const tbody = document.querySelector('#driver-standings tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const leader = window.drivers[0];

    window.drivers.forEach(driver => {
        const tr = document.createElement('tr');
        const color = getTeamHexColor(driver.teamSlug);
        tr.style.borderLeft = `3px solid ${color}`;

        const posCell = document.createElement('td');
        posCell.className = 'position';
        posCell.textContent = driver.position;

        const nameCell = document.createElement('td');
        nameCell.className = 'driver-name-cell';
        nameCell.innerHTML = `<span class="driver-flag">${driver.flag || ''}</span> ${driver.name}`;

        const teamCell = document.createElement('td');
        teamCell.appendChild(createTeamCell(driver.team, driver.code, driver.colorClass, driver.teamSlug));

        const ptsCell = document.createElement('td');
        ptsCell.textContent = driver.points;
        ptsCell.className = 'strong-text';

        const gapCell = document.createElement('td');
        gapCell.className = 'gap-cell';
        const gap = driver.position === 1 ? '—' : `−${leader.points - driver.points}`;
        gapCell.textContent = gap;

        const detailCell = document.createElement('td');
        detailCell.innerHTML = `<a class="detail-link" href="driver.html?slug=${driver.slug}">Ver →</a>`;

        tr.append(posCell, nameCell, teamCell, ptsCell, gapCell, detailCell);
        tbody.appendChild(tr);
    });
}

// ─── TABLA DE ESCUDERÍAS ──────────────────────────────────────────────────────
function renderConstructorStandings() {
    const tbody = document.querySelector('#constructor-standings tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const leader = window.constructors[0];

    window.constructors.forEach(team => {
        const tr = document.createElement('tr');
        const color = getTeamHexColor(team.slug);
        tr.style.borderLeft = `3px solid ${color}`;

        const posCell = document.createElement('td');
        posCell.className = 'position';
        posCell.textContent = team.position;

        const nameCell = document.createElement('td');
        nameCell.appendChild(createTeamCell(team.name, team.code, team.colorClass, team.slug));

        const ptsCell = document.createElement('td');
        ptsCell.textContent = team.points;
        ptsCell.className = 'strong-text';

        const gapCell = document.createElement('td');
        gapCell.className = 'gap-cell';
        const gap = team.position === 1 ? '—' : `−${leader.points - team.points}`;
        gapCell.textContent = gap;

        // Pilotos con sus puntos individuales
        const driversCell = document.createElement('td');
        const driverPts = team.topDrivers.map(name => {
            const d = window.drivers.find(x => x.name === name);
            return d ? `<span class="driver-pts-mini">${d.name.split(' ').pop()} <strong>${d.points}</strong></span>` : '';
        }).join('');
        driversCell.innerHTML = `<div class="driver-pts-list">${driverPts}</div>`;

        const detailCell = document.createElement('td');
        detailCell.innerHTML = `<a class="detail-link" href="team.html?slug=${team.slug}">Ver →</a>`;

        tr.append(posCell, nameCell, ptsCell, gapCell, driversCell, detailCell);
        tbody.appendChild(tr);
    });
}

// ─── TARJETAS GENÉRICAS ───────────────────────────────────────────────────────
function renderCards(containerId, list, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    list.forEach(item => container.appendChild(createEntityCard(item, type)));
}

// ─── BÚSQUEDA ─────────────────────────────────────────────────────────────────
function renderSearchResults(results) {
    const resultsList = document.getElementById('search-results');
    if (!resultsList) return;
    resultsList.innerHTML = '';

    if (!results.length) {
        const li = document.createElement('li');
        li.textContent = 'Escribe un nombre de piloto o escudería para buscar.';
        li.className = 'empty-message';
        resultsList.appendChild(li);
        return;
    }

    results.forEach(entry => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        const label = entry.type === 'driver' ? 'Piloto' : 'Escudería';
        const link = entry.type === 'driver'
            ? `driver.html?slug=${entry.slug}`
            : `team.html?slug=${entry.slug}`;
        const imageSrc = entry.type === 'driver' ? getTeamImage(entry.teamSlug) : entry.image;
        const color = getTeamHexColor(entry.type === 'driver' ? entry.teamSlug : entry.slug);

        li.style.borderLeft = `3px solid ${color}`;
        li.innerHTML = `
            ${imageSrc ? `<img class="search-result-logo" src="${imageSrc}" alt="${entry.name} logo">` : ''}
            <div class="search-result-content">
                <strong>${entry.flag || ''} ${entry.name}</strong>
                <span class="result-type">${label}</span>
                <span class="result-points">${entry.points} pts</span>
            </div>
            <a class="detail-link-inline" href="${link}">Ver →</a>
        `;
        resultsList.appendChild(li);
    });
}

// ─── GRÁFICO SVG DE PUNTOS ACUMULADOS ────────────────────────────────────────
function renderPointsChart(driver) {
    const cumPts = window.getCumulativePoints(driver);
    const racesDone = window.races || [];
    if (!cumPts.length) return '';

    const W = 480, H = 180, PAD = { top: 16, right: 24, bottom: 32, left: 40 };
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const maxPts = Math.max(...cumPts, 1);
    const n = cumPts.length;

    const xScale = i => PAD.left + (i / (n - 1 || 1)) * innerW;
    const yScale = v => PAD.top + innerH - (v / maxPts) * innerH;

    const color = getTeamHexColor(driver.teamSlug);

    const points = cumPts.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ');
    const areaPoints = [
        `${xScale(0)},${PAD.top + innerH}`,
        ...cumPts.map((v, i) => `${xScale(i)},${yScale(v)}`),
        `${xScale(n - 1)},${PAD.top + innerH}`
    ].join(' ');

    const xLabels = racesDone.map((r, i) =>
        `<text x="${xScale(i)}" y="${H - 6}" text-anchor="middle" fill="#888" font-size="10">${r.short}</text>`
    ).join('');

    const yGridLines = [0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = PAD.top + innerH - t * innerH;
        const val = Math.round(t * maxPts);
        return `
            <line x1="${PAD.left}" x2="${PAD.left + innerW}" y1="${y}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            <text x="${PAD.left - 6}" y="${y + 4}" text-anchor="end" fill="#666" font-size="10">${val}</text>
        `;
    }).join('');

    const dots = cumPts.map((v, i) =>
        `<circle cx="${xScale(i)}" cy="${yScale(v)}" r="4" fill="${color}" stroke="#111" stroke-width="2">
            <title>${racesDone[i]?.name || `R${i + 1}`}: ${v} pts</title>
        </circle>`
    ).join('');

    return `
        <div class="chart-wrapper">
            <h4 class="chart-title">Evolución de puntos</h4>
            <svg viewBox="0 0 ${W} ${H}" class="points-chart" role="img" aria-label="Evolución de puntos">
                <defs>
                    <linearGradient id="area-grad-${driver.slug}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
                        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
                    </linearGradient>
                </defs>
                ${yGridLines}
                <polygon points="${areaPoints}" fill="url(#area-grad-${driver.slug})"/>
                <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
                ${dots}
                ${xLabels}
            </svg>
        </div>
    `;
}

// ─── TABLA DE RESULTADOS POR CARRERA ────────────────────────────────────────
function renderRaceResultsTable(driver) {
    const racesDone = window.races || [];
    if (!racesDone.length || !driver.raceResults) return '';

    const medalPos = { 1: '🥇', 2: '🥈', 3: '🥉' };

    const rows = racesDone.map((race, i) => {
        const pos = driver.raceResults[i];
        const posLabel = pos === null ? '<span class="dnf">DNF</span>'
            : pos <= 3 ? `${medalPos[pos]} ${pos}º`
            : `${pos}º`;
        const pts = pos !== null && pos >= 1 && pos <= 10
            ? [25, 18, 15, 12, 10, 8, 6, 4, 2, 1][pos - 1]
            : 0;
        const rowClass = pos === 1 ? 'row-win' : pos !== null && pos <= 3 ? 'row-podium' : '';
        return `
            <tr class="${rowClass}">
                <td>${race.flag} ${race.name}${race.sprint ? ' <span class="sprint-tag">S</span>' : ''}</td>
                <td class="pos-cell">${posLabel}</td>
                <td class="pts-mini">${pts > 0 ? '+' + pts : '—'}</td>
            </tr>
        `;
    }).join('');

    return `
        <div class="race-results-table">
            <h4>Resultados por carrera</h4>
            <table class="results-mini-table">
                <thead>
                    <tr><th>Carrera</th><th>Pos.</th><th>Pts.</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

// ─── BARRA DE PUNTOS DE EQUIPO ────────────────────────────────────────────────
function renderTeamDriversBreakdown(team) {
    const drivers = team.topDrivers.map(name => window.drivers.find(d => d.name === name)).filter(Boolean);
    if (!drivers.length) return '';

    const total = team.points || 1;
    const color = getTeamHexColor(team.slug);

    const bars = drivers.map(d => {
        const pct = total > 0 ? Math.round((d.points / total) * 100) : 0;
        return `
            <div class="driver-bar-row">
                <span class="driver-bar-name">${d.flag || ''} ${d.name}</span>
                <div class="driver-bar-track">
                    <div class="driver-bar-fill" style="width:${pct}%; background:${color}"></div>
                </div>
                <span class="driver-bar-pts"><strong>${d.points}</strong> pts</span>
            </div>
        `;
    }).join('');

    return `
        <div class="team-breakdown">
            <h4>Aporte por piloto</h4>
            ${bars}
        </div>
    `;
}

// ─── DETALLE DE PILOTO ────────────────────────────────────────────────────────
function getSlugFromQuery() {
    return new URLSearchParams(window.location.search).get('slug');
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

    title.textContent = `${driver.flag || ''} ${driver.name}`;
    subtitle.textContent = `${driver.team} • ${driver.points} puntos • P${driver.position} del campeonato`;

    const team = window.findConstructorBySlug(driver.teamSlug);
    const teamImage = team && team.image
        ? `<img class="detail-image" src="${team.image}" alt="${team.name} logo">`
        : '';
    const color = getTeamHexColor(driver.teamSlug);

    const leader = window.drivers[0];
    const gap = driver.position === 1 ? 'Líder del campeonato' : `−${leader.points - driver.points} pts del líder`;

    detail.innerHTML = `
        <div class="detail-grid">
            <div class="detail-card-main">
                ${teamImage}
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
                        <span class="stat-pill-num">${driver.poles}</span>
                        <span class="stat-pill-label">Poles</span>
                    </div>
                    <div class="driver-stat-pill" style="border-color:${color}">
                        <span class="stat-pill-num">${driver.fastestLaps}</span>
                        <span class="stat-pill-label">V. Rápidas</span>
                    </div>
                </div>
                <p class="driver-bio">${driver.bio}</p>
                <ul class="detail-list">
                    <li><strong>Posición:</strong> ${driver.position}º</li>
                    <li><strong>Puntos:</strong> ${driver.points} <span class="muted-text">(${gap})</span></li>
                    <li><strong>Nacionalidad:</strong> ${driver.nationality}</li>
                    <li><strong>Edad:</strong> ${driver.age} años</li>
                </ul>
                ${renderRaceResultsTable(driver)}
            </div>
            <div class="detail-aside">
                ${renderPointsChart(driver)}
                <h3 style="margin-top:1.5rem">Equipo</h3>
                <a class="team-link" href="team.html?slug=${driver.teamSlug}" style="color:${color}">${driver.team}</a>
                <p>Abre la mini página del equipo para ver detalles, base y más.</p>
            </div>
        </div>
    `;
}

// ─── DETALLE DE ESCUDERÍA ─────────────────────────────────────────────────────
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

    title.textContent = `${team.flag || ''} ${team.name}`;
    subtitle.textContent = `${team.points} puntos • P${team.position} del campeonato constructores`;

    const teamImage = team.image ? `<img class="detail-image" src="${team.image}" alt="${team.name} logo">` : '';
    const color = getTeamHexColor(team.slug);

    const leader = window.constructors[0];
    const gap = team.position === 1 ? 'Líder' : `−${leader.points - team.points} pts del líder`;

    const driverLinks = team.topDrivers.map(name => {
        const d = window.drivers.find(x => x.name === name);
        return d
            ? `<a class="team-link driver-link-row" href="driver.html?slug=${d.slug}" style="color:${color}">
                ${d.flag || ''} ${d.name} <span class="muted-text">${d.points} pts</span>
               </a>`
            : `<span>${name}</span>`;
    }).join('');

    detail.innerHTML = `
        <div class="detail-grid">
            <div class="detail-card-main">
                ${teamImage}
                <ul class="detail-list">
                    <li><strong>Posición:</strong> ${team.position}º <span class="muted-text">(${gap})</span></li>
                    <li><strong>Puntos:</strong> ${team.points}</li>
                    <li><strong>Base:</strong> ${team.base}</li>
                    <li><strong>Team Principal:</strong> ${team.teamPrincipal}</li>
                    <li><strong>Motor:</strong> ${team.engine}</li>
                    <li><strong>Campeonatos:</strong> ${team.championships}</li>
                </ul>
                <p class="driver-bio" style="margin-top:1rem">${team.description}</p>
                ${renderTeamDriversBreakdown(team)}
            </div>
            <div class="detail-aside">
                <h3>Pilotos</h3>
                <div class="driver-links-list">${driverLinks}</div>
                <p style="margin-top:1rem">Abre cada mini página para ver el rendimiento individual.</p>
            </div>
        </div>
    `;
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function renderCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;

    const nextRace = (window.calendar || []).find(r => r.status === 'next' || r.status === 'upcoming');
    if (!nextRace) { el.style.display = 'none'; return; }

    const raceDate = new Date(`${nextRace.date}T${nextRace.time ? nextRace.time.replace(':', ':') + ':00' : '12:00:00'}-03:00`);

    function tick() {
        const now = new Date();
        const diff = raceDate - now;
        if (diff <= 0) {
            el.innerHTML = `<span class="countdown-live">¡EN VIVO AHORA!</span>`;
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        el.innerHTML = `
            <div class="countdown-label">Próxima: ${nextRace.flag} ${nextRace.name}</div>
            <div class="countdown-time">
                <span class="cd-unit"><strong>${d}</strong><small>días</small></span>
                <span class="cd-sep">:</span>
                <span class="cd-unit"><strong>${String(h).padStart(2,'0')}</strong><small>hs</small></span>
                <span class="cd-sep">:</span>
                <span class="cd-unit"><strong>${String(m).padStart(2,'0')}</strong><small>min</small></span>
                <span class="cd-sep">:</span>
                <span class="cd-unit"><strong>${String(s).padStart(2,'0')}</strong><small>seg</small></span>
            </div>
            ${nextRace.time ? `<div class="countdown-hour">🇦🇷 ${nextRace.time} hs Argentina • Fox Sports / Disney+</div>` : ''}
        `;
    }
    tick();
    setInterval(tick, 1000);
}

// ─── LÍDER DEL CAMPEONATO EN HOME ─────────────────────────────────────────────
function renderChampionshipLeaders() {
    const driverLeaderEl = document.getElementById('driver-leader');
    const teamLeaderEl = document.getElementById('team-leader');

    if (driverLeaderEl && window.drivers.length) {
        const d = window.drivers[0];
        const color = getTeamHexColor(d.teamSlug);
        driverLeaderEl.innerHTML = `
            <div class="leader-label">Líder de pilotos</div>
            <div class="leader-name" style="color:${color}">${d.flag || ''} ${d.name}</div>
            <div class="leader-detail">${d.team} · <strong>${d.points} pts</strong></div>
            <a class="detail-link" href="driver.html?slug=${d.slug}">Ver →</a>
        `;
    }

    if (teamLeaderEl && window.constructors.length) {
        const t = window.constructors[0];
        const color = getTeamHexColor(t.slug);
        teamLeaderEl.innerHTML = `
            <div class="leader-label">Líder de constructores</div>
            <div class="leader-name" style="color:${color}">${t.flag || ''} ${t.name}</div>
            <div class="leader-detail"><strong>${t.points} pts</strong></div>
            <a class="detail-link" href="team.html?slug=${t.slug}">Ver →</a>
        `;
    }
}

// ─── BUSCADOR ─────────────────────────────────────────────────────────────────
function initSearcher() {
    const input = document.getElementById('search-input');
    if (!input) return;

    input.addEventListener('input', () => {
        const results = searcher(input.value);
        renderSearchResults(results);
    });

    renderSearchResults([]);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function initPage() {
    const body = document.body;

    if (body.classList.contains('page-home')) {
        renderChampionshipLeaders();
        renderCountdown();
        initSearcher();
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

    if (body.classList.contains('page-calendar')) {
        initSearcher();
        return;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { searcher, renderSearchResults, renderDriverStandings, renderConstructorStandings };
}
