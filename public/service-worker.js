self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', (event) => {
  // Basic fetch event handler (no caching logic)
  event.respondWith(fetch(event.request));
});
