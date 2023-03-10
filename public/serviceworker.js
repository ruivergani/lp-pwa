//set up cache name and files to add to it
const staticCacheName = 'site-static-v8';
const dynamicCacheName = 'site-dynamic-v8';
const assets = [
  "/",
  "index.html",
  "login.html",
  "forgotpassword.html",
  "onboarding.html",
  "signup.html",
  "page-about.html",
  "page-contact.html",
  "page-extra.html",
  "page-faqs.html",
  "page-home.html",
  "fallback.html",
  "manifest.json",
  "css/lib/aos.css",
  "css/main.css",
  "js/main.js",
  "js/lib/aos.min.js",
  "js/lib/materialize.min.js",
  "img/dish.png",
  "img/dish.webp",
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

// Function Cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// // Install Event
self.addEventListener('install', evt => {
  console.log("Service worker installed");
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("Cache opened (assets)");
      cache.addAll(assets);
    })
  );
});


// // Activate Event
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

// Fetch Event
self.addEventListener('fetch', evt => {
  // check if request is made by chrome extensions or web page
  // if request is made for web page url must contains http.
  if (!(evt.request.url.indexOf('http') === 0)) return; // skip the request. if request is not made with http protocol

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
          return caches.match('/fallback.html');
        }
      })
    );
  }
});