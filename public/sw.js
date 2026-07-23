/** Bump V on every deploy that must purge old offline caches. */
const V = 'platypus-v3-no-glb-cache';
const ASSETS = ['/', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(V)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);

  // NEVER cache GLBs in SW — mesh swaps must hit CDN immediately.
  // Browser HTTP cache + Vercel still apply; SW was serving stale models for days.
  if (u.pathname.startsWith('/models/')) {
    e.respondWith(fetch(e.request));
    return;
  }

  if (u.pathname.startsWith('/icon')) {
    e.respondWith(
      caches.match(e.request).then(
        (r) =>
          r ||
          fetch(e.request).then((res) => {
            const cl = res.clone();
            caches.open(V).then((c) => c.put(e.request, cl));
            return res;
          }),
      ),
    );
    return;
  }

  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/')));
  }
});
