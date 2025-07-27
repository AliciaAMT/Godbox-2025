// Custom Service Worker for Kahal App
// This handles updates more aggressively than the default Angular Service Worker

const CACHE_NAME = 'kahal-v1.0.2'; // Current production version
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

// Install event - cache resources and skip waiting
self.addEventListener('install', (event) => {
  console.log('Kahal SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Kahal SW: Caching resources');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Kahal SW: Skip waiting to activate immediately');
        return self.skipWaiting();
      })
  );
});

// Activate event - claim all clients immediately
self.addEventListener('activate', (event) => {
  console.log('Kahal SW: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Kahal SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Kahal SW: Claiming all clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Kahal SW: Skipping waiting due to message');
    self.skipWaiting();
  }
});

// Check for updates every hour
setInterval(() => {
  console.log('Kahal SW: Checking for updates...');
  self.registration.update();
}, 60 * 60 * 1000); // 1 hour

// Notify clients when update is available
self.addEventListener('updatefound', () => {
  console.log('Kahal SW: Update found');
  const newWorker = self.registration.installing;

  newWorker.addEventListener('statechange', () => {
    if (newWorker.state === 'installed' && self.registration.waiting) {
      console.log('Kahal SW: New version available, notifying clients');
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE'
          });
        });
      });
    }
  });
});
