// Hapus OneSignal dan ganti dengan Pushwoosh Service Worker
importScripts('https://cdn.pushwoosh.com/webpush/v3/pushwoosh-service-worker.js');

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
  console.log('[SW] Install: menyimpan cache...');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', (e) => {
  console.log('[SW] Aktif: hapus cache lama...');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => clients.claim()).then(() => {
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ action: 'update' }));
      });
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Biarkan request ke Supabase (API & Storage) lewat jaringan langsung
  if (e.request.url.includes('supabase.co')) return;
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
