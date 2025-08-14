const CACHE_NAME = 'qr-generator-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
];

// Detekce DEV prostředí
const isDevEnvironment = () => {
  return (
    self.location.hostname === 'localhost' ||
    self.location.hostname === '127.0.0.1' ||
    self.location.protocol === 'http:'
  );
};

self.addEventListener('install', (event) => {
  // V DEV prostředí neinstalujeme cache
  if (isDevEnvironment()) {
    console.log('Service Worker: DEV MODE - Přeskakuji instalaci cache');
    return;
  }

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
  // V DEV prostředí vždy načítáme ze sítě bez cache
  if (isDevEnvironment()) {
    console.log('Service Worker: DEV MODE - Načítám ze sítě bez cache');
    event.respondWith(fetch(event.request));
    return;
  }

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

// V DEV prostředí automaticky vymazat cache při aktualizaci
self.addEventListener('activate', (event) => {
  if (isDevEnvironment()) {
    console.log('Service Worker: DEV MODE - Vymazávám všechny cache');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});
