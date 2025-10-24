const CACHE_NAME = "pendu-explorer-v1";

const ASSETS_TO_CACHE = [
  "index.html",
  "game.html",
  "assets/css/style.css",
  "assets/css/game.css",
  "assets/js/game.js",
  "assets/img/soft.png",
  "assets/img/hard.png",
  "icon-192.png",
  "icon-512.png"
];

// Installe le service worker et met tout en cache (offline basique)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Répond aux requêtes avec le cache d'abord
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
