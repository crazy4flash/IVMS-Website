// Cache Busting Service Worker
const CACHE_NAME = 'ivms-cache-v2';
const LOGO_FILES = [
  '/src/images/optimized/logo-ivms-new.webp',
  '/src/images/optimized/logo ivms-02.webp'
];

// Install event - clear old caches
self.addEventListener('install', function(event) {
  console.log('Cache buster service worker installing...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Activate event - clear all caches
self.addEventListener('activate', function(event) {
  console.log('Cache buster service worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - intercept logo requests and force fresh load
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  
  // Check if this is a logo request
  if (LOGO_FILES.some(file => url.pathname.includes(file))) {
    console.log('Intercepting logo request:', url.pathname);
    
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).catch(function() {
        // If fetch fails, return a response that forces reload
        return new Response('', {
          status: 404,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      })
    );
  }
  
  // For all other requests, add cache-busting headers
  if (url.pathname.endsWith('.webp') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg')) {
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
    );
  }
}); 