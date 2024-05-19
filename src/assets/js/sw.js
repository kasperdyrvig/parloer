const urlsToCache = [
    '.',
];

const cacheName = 'gp20240519-1';

self.addEventListener('install', event => {
    console.log('Install event!');
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Activate event!');
});

//self.addEventListener('fetch', event => {
//    console.log('Fetch intercepted for:', event.request.url);
//    event.respondWith(caches.match(event.request)
//        .then(cachedResponse => {
//            return cachedResponse || fetch(event.request);
//        })
//    );
//});

self.addEventListener('fetch', event => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request);
        })
    );
});