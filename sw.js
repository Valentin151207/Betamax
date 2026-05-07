// ═══════════════════════════════════════
//  BETAMAX — Service Worker v2.0
//  Compatible GitHub Pages (racine)
// ═══════════════════════════════════════

const CACHE_NAME = 'betamax-v2.0.0';

// Uniquement les fichiers qui existent réellement dans le repo
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './favicon.svg',
];

// ── INSTALL ────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch(err => console.warn('[SW] Cache partiel:', err))
  );
  self.skipWaiting();
});

// ── ACTIVATE ───────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH ──────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Laisser passer les requêtes externes (fonts, CDN, APIs)
  if (url.origin !== self.location.origin) return;

  // Stratégie : Network first, fallback cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache les réponses GET valides
        if (event.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Fallback sur le cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Pour la navigation : renvoyer index.html depuis le cache
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
