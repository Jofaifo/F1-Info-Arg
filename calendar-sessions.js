// ─── SESIONES POR RONDA ───────────────────────────────────────────────────────
// Este archivo contiene los horarios detallados de cada fin de semana.
// Separado de data.js para que el admin no lo pise al exportar.
// Formato de hora: "HH:MM" en hora Argentina (UTC-3).

window.calendarSessions = {
    1: { // Australia
        support: ['f2','f3'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',    label:'Práctica 1',   day:'Vie 6 mar',  time:'03:30 hs' },
            { type:'fp',    label:'Práctica 2',   day:'Vie 6 mar',  time:'07:00 hs' },
            { type:'fp',    label:'Práctica 3',   day:'Sáb 7 mar',  time:'03:30 hs' },
            { type:'qual',  label:'Clasificación',day:'Sáb 7 mar',  time:'07:00 hs' },
            { type:'race',  label:'Carrera',      day:'Dom 8 mar',  time:'05:00 hs' },
        ]
    },
    2: { // China — Sprint
        support: ['f2'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',       label:'Práctica 1',    day:'Vie 14 mar', time:'05:30 hs' },
            { type:'qual',     label:'Clasif. Sprint', day:'Vie 14 mar', time:'09:30 hs' },
            { type:'sprint',   label:'Carrera Sprint', day:'Sáb 15 mar', time:'05:00 hs' },
            { type:'qual',     label:'Clasificación',  day:'Sáb 15 mar', time:'09:00 hs' },
            { type:'race',     label:'Carrera',        day:'Dom 16 mar', time:'07:00 hs' },
        ]
    },
    3: { // Japón
        support: ['f2'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 28 mar', time:'04:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 28 mar', time:'08:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 29 mar', time:'04:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 29 mar', time:'08:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 30 mar', time:'06:00 hs' },
        ]
    },
    4: { // Miami — Sprint
        support: ['f2'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',     label:'Práctica 1',    day:'Vie 2 may',  time:'19:30 hs' },
            { type:'qual',   label:'Clasif. Sprint', day:'Vie 2 may',  time:'23:00 hs' },
            { type:'sprint', label:'Carrera Sprint', day:'Sáb 3 may',  time:'19:00 hs' },
            { type:'qual',   label:'Clasificación',  day:'Sáb 3 may',  time:'23:00 hs' },
            { type:'race',   label:'Carrera',        day:'Dom 4 may',  time:'14:00 hs' },
        ]
    },
    5: { // Canadá — Sprint
        support: ['f2'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',     label:'Práctica 1',    day:'Vie 23 may', time:'13:30 hs' },
            { type:'qual',   label:'Clasif. Sprint', day:'Vie 23 may', time:'17:30 hs' },
            { type:'sprint', label:'Carrera Sprint', day:'Sáb 24 may', time:'13:00 hs' },
            { type:'qual',   label:'Clasificación',  day:'Sáb 24 may', time:'17:00 hs' },
            { type:'race',   label:'Carrera',        day:'Dom 25 may', time:'17:00 hs' },
        ]
    },
    6: { // Mónaco
        support: ['f2','f3','fa'],
        tv: { fox: 'delayed', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Jue 5 jun',  time:'14:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 6 jun',  time:'13:30 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 7 jun',  time:'12:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 7 jun',  time:'16:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 8 jun',  time:'10:00 hs' },
        ]
    },
    7: { // Barcelona-Catalunya
        support: ['f2','f3'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 12 jun', time:'14:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 12 jun', time:'18:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 13 jun', time:'13:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 13 jun', time:'17:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 14 jun', time:'10:00 hs' },
        ]
    },
    8: { // Austria
        support: ['f3','fa'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 26 jun', time:'14:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 26 jun', time:'18:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 27 jun', time:'13:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 27 jun', time:'17:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 28 jun', time:'10:00 hs' },
        ]
    },
    9: { // Gran Bretaña — Sprint
        support: ['f2','f3'],
        tv: { fox: 'delayed', disney: 'live' },
        sessions: [
            { type:'fp',     label:'Práctica 1',    day:'Vie 3 jul',  time:'14:30 hs' },
            { type:'qual',   label:'Clasif. Sprint', day:'Vie 3 jul',  time:'18:30 hs' },
            { type:'sprint', label:'Carrera Sprint', day:'Sáb 4 jul',  time:'12:00 hs' },
            { type:'qual',   label:'Clasificación',  day:'Sáb 4 jul',  time:'16:00 hs' },
            { type:'race',   label:'Carrera',        day:'Dom 5 jul',  time:'11:00 hs' },
        ]
    },
    10: { // Bélgica
        support: ['f2','f3'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 17 jul', time:'14:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 17 jul', time:'18:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 18 jul', time:'13:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 18 jul', time:'17:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 19 jul', time:'10:00 hs' },
        ]
    },
    11: { // Hungría
        support: ['f2','f3','fa'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 24 jul', time:'14:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 24 jul', time:'18:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 25 jul', time:'13:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 25 jul', time:'17:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 26 jul', time:'10:00 hs' },
        ]
    },
    12: { // Países Bajos — Sprint
        support: ['fa'],
        tv: { fox: 'delayed', disney: 'live' },
        sessions: [
            { type:'fp',     label:'Práctica 1',    day:'Vie 21 ago', time:'14:30 hs' },
            { type:'qual',   label:'Clasif. Sprint', day:'Vie 21 ago', time:'18:30 hs' },
            { type:'sprint', label:'Carrera Sprint', day:'Sáb 22 ago', time:'12:00 hs' },
            { type:'qual',   label:'Clasificación',  day:'Sáb 22 ago', time:'16:00 hs' },
            { type:'race',   label:'Carrera',        day:'Dom 23 ago', time:'10:00 hs' },
        ]
    },
    13: { // Italia
        support: ['f2','f3'],
        tv: { fox: 'delayed', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 4 sep',  time:'14:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 4 sep',  time:'18:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 5 sep',  time:'13:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 5 sep',  time:'17:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 6 sep',  time:'10:00 hs' },
        ]
    },
    14: { // España Madrid — debut
        support: ['f2','f3'],
        tv: { fox: 'live', disney: 'live' },
        debut: true,
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 11 sep', time:'14:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 11 sep', time:'18:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 12 sep', time:'13:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 12 sep', time:'17:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 13 sep', time:'10:00 hs' },
        ]
    },
    15: { // Azerbaiyán
        support: ['f2','f3'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 25 sep', time:'09:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 25 sep', time:'13:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 26 sep', time:'09:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 26 sep', time:'13:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 27 sep', time:'08:00 hs' },
        ]
    },
    16: { // Singapur — Sprint
        support: ['f2'],
        tv: { fox: 'delayed', disney: 'live' },
        sessions: [
            { type:'fp',     label:'Práctica 1',    day:'Vie 9 oct',  time:'10:30 hs' },
            { type:'qual',   label:'Clasif. Sprint', day:'Vie 9 oct',  time:'14:30 hs' },
            { type:'sprint', label:'Carrera Sprint', day:'Sáb 10 oct', time:'10:00 hs' },
            { type:'qual',   label:'Clasificación',  day:'Sáb 10 oct', time:'14:00 hs' },
            { type:'race',   label:'Carrera',        day:'Dom 11 oct', time:'09:00 hs' },
        ]
    },
    17: { // EE.UU.
        support: ['f2','f3'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 23 oct', time:'16:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 23 oct', time:'20:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 24 oct', time:'16:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 24 oct', time:'20:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 25 oct', time:'17:00 hs' },
        ]
    },
    18: { // México
        support: ['f2'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 30 oct', time:'16:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 30 oct', time:'20:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 31 oct', time:'16:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 31 oct', time:'20:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 1 nov',  time:'17:00 hs' },
        ]
    },
    19: { // Brasil
        support: ['f2','f3'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 6 nov',  time:'14:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 6 nov',  time:'18:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 7 nov',  time:'13:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 7 nov',  time:'17:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 8 nov',  time:'14:00 hs' },
        ]
    },
    20: { // Las Vegas — madrugada
        support: [],
        tv: { fox: 'live', disney: 'live' },
        lateNight: true,
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Jue 19 nov', time:'07:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 20 nov', time:'04:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 21 nov', time:'04:00 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 21 nov', time:'07:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 22 nov', time:'01:00 hs' },
        ]
    },
    21: { // Qatar
        support: ['f2'],
        tv: { fox: 'delayed', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 27 nov', time:'11:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 27 nov', time:'15:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 28 nov', time:'11:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 28 nov', time:'15:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 29 nov', time:'13:00 hs' },
        ]
    },
    22: { // Abu Dhabi
        support: ['f2','f3'],
        tv: { fox: 'live', disney: 'live' },
        sessions: [
            { type:'fp',   label:'Práctica 1',   day:'Vie 4 dic',  time:'11:30 hs' },
            { type:'fp',   label:'Práctica 2',   day:'Vie 4 dic',  time:'15:00 hs' },
            { type:'fp',   label:'Práctica 3',   day:'Sáb 5 dic',  time:'12:30 hs' },
            { type:'qual', label:'Clasificación',day:'Sáb 5 dic',  time:'16:00 hs' },
            { type:'race', label:'Carrera',      day:'Dom 6 dic',  time:'10:00 hs' },
        ]
    },
};
