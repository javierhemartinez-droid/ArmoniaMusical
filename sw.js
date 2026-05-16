const CACHE = "armonia-v1";
const ASSETS = [
  "/Musician-helper/index.html",
  "/Musician-helper/explorador.html",
  "/Musician-helper/manifest.json",
  "/Musician-helper/icons/icon-192.png",
  "/Musician-helper/icons/icon-512.png",
  "/Musician-helper/icons/icon-180.png",
];

// Install: cache all assets
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache first, fallback to network
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

