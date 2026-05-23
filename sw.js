self.addEventListener('install', (e) => {
  console.log('[Service Worker] Terinstal');
});

self.addEventListener('fetch', (e) => {
  // Syarat wajib dari Google Chrome agar pop-up install muncul
});
