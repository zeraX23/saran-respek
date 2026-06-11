const CACHE_NAME = 'respek-pwa-v1';

// Daftar file yang akan disimpan agar aplikasi bisa dimuat lebih cepat
const ASSETS_TO_CACHE = [
  './',
  // --- File Web Umum (Warga) ---
  './index.html',
  './manifest.json',
  './logo.png', // Sesuaikan jika nama file ikon warga Anda berbeda
  
  // --- File Web Admin ---
  './admin.html', // Pastikan file "admin (3).html" sudah di-rename menjadi "admin.html"
  './manifest-admin.json',
  './logo-admin.png' // Sesuaikan jika nama file ikon admin Anda berbeda
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
  // PENTING: Jangan cache request ke Supabase agar data tabel selalu realtime
  if (e.request.url.includes('supabase.co')) {
    return;
  }

  // Syarat wajib dari Google Chrome agar pop-up install muncul
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
