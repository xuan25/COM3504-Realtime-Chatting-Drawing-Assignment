var CACHE_NAME = 'com3504_cache';
var filesToCache = [
    // common
    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js',
    '/javascripts/app.js',
    '/javascripts/database.js',
    '/javascripts/idb.js',
    '/stylesheets/style.css',

    // index
    '/',
    '/javascripts/index.js',

    // upload
    '/upload',
    '/javascripts/upload.js',

    // join
    '/join/offline/',
    '/javascripts/join.js',
    '/stylesheets/join.css',

    // room
    '/room/offline/',
    '/javascripts/room.js',
    '/socket.io/socket.io.js',
    '/javascripts/canvas.js',
    '/stylesheets/room.css',    
];

/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (event) {
    console.log('[ServiceWorker] Install');
    event.waitUntil(async function(){
        console.log('[ServiceWorker] Removing old cache');
        caches.delete(CACHE_NAME);

        console.log('[ServiceWorker] Caching app shell');
        cache = await caches.open(CACHE_NAME);
        return cache.addAll(filesToCache);
    }());
});

// when the worker receives a fetch request
self.addEventListener('fetch', function(event) {

    console.log('[Service Worker] Fetch', event.request.url);

    if (event.request.url.indexOf('chrome-extension') == 0){
        // Bypass extention
        event.respondWith(fetch(event.request));
        return;
    }
    
    if (event.request.url.indexOf('socket.io/?') > -1){
        // Bypass socket io
        event.respondWith(fetch(event.request));
        return;
    }

    if (event.request.url.indexOf('/img/meta') > -1 || event.request.url.indexOf('/img/search') > -1){
        // Return join page
        event.respondWith(async function() {
            try {
                response = await fetch(event.request);
                console.log(`[Service Worker] Response img metadata from server`);
                
                var responseToCache = response.clone();
                cache = await caches.open(CACHE_NAME)
                cache.put(event.request, responseToCache);

                return response;
            } catch (error) {
                console.log(`[Service Worker] Response img metadata from cache`);
                cachedResponse = await caches.match(event.request)
                return cachedResponse;
            }
        }());
        return;
    }
    
    if (/\/join\/[0-9a-z]+\/?$/g.exec(event.request.url)){
        // Return join page
        console.log(`[Service Worker] Request join page`);
        event.respondWith(async function() {
            try {
                response = await fetch(event.request);
                console.log(`[Service Worker] Response online join page`);
                return response;
            } catch (error) {
                console.log(`[Service Worker] Response offline join page`);
                offlinePage = await caches.match("/join/offline/")
                return offlinePage;
            }
        }());
        return;
    }
    
    if (/\/room\/[0-9a-z]+\/[^\/]+\/$/g.exec(event.request.url)){
        // Return room page
        console.log(`[Service Worker] Request room page`);
        event.respondWith(async function() {
            try {
                response = await fetch(event.request);
                console.log(`[Service Worker] Response online room page`);
                return response;
            } catch (error) {
                console.log(`[Service Worker] Response offline room page`);
                offlinePage = await caches.match("/room/offline/")
                return offlinePage;
            }
        }());
        return;
    }

    /*
    * The app is asking for app shell files. In this scenario the app uses the
    * "Cache, falling back to the network" offline strategy:
    * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
    */
    event.respondWith(async function () {
        response = await caches.match(event.request);

        // Cache hit - return response
        if (response) {
            return response;
        }

        response = await fetch(event.request);

        // Response validation
        if (!response || response.status !== 200) {
            console.log(`Response error: [${response.status}]: ${response.statusText}`);
            return response
        }

        // Store to the cache
        var responseToCache = response.clone();
        cache = await caches.open(CACHE_NAME)
        cache.put(event.request, responseToCache);

        return response;
    }());
    
});

