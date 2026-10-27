#!/usr/bin/env node
// Genera sitemap.xml con las páginas del sitio y la ficha de cada piloto y equipo.
// Uso:  node tools/build-sitemap.js        (volver a correrlo cuando se agregue un piloto o equipo)
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const BASE = 'https://f1-info-arg.pages.dev';

global.window = {};
require(path.join(root, 'data.js'));

// Cloudflare Pages sirve las páginas sin ".html" (drivers.html → /drivers)
const pages = ['', 'drivers', 'teams', 'calendar', 'circuits', 'compare', 'stats', 'timeline',
               'predictor', 'trivia', 'rookies', 'glossary', 'today', 'search'];
const urls = pages.map(p => `${BASE}/${p}`);
window.drivers.forEach(d => urls.push(`${BASE}/driver?slug=${encodeURIComponent(d.slug)}`));
window.constructors.forEach(t => urls.push(`${BASE}/team?slug=${encodeURIComponent(t.slug)}`));

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${esc(u)}</loc></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(`✔ sitemap.xml generado con ${urls.length} URLs`);
