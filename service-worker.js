// Basic Service Worker for PWA offline support
const CACHE_NAME = "join-mpa-cache-v1";
const OFFLINE_URL = "/index.html";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/css/base/variables.css",
  "/css/base/reset.css",
  "/css/base/fonts.css",
  "/css/components/splash.css",
  "/js/shared/pwa-theme-loader.js",
  // Add more assets as needed
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response || fetch(event.request).catch(() => caches.match(OFFLINE_URL))
      );
    }),
  );
});
