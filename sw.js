const CACHE = "armonia-v1";

// Usamos rutas relativas limpias. Al estar el sw.js en la raíz,
// detectará los archivos en su mismo nivel de directorio.
const ASSETS = [
  "./",
  "./index.html",
  "./explorador.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png"
];

// Install: cacheamos todos los archivos esenciales
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log("PWA: Cacheando archivos estáticos");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: limpiamos cachés viejas si cambiamos la versión (ej: "armonia-v2")
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE) {
            console.log("PWA: Borrando caché antigua", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: estrategia "Cache First, fallback to Network"
// Ideal para una app de herramientas que querés que abra instantáneamente y funcione offline.
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Si está en la caché, la devolvemos de inmediato
      if (cachedResponse) {
        return cachedResponse;
      }
      // Si no está, la va a buscar a internet
      return fetch(e.request);
    })
  );
});

