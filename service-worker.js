var dataCacheName = 'dataCache-v1';
var cacheName = 'resourceCache-v1-'+new Date();//resourceCache-v1-2019-06-20
var filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/icons/app-icon-48x48.png',
  '/images/icons/app-icon-512x512.png',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // The code below essentially lets you activate the service worker faster.
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = '/demo-api/';
  if (e.request.url.indexOf(dataUrl) > -1) {
    //https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    //https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
