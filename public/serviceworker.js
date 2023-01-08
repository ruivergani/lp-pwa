//set up cache name and files to add to it
const staticCacheName = 'site-static-v7';
const dynamicCacheName = 'site-dynamic-v7';
const assets = [
  "/",
  "index.html",
  "home.html",
  "register.html",
  "pages/about.html",
  "pages/contact.html",
  "pages/extra.html",
  "pages/faqs.html",
  "pages/fallback.html",
  "manifest.json",
  "css/main.css",
  "css/plugins.css",
  "js/all.js",
  "js/plugins.js",
  //"https://fonts.googleapis.com/icon?family=Material+Icons",
  //"https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js",
  //"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
  //"https://fonts.gstatic.com/s/materialicons/v139/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "img/dish.webp",
  "img/fallback_dish.png",
  "img/fallback_lasagne.jpg",
  "img/fallback_pizza.jpg",
  "img/fallback_rice.jpg",
  "img/lasagne.webp",
  "img/pizza.webp",
  "img/rice.webp",
  "img/icons/icon-128x128.png",
  "img/icons/icon-144x144.png",
  "img/icons/icon-152x152.png",
  "img/icons/icon-192x192.png",
  "img/icons/icon-384x384.png",
  "img/icons/icon-512x512.png",
  "img/icons/icon-72x72.png",
  "img/icons/icon-96x96.png",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Install Event
self.addEventListener('install', evt => {
  console.log("Service worker installed");
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("Cache opened (assets)");
      cache.addAll(assets);
    })
  );
});

// //add all URLs to cache when installed
// self.addEventListener("install", function (event) {
//   console.log("Service worker installed");
//   event.waitUntil(
//     //create and open cache
//     caches.open(CACHE_NAME).then(function (cache) {
//       console.log("Cache opened");
//       //add all URLs to cache
//       return cache.addAll(CACHE_URLS);
//     })
//   );
// });

// Activate Event
self.addEventListener('activate', evt => {
  console.log('Service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// //On activate update the cache with the new version and clean out old caches
// self.addEventListener("activate", function (event) {
//   console.log('Service worker activated');
//   event.waitUntil(
//     caches.keys().then(function (cacheNames) {
//       return Promise.all(
//         cacheNames.map(function (cacheName) {
//           if (cacheName.startsWith("my-site-") && CACHE_NAME !== cacheName) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// Fetch Event
self.addEventListener('fetch', evt => {
  if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          })
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
          return caches.match('/pages/fallback.html');
        }
      })
    );
  }
});


//user has navigated to page - fetch required assets
// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       //check whether asset is in cache
//       if (response) {
//         //asset in cache, so return it
//         console.log(`Return ${event.request.url} from cache`);
//         return response;
//       }
//       //asset not in cache so fetch asset from network
//       console.log(`Fetch ${event.request.url} from network`);
//       return fetch(event.request);
//     })
//   );
// });
