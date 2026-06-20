self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Pass-through for online fetching
  event.respondWith(fetch(event.request));
});
