// Back Catalog phone app: works offline, updates itself. Your list never goes through here;
// it goes straight between the app and your private GitHub space.
const VERSION = '1.3.1-af19563e';
const CACHE = 'back-catalog-' + VERSION;
const FILES = ["./","app.js","fonts/bodoni-moda-latin-500-normal.woff2","fonts/bodoni-moda-latin-600-normal.woff2","fonts/bodoni-moda-latin-ext-600-normal.woff2","fonts/dm-mono-latin-400-normal.woff2","fonts/dm-mono-latin-500-normal.woff2","fonts/schibsted-grotesk-latin-400-normal.woff2","fonts/schibsted-grotesk-latin-500-normal.woff2","fonts/schibsted-grotesk-latin-600-normal.woff2","fonts/schibsted-grotesk-latin-700-normal.woff2","fonts/schibsted-grotesk-latin-ext-400-normal.woff2","fonts/schibsted-grotesk-latin-ext-600-normal.woff2","icons/apple-touch-icon.png","icons/favicon-64.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","index.html","manifest.webmanifest","styles.css"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('back-catalog-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // Open instantly from the phone; a new version arrives with the next worker.
    e.respondWith(caches.open(CACHE).then((c) => c.match('./').then((r) => r || c.match('index.html'))).then((r) => r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
