const CACHE_NAME = 'qr-generator-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalace...');
  // Předběžné cachování statických souborů
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.error('Předběžné cachování se nezdařilo:', err);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Pokud je soubor v cache, vrátíme ho
      if (response) {
        console.log(
          'Service Worker: Soubor nalezen v cache:',
          event.request.url
        );
        return response;
      }

      // Jinak načteme soubor ze sítě a uložíme ho do cache
      return fetch(event.request)
        .then((networkResponse) => {
          // Kontrola, zda je odpověď platná
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          // Vytvoříme kopii odpovědi, protože originální lze použít jen jednou
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.error('Service Worker: Fetch se nezdařil:', error);
        });
    })
  );
});
