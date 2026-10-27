// F1 Info ARG — Service Worker
// Rutas relativas al lugar donde está instalado el sitio: funciona en la raíz de un dominio
// (Cloudflare) y también bajo una subcarpeta (GitHub Pages).
const CACHE_NAME = 'f1arg-v8';
const SCOPE = self.registration.scope;
const STATIC_ASSETS = [
    './', 'index.html', 'drivers.html', 'teams.html', 'calendar.html', 'circuits.html',
    'compare.html', 'stats.html', 'timeline.html', 'predictor.html', 'trivia.html',
    'rookies.html', 'glossary.html', 'today.html', 'search.html', 'driver.html', 'team.html',
    'data.js', 'calendar-sessions.js', 'main.js', 'style.css', 'manifest.json',
    'img/logo-f1arg.jpg', 'img/icon-192.png'
].map(p => new URL(p, SCOPE).href);
const OFFLINE_FALLBACK = new URL('index.html', SCOPE).href;

// Instalación: se guardan los archivos base de a uno, así que si alguno falla no se cae toda la instalación
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url))))
            .then(() => self.skipWaiting())
    );
});

// Activación: borrar cachés viejas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

function saveInCache(request, response) {
    // Solo se guardan respuestas correctas (nunca un 404 o un error del servidor)
    if (!response || !response.ok) return;
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
}

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;   // APIs y CDNs externos: que los maneje el navegador

    // Imágenes y fuentes: primero la caché (cambian poco)
    if (/\.(jpg|jpeg|png|svg|gif|ico|webp|woff2?)$/i.test(url.pathname)) {
        event.respondWith(
            caches.match(request).then(cached => cached || fetch(request).then(res => {
                saveInCache(request, res);
                return res;
            }).catch(() => new Response('', { status: 408 })))
        );
        return;
    }

    // HTML, JS, CSS y JSON: primero la red (un deploy nuevo se ve enseguida) y la caché si no hay conexión
    event.respondWith(
        fetch(request)
            .then(res => { saveInCache(request, res); return res; })
            .catch(() => caches.match(request).then(cached =>
                cached || (request.mode === 'navigate' ? caches.match(OFFLINE_FALLBACK) : undefined)
            ))
    );
});
