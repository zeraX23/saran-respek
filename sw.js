importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const CACHE_NAME = 'respek-pwa-v1';
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
  self.skipWaiting(); // Memaksa update SW baru langsung aktif

  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Aktif dan mengambil alih kontrol');
  e.waitUntil(
    clients.claim().then(() => {
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({action: 'update'}));
      });
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Penting: Jangan di-cache request Supabase agar data transaksi/admin realtime
  if (e.request.url.includes('supabase.co')) {
    return; 
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
