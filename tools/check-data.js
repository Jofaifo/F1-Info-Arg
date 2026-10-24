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

// ── Pilotos ────────────────────────────────────────────────────────────────
const nRaces = w.races.length;
const sorted = w.getSortedDrivers();
sorted.forEach((d, i) => { if (d.position !== i + 1) err(`${d.code}: position guardada ${d.position}, pero por puntos y desempate es ${i + 1}`); });

for (const d of w.drivers) {
    if (!Array.isArray(d.raceResults) || d.raceResults.length !== nRaces) { err(`${d.code}: raceResults debe tener ${nRaces} valores`); continue; }
    if (!Array.isArray(d.sprintResults) || d.sprintResults.length !== nRaces) { err(`${d.code}: sprintResults debe tener ${nRaces} valores (null si no hubo sprint)`); continue; }
    let pts = 0, wins = 0, podiums = 0;
    d.raceResults.forEach((p, i) => {
        if (p == null || p < 1 || p > 22) { err(`${d.code} ronda ${i + 1}: posición de carrera inválida (${p})`); return; }
        if (p <= 10) pts += RACE_PTS[p - 1];
        if (p === 1) wins++;
        if (p <= 3) podiums++;
    });
    d.sprintResults.forEach((p, i) => {
        const hasSprint = !!w.races[i].sprint;
        if (hasSprint && p == null) err(`${d.code} ronda ${i + 1}: falta la posición del sprint`);
        if (!hasSprint && p != null) err(`${d.code} ronda ${i + 1}: tiene sprint cargado pero la ronda no tuvo sprint`);
        if (p != null && p <= 8) pts += SPRINT_PTS[p - 1];
    });
    if (pts !== d.points) err(`${d.code}: points=${d.points} pero carreras+sprints suman ${pts}`);
    if (wins !== d.wins) err(`${d.code}: wins=${d.wins} pero según las carreras son ${wins}`);
    if (podiums !== d.podiums) err(`${d.code}: podiums=${d.podiums} pero según las carreras son ${podiums}`);
}

// Si falta la estructura básica no tiene sentido seguir comparando
if (errors.some(e => e.includes('debe tener'))) {
    console.log(`✘ ${errors.length} problema(s) en los datos:\n`);
    errors.forEach(e => console.log('  - ' + e));
    process.exit(1);
}

// Cada ronda: las 22 posiciones aparecen una sola vez (carrera y sprint)
w.races.forEach((r, i) => {
    const seen = w.drivers.map(d => d.raceResults[i]).sort((a, b) => a - b);
    if (seen.some((p, k) => p !== k + 1)) err(`Ronda ${r.round}: las posiciones de carrera no son 1..${w.drivers.length} sin repetir`);
    if (r.sprint) {
        const s = w.drivers.map(d => d.sprintResults[i]).sort((a, b) => a - b);
        if (s.some((p, k) => p !== k + 1)) err(`Ronda ${r.round}: las posiciones de sprint no son 1..${w.drivers.length} sin repetir`);
    }
    const winner = w.drivers.find(d => d.raceResults[i] === 1);
    if (winner && winner.name !== r.winner) err(`Ronda ${r.round}: races[].winner="${r.winner}" pero según los resultados ganó ${winner.name}`);
    const cal = w.calendar.find(c => c.round === r.round);
    if (cal && cal.winner && cal.winner !== r.winner) err(`Ronda ${r.round}: calendar.winner="${cal.winner}" distinto de races[].winner="${r.winner}"`);
    if (cal && !!cal.sprint !== !!r.sprint) err(`Ronda ${r.round}: sprint distinto entre races[] y calendar[]`);
    [r.polePosition, r.fastestLap].forEach(n => { if (!w.drivers.some(d => d.name === n)) err(`Ronda ${r.round}: "${n}" no es un piloto de la lista`); });
});

// ── Constructores ──────────────────────────────────────────────────────────
const bySum = {};
w.drivers.forEach(d => { bySum[d.teamSlug] = (bySum[d.teamSlug] || 0) + d.points; });
const teamsSorted = [...w.constructors].sort((a, b) => b.points - a.points);
for (const t of w.constructors) {
    if ((bySum[t.slug] || 0) !== t.points) err(`${t.slug}: points=${t.points} pero sus pilotos suman ${bySum[t.slug] || 0}`);
    const expected = teamsSorted.findIndex(x => x.slug === t.slug) + 1;
    if (t.position !== expected && teamsSorted.filter(x => x.points === t.points).length === 1) err(`${t.slug}: position=${t.position}, por puntos corresponde ${expected}`);
}
w.drivers.forEach(d => { if (!w.constructors.some(t => t.slug === d.teamSlug)) err(`${d.code}: teamSlug "${d.teamSlug}" no existe`); });

// ── Calendario y sesiones ──────────────────────────────────────────────────
const WD = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MON = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
const dates = w.calendar.map(c => c.date);
if (JSON.stringify(dates) !== JSON.stringify([...dates].sort())) err('calendar[] no está ordenado por fecha');
for (const c of w.calendar) {
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

// ── Resultado ──────────────────────────────────────────────────────────────
if (errors.length) {
    console.log(`✘ ${errors.length} problema(s) en los datos:\n`);
    errors.forEach(e => console.log('  - ' + e));
    process.exit(1);
}
console.log(`✔ Datos coherentes: ${w.drivers.length} pilotos, ${w.constructors.length} equipos, ${nRaces} carreras cargadas, ${w.calendar.length} rondas en el calendario.`);
