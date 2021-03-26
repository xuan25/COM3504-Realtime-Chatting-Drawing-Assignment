var CACHE_NAME = 'com3504_cache';
var filesToCache = [
    // add the files you want to cache here 
    '/',
    '/javascripts/canvas.js',
    '/javascripts/database.js',
    '/javascripts/idb.js',
    '/javascripts/index.js',
    '/javascripts/join.js',
    '/javascripts/room.js',
    '/javascripts/upload.js',
    '/stylesheets/join.css',
    '/stylesheets/room.css',
    '/stylesheets/style.css',
    '/join/offline/',
    '/join/offline/offline/'

];

/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (event) {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

/**
 * activation of service worker: it removes all cashed files if necessary
 */
//  self.addEventListener('activate', function (e) {
//     console.log('[ServiceWorker] Activate');
//     e.waitUntil(
//         caches.keys().then(function (keyList) {
//             return Promise.all(keyList.map(function (key) {
//                 if (key !== cacheName && key !== dataCacheName) {
//                     console.log('[ServiceWorker] Removing old cache', key);
//                     return caches.delete(key);
//                 }
//             }));
//         })
//     );
//     /*
//      * Fixes a corner case in which the app wasn't returning the latest data.
//      * You can reproduce the corner case by commenting out the line below and
//      * then doing the following steps: 1) load app for first time so that the
//      * initial New York City data is shown 2) press the refresh button on the
//      * app 3) go offline 4) reload the app. You expect to see the newer NYC
//      * data, but you actually see the initial data. This happens because the
//      * service worker is not yet activated. The code below essentially lets
//      * you activate the service worker faster.
//      */
//     return self.clients.claim();
// });

// when the worker receives a fetch request
self.addEventListener('fetch', function(event) {
    if (event.request.url.indexOf('socket.io/?') > -1){
        // Bypass socket io
        event.respondWith(fetch(event.request));
    }
    else if (/\/join\/[0-9a-z]+\/?$/g.exec(event.request.url)){
        // Return join page
        console.log(`Response join page`);
        caches.match("/join/offline/", {ignoreSearch:true, ignoreMethod:true, ignoreVary:true})
            .then(function (response) {
                if (response) {
                    return response;
                }
            })
    }
    else if (/\/join\/[0-9a-z]+\/[^\/]+\/$/g.exec(event.request.url)){
        // Return room page
        console.log(`Response room page`);
        caches.match("/join/offline/offline/")
            .then(function (response) {
                if (response) {
                    return response;
                }
            })
    }
    else{
        console.log('[Service Worker] Fetch', event.request.url);
        /*
         * The app is asking for app shell files. In this scenario the app uses the
         * "Cache, falling back to the network" offline strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
         */
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }

                    // Request
                    return fetch(event.request)
                        .then(function (response) {
                            // Check if we received a valid response
                            if (!response || response.status !== 200) {
                                console.log(`Response error: [${response.status}]: ${response.statusText}`);
                                return response
                            }

                            var responseToCache = response.clone();

                            // cache.add(e.request.url);
                            caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                });
                            return response;
                        });
                })
        );
    }
    
});

