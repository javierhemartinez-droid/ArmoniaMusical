const CACHE = "armonia-v1";
const ASSETS = [
  "/Armonia-Musical/index.html",
  "/Armonia-Musical/explorador.html",
  "/Armonia-Musical/manifest.json",
  "/Armonia-Musical/icon-192.png",
  "/Armonia-Musical/icon-512.png",
  "/Armonia-Musical/icon-180.png",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

