importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const CACHE_NAME = 'respek-pwa-v1'; // Perbaikan typo: 'Const' menjadi 'const'

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

// --- 1. EVENT INSTALL ---
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Terinstal dan menyimpan cache');
  
  // MASUKKAN DI SINI: Memaksa Service Worker baru untuk langsung aktif
  self.skipWaiting(); 

  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// --- 2. EVENT ACTIVATE (DITAMBAHKAN DARI KODE SEBELUMNYA) ---
self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Aktif dan mengambil alih kontrol');
  
  e.waitUntil(
    // Ambil alih semua tab yang terbuka
    clients.claim().then(() => {
      // Kasih tahu semua halaman bahwa ada update agar bisa di-reload
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({action: 'update'}));
      });
    })
  );
});

// --- 3. EVENT FETCH ---
self.addEventListener('fetch', (e) => {
  // Jangan lakukan caching pada request Supabase supaya data selalu realtime
  if (e.request.url.includes('supabase.co')) {
    return; // Langsung tembak ke jaringan (network), abaikan cache
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      // Jika ada di cache, gunakan cache. Jika tidak, ambil dari internet.
      return response || fetch(e.request); 
    })
  );
});
