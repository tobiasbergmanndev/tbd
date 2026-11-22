// Service worker: caches the app shell so sprout works offline.
const CACHE = 'sprout-v1';
const SHELL = ['./', 'index.html', 'style.css', 'manifest.webmanifest', 'src/main.js', 'src/ui.js', 'src/plants.js', 'src/store.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((r) => r ?? fetch(e.request)));
});

// Reminders (step 3 of the notifications plan, in progress).
// A service worker can't read localStorage, so the page mirrors the upcoming reminders into
// IndexedDB ('sprout' database, 'reminders' store) whenever it saves the plants.
self.addEventListener('periodicsync', (e) => {
  if (e.tag !== 'sprout-reminders') return;
  e.waitUntil(showDueReminders());
});

async function showDueReminders() {
  // TODO: read the reminders from IndexedDB, show a notification for each one that is due
  // and outside quiet hours, and mark it shown.
}
