const CACHE = "zigo-lanka-v2";

const fichiers = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(fichiers))
  );
});

self.addEventListener("fetch", event => {

  // Ne pas mettre en cache les appels API
  if (event.request.url.includes("script.google.com")) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );

});