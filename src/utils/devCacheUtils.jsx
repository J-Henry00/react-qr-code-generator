/**
 * Utility funkce pro správu cache v DEV prostředí
 */

// Detekce, zda jsme v DEV prostředí
export const isDevEnvironment = () => {
  return import.meta.env.DEV || 
         import.meta.env.MODE === 'development' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

// Vypnutí všech typů cache v DEV prostředí
export const disableCacheInDev = () => {
  if (!isDevEnvironment()) return;

  console.log('🔧 DEV MODE: Vypínám cache...');

  // Vypnutí HTTP cache
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
        console.log(`🗑️ Cache smazána: ${cacheName}`);
      });
    });
  }

  // Vypnutí localStorage cache (volitelné)
  if (localStorage.getItem('dev-cache-disabled') !== 'true') {
    localStorage.setItem('dev-cache-disabled', 'true');
    console.log('🗑️ localStorage cache vypnuta');
  }

  // Vypnutí sessionStorage cache
  if (sessionStorage.getItem('dev-cache-disabled') !== 'true') {
    sessionStorage.setItem('dev-cache-disabled', 'true');
    console.log('🗑️ sessionStorage cache vypnuta');
  }

  // Přidání meta tagů pro vypnutí cache
  addNoCacheMetaTags();

  // Vypnutí service worker cache
  disableServiceWorkerCache();
};

// Přidání meta tagů pro vypnutí cache
const addNoCacheMetaTags = () => {
  const existingMeta = document.querySelector('meta[http-equiv="Cache-Control"]');
  if (!existingMeta) {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Cache-Control');
    meta.setAttribute('content', 'no-cache, no-store, must-revalidate');
    document.head.appendChild(meta);
    console.log('🏷️ Meta tag pro vypnutí cache přidán');
  }
};

// Vypnutí service worker cache
const disableServiceWorkerCache = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        // Unregister service worker v DEV
        await registration.unregister();
        console.log('🔄 Service Worker odregistrován v DEV módu');
      }
    } catch (error) {
      console.log('⚠️ Chyba při odregistrování Service Worker:', error);
    }
  }
};

// Funkce pro vymazání všech cache při reload
export const clearAllCacheOnReload = () => {
  if (!isDevEnvironment()) return;

  // Přidání event listener pro před odchodem ze stránky
  window.addEventListener('beforeunload', () => {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
  });

  console.log('🔄 Cache bude vymazána při reload v DEV módu');
};

// Funkce pro kontrolu a logování cache stavu
export const logCacheStatus = () => {
  if (!isDevEnvironment()) return;

  console.group('🔍 Cache Status (DEV MODE)');
  
  // HTTP cache
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      console.log('📦 HTTP Caches:', cacheNames);
    });
  }
  
  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('🔄 Service Workers:', registrations.length);
    });
  }
  
  // localStorage
  console.log('💾 localStorage items:', Object.keys(localStorage).length);
  
  // sessionStorage
  console.log('💾 sessionStorage items:', Object.keys(sessionStorage).length);
  
  console.groupEnd();
};

// Automatické spuštění v DEV prostředí
if (isDevEnvironment()) {
  // Spustit při načtení stránky
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', disableCacheInDev);
  } else {
    disableCacheInDev();
  }
  
  // Logovat cache stav
  setTimeout(logCacheStatus, 1000);
} 