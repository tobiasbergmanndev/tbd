// Service worker: caches the app shell so sprout works offline.
const CACHE = 'sprout-v1';
const SHELL = ['./', 'index.html', 'style.css', 'manifest.webmanifest', 'src/main.js', 'src/ui.js', 'src/plants.js', 'src/store.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((r) => r ?? fetch(e.request)));
});
