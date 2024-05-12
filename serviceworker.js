const CACHE_NAME = 'homotix-cache-v1';
const urlsToCache = [
  '/offline.html',
  '/Mobile/Homotix.gif',
  '/Mobile/H512.png',
  '/Mobile/H192.png',
  '/manifest.json' // Ensure this is the correct path to your manifest.json
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(error => console.error('Error caching files:', error))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .catch(error => {
            console.error('Error fetching:', error);
            return caches.match('/offline.html'); // Return offline page if fetch fails
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
