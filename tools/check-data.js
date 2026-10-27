#!/usr/bin/env node
// Revisa que data.js y calendar-sessions.js sean coherentes entre sí.
// Uso:  node tools/check-data.js        (sale con código 1 si encuentra errores)
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

global.window = {};
require(path.join(root, 'data.js'));
require(path.join(root, 'calendar-sessions.js'));
const w = window;

const RACE_PTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const SPRINT_PTS = [8, 7, 6, 5, 4, 3, 2, 1];
const errors = [];
const err = msg => errors.push(msg);
const finish = () => {
    if (errors.length) {
        console.log(`✘ ${errors.length} problema(s) en los datos:\n`);
        errors.forEach(e => console.log('  - ' + e));
        process.exit(1);
    }
};

// ── Pilotos ────────────────────────────────────────────────────────────────
// raceResults / sprintResults: una posición por ronda; null = no participó (suplencia) o no hubo sprint
const nRaces = w.races.length;
const sorted = w.getSortedDrivers();
sorted.forEach((d, i) => { if (d.position !== i + 1) err(`${d.code}: position guardada ${d.position}, pero por puntos y desempate es ${i + 1}`); });

for (const d of w.drivers) {
    if (!Array.isArray(d.raceResults) || d.raceResults.length !== nRaces) { err(`${d.code}: raceResults debe tener ${nRaces} valores`); continue; }
    if (!Array.isArray(d.sprintResults) || d.sprintResults.length !== nRaces) { err(`${d.code}: sprintResults debe tener ${nRaces} valores (null si no hubo sprint)`); continue; }
    let pts = 0, wins = 0, podiums = 0, poles = 0, fastest = 0;
    d.raceResults.forEach((p, i) => {
        if (p == null) return;                                   // no participó ese fin de semana
        if (!Number.isInteger(p) || p < 1 || p > 24) { err(`${d.code} ronda ${w.races[i].round}: posición de carrera inválida (${p})`); return; }
        if (p <= 10) pts += RACE_PTS[p - 1];
        if (p === 1) wins++;
        if (p <= 3) podiums++;
    });
    d.sprintResults.forEach((p, i) => {
        if (p == null) return;
        if (!w.races[i].sprint) err(`${d.code} ronda ${w.races[i].round}: tiene sprint cargado pero la ronda no tuvo sprint`);
        if (p <= 8) pts += SPRINT_PTS[p - 1];
    });
    w.races.forEach(r => {
        if (r.polePosition === d.name) poles++;
        if (r.fastestLap === d.name) fastest++;
    });
    if (pts !== d.points) err(`${d.code}: points=${d.points} pero carreras+sprints suman ${pts}`);
    if (wins !== d.wins) err(`${d.code}: wins=${d.wins} pero según las carreras son ${wins}`);
    if (podiums !== d.podiums) err(`${d.code}: podiums=${d.podiums} pero según las carreras son ${podiums}`);
    if (poles !== d.poles) err(`${d.code}: poles=${d.poles} pero races[].polePosition lo nombra ${poles} veces (solo poles de GP)`);
    if (fastest !== d.fastestLaps) err(`${d.code}: fastestLaps=${d.fastestLaps} pero races[].fastestLap lo nombra ${fastest} veces`);
    if (d.teamByRound) for (const r of Object.keys(d.teamByRound)) {
        if (!w.constructors.some(t => t.slug === d.teamByRound[r])) err(`${d.code}: teamByRound[${r}] apunta a un equipo que no existe`);
    }
}

// Si falta la estructura básica no tiene sentido seguir comparando
if (errors.some(e => e.includes('debe tener'))) { finish(); }

// Cada ronda: las posiciones cargadas son 1..N sin repetir y N es razonable (20 a 24 pilotos)
w.races.forEach((r, i) => {
    const check = (label, values) => {
        const got = values.filter(p => p != null).sort((a, b) => a - b);
        if (got.length < 20 || got.length > 24 || got.some((p, k) => p !== k + 1))
            err(`Ronda ${r.round}: las posiciones de ${label} no son 1..N sin repetir (hay ${got.length} cargadas)`);
    };
    check('carrera', w.drivers.map(d => d.raceResults[i]));
    if (r.sprint) check('sprint', w.drivers.map(d => d.sprintResults[i]));
    else if (w.drivers.some(d => d.sprintResults[i] != null)) err(`Ronda ${r.round}: hay sprint cargado pero races[] no lo marca como sprint`);

    const winner = w.drivers.find(d => d.raceResults[i] === 1);
    if (winner && winner.name !== r.winner) err(`Ronda ${r.round}: races[].winner="${r.winner}" pero según los resultados ganó ${winner.name}`);
    const cal = w.calendar.find(c => c.round === r.round);
    if (!cal) err(`Ronda ${r.round}: está en races[] pero no en calendar[]`);
    else {
        if (cal.winner !== r.winner) err(`Ronda ${r.round}: calendar.winner="${cal.winner}" distinto de races[].winner="${r.winner}"`);
        if (!!cal.sprint !== !!r.sprint) err(`Ronda ${r.round}: sprint distinto entre races[] y calendar[]`);
        if ((cal.savedStatus || cal.status) !== 'done') err(`Ronda ${r.round}: tiene resultados pero el calendario no la marca como 'done'`);
    }
    if (r.fastestLap != null && !w.drivers.some(d => d.name === r.fastestLap)) err(`Ronda ${r.round}: vuelta rápida "${r.fastestLap}" no es un piloto de la lista`);
    if (!w.drivers.some(d => d.name === r.polePosition)) err(`Ronda ${r.round}: pole "${r.polePosition}" no es un piloto de la lista`);
});
w.calendar.forEach(c => {
    if ((c.savedStatus || c.status) === 'done' && !w.races.some(r => r.round === c.round)) err(`Ronda ${c.round}: figura 'done' pero no tiene resultados en races[]`);
});

// ── Constructores: suman los puntos de los pilotos con el equipo con el que corrieron cada ronda ──
const teamsSorted = [...w.constructors].sort((a, b) => b.points - a.points);
for (const t of w.constructors) {
    const expected = w.getTeamTotalPoints(t.slug);
    if (expected !== t.points) err(`${t.slug}: points=${t.points} pero sus pilotos suman ${expected}`);
    const pos = teamsSorted.findIndex(x => x.slug === t.slug) + 1;
    if (t.position !== pos && teamsSorted.filter(x => x.points === t.points).length === 1) err(`${t.slug}: position=${t.position}, por puntos corresponde ${pos}`);
}
w.drivers.forEach(d => { if (!w.constructors.some(t => t.slug === d.teamSlug)) err(`${d.code}: teamSlug "${d.teamSlug}" no existe`); });

// ── Calendario y sesiones (solo las rondas que todavía no se corrieron) ─────────────
const WD = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MON = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
const dates = w.calendar.map(c => c.date);
if (JSON.stringify(dates) !== JSON.stringify([...dates].sort())) err('calendar[] no está ordenado por fecha');
w.calendar.forEach((c, i) => { if (c.round !== i + 1) err(`calendar[${i}]: la ronda es ${c.round}, se esperaba ${i + 1} (rondas seguidas)`); });
for (const c of w.calendar) {
    if ((c.savedStatus || c.status) === 'done') continue;       // ya corrida: el horario original no importa
    const s = w.calendarSessions[c.round];
    if (!s) { err(`Ronda ${c.round}: no tiene sesiones en calendar-sessions.js`); continue; }
    for (const x of s.sessions) {
        const m = x.day.match(/^(\S+)\s+(\d+)\s+(\w+)/);
        if (!m) { err(`Ronda ${c.round}: formato de día inválido "${x.day}"`); continue; }
        const real = WD[new Date(Date.UTC(2026, MON[m[3]], +m[2], 12)).getUTCDay()];
        if (real !== m[1]) err(`Ronda ${c.round} ${x.label}: "${x.day}" — ese día es ${real} en 2026`);
    }
    const race = s.sessions.find(x => x.type === 'race');
    const rm = race.day.match(/(\d+)\s+(\w+)/);
    const raceDate = new Date(Date.UTC(2026, MON[rm[2]], +rm[1], 12)).toISOString().slice(0, 10);
    if (raceDate !== c.date) err(`Ronda ${c.round}: calendar.date=${c.date} pero la carrera en sesiones es ${raceDate}`);
    if (c.time && c.time !== race.time.replace(' hs', '')) err(`Ronda ${c.round}: calendar.time=${c.time} distinto de la carrera en sesiones (${race.time})`);
}

// ── Imágenes referenciadas ─────────────────────────────────────────────────
const exists = p => p && fs.existsSync(path.join(root, p));
w.drivers.forEach(d => { ['photo', 'flagImg'].forEach(k => { if (!exists(d[k])) err(`${d.code}: falta la imagen ${k} (${d[k]})`); }); });
w.constructors.forEach(t => { ['image', 'flagImg', 'originFlag', 'baseFlag'].forEach(k => { if (t[k] && !exists(t[k])) err(`${t.slug}: falta la imagen ${k} (${t[k]})`); }); });
w.circuits.forEach(c => { if (c.flagImg && !exists(c.flagImg)) err(`${c.slug}: falta la bandera ${c.flagImg}`); });
w.calendar.forEach(c => { if (c.flagImg && !exists(c.flagImg)) err(`Ronda ${c.round}: falta la bandera ${c.flagImg}`); });

finish();
console.log(`✔ Datos coherentes: ${w.drivers.length} pilotos, ${w.constructors.length} equipos, ${nRaces} carreras cargadas, ${w.calendar.length} rondas en el calendario.`);
