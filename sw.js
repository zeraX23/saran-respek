const CACHE_NAME = 'respek-pwa-v1';

// Daftar file yang akan disimpan di memori lokal HP/Browser
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './admin.html',
  './manifest-admin.json',
  './logo-admin.png'
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Terinstal dan menyimpan cache');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Jangan lakukan caching pada request Supabase supaya data selalu realtime
  if (e.request.url.includes('supabase.co')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
