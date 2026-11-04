// 会場で電波が弱いときも開けるように、ページと館内図を端末に保存しておく
const CACHE = 'aha-nav-v5';
const FILES = ['./', 'index.html', 'maps/north.png', 'maps/south.png', 'maps/lakeside.png', 'maps/west.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // ページは新しい版を優先し、つながらなければ保存分を使う。図は保存分を優先
  if (req.mode === 'navigate' || req.url.endsWith('.html')) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req)));
  }
});
