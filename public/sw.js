// Service Worker for caching resources
const CACHE_NAME = 'mybot-cache-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(STATIC_CACHE_URLS))
    .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Network first for data requests
        if (event.request.destination === 'image' ||
            event.request.url.includes('/api/') ||
            event.request.url.includes('/images/')) {
          return fetch(event.request)
            .then(response => {
              // Cache successful responses
              if (response.status === 200) {
                cache.put(event.request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Return offline fallback for images
              if (event.request.destination === 'image') {
                return caches.match('/assets/placeholder.gif');
              }
            });
        }

        // Default: cache strategy
        return fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

// Message event for cache updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_CLEANUP') {
    caches.match(event.data.url).then(cache => {
      if (cache) {
        caches.delete(CACHE_NAME).then(() => {
          caches.open(CACHE_NAME).then(cache =>
            cache.addAll(STATIC_CACHE_URLS)
          );
        });
      }
    });
  }
});
