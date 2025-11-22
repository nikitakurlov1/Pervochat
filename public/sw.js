// Service Worker для PWA
// Версія кешу
const CACHE_NAME = 'school-messenger-v1';

// Файли для кешування
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Встановлення Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Активувати новий SW одразу
  self.skipWaiting();
});

// Активація Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Взяти контроль над всіма клієнтами одразу
  return self.clients.claim();
});

// Fetch - стратегія Network First, потім Cache
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Don't attempt to cache non-GET requests (POST/PUT/DELETE etc.)
  if (req.method !== 'GET') {
    event.respondWith(
      fetch(req).catch(() => {
        // If navigation fails (user tried to open a page), return cached index.html
        if (req.mode === 'navigate') {
          return caches.match('/index.html');
        }
        // Generic service unavailable response for other non-GET requests
        return new Response(null, { status: 503, statusText: 'Service Unavailable' });
      })
    );
    return;
  }

  // For GET requests use network-first, fallback to cache
  event.respondWith(
    fetch(req)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache).catch((err) => {
              // Avoid uncaught errors when cache.put is unsupported for this request
              console.warn('Failed to cache response for', req.url, err);
            });
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(req).then((cached) => cached || caches.match('/index.html'));
      })
  );
});
