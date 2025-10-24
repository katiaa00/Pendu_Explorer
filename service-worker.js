const CACHE_NAME = "pendu-explorer-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/game.html",
  "/manifest.json",
  "/assets/css/style.css",
  "/assets/css/game.css",
  "/assets/js/game.js",
  "/assets/img/soft.png",
  "/assets/img/hard.png",
  "/icon-192.png",
  "/icon-512.png"
];

// INSTALL : on met tout en cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// FETCH : on sert le cache d'abord
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ACTIVATE : on vire les vieux caches si tu republies
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});
