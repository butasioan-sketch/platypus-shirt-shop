const V = 'platypus-v1';
const ASSETS = ['/', '/icon-192.png', '/icon-512.png', '/models/shirt-white-v2.glb'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.pathname.startsWith('/models/') || u.pathname.startsWith('/icon')) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const cl = res.clone(); caches.open(V).then(c => c.put(e.request, cl)); return res;
    })));
  } else if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/')));
  }
});
