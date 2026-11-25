const CACHE_NAME = 'vocaplay-studio-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './vocab.js',
  './vocab_4000.js',
  './cloud.js',
  './js/state.js',
  './js/audio.js',
  './js/decks.js',
  './js/auth.js',
  './js/leaderboard.js',
  './js/missions.js',
  './js/engine.js',
  './js/games.js',
  './js/ui.js',
  './assets/logos/logo-concept-4-precision.svg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Network-first for Supabase API calls
  if (req.url.includes('supabase.co')) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
