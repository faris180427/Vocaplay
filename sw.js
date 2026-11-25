const CACHE_NAME = 'vocaplay-studio-v4';
const CORE_ASSETS = [
  './',
  './index.html',
  './css/tailwind.css',
  './css/style.css',
  './vocab.js',
  './cloud.js',
  './js/state.js',
  './js/audio.js',
  './js/decks.js',
  './js/auth.js',
  './js/leaderboard.js',
  './js/missions.js',
  './js/engine.js',
  './js/games.js',
  './js/games_pro.js',
  './js/path.js',
  './js/ui.js',
  './assets/logos/logo-concept-4-precision.svg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  // Aset opsional yang belum ada tidak boleh menggagalkan seluruh instalasi.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(CORE_ASSETS.map((url) => cache.add(url).catch(() => null)))
    )
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

  const url = new URL(req.url);
  // Jangan pernah meng-cache API (leaderboard, kosakata, avatar) atau domain lain.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  // Network-first: kode terbaru selalu dimuat, cache hanya dipakai saat offline.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
