// This is mostly for testing. It'll get removed during build.
self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('SW magic install!');
});

self.addEventListener('activate', event => {
  console.log('SW ready to handle fetches!');
});

self.addEventListener('fetch', event => {
});
