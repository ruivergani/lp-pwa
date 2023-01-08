//set up cache name and files to add to it
const CACHE_NAME = "recipe-v1";
const CACHE_URLS = [
  "/",
  "index.html",
  "home.html",
  "register.html",
  "pages/about.html",
  "pages/contact.html",
  "pages/extra.html",
  "pages/faqs.html",
  "manifest.json",
  "css/main.css",
  "img/dish.webp",
  "img/fallback_dish.png",
  "img/fallback_lasagne.jpg",
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
  "img/icons/icon-384x384.png",
  "img/icons/icon-512x512.png",
  "img/icons/icon-72x72.png",
  "img/icons/icon-96x96.png",
];

//set up cache and files to add to it
//...

//add all URLs to cache when installed
self.addEventListener("install", function (event) {
  console.log("Service worker installed");
  event.waitUntil(
    //create and open cache
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Cache opened");
      //add all URLs to cache
      return cache.addAll(CACHE_URLS);
    })
  );
});

//On activate update the cache with the new version and clean out old caches
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName.startsWith("my-site-") && CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

//add all URLs to cache when installed
//...

//user has navigated to page - fetch required assets
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      //check whether asset is in cache
      if (response) {
        //asset in cache, so return it
        console.log(`Return ${event.request.url} from cache`);
        return response;
      }
      //asset not in cache so fetch asset from network
      console.log(`Fetch ${event.request.url} from network`);
      return fetch(event.request);
    })
  );
});
