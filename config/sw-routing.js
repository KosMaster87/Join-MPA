/**
 * @fileoverview Service Worker Routing Configuration
 * @description Centralized routing strategy setup using Workbox
 *              Handles caching for all request types
 * @module config/sw-routing
 */

/**
 * Setup all routing strategies for the Service Worker
 * @param {Object} CACHE_NAMES - Cache name constants
 * @param {Object} SW_CONFIG - Service Worker configuration
 */
function setupRouting(CACHE_NAMES, SW_CONFIG) {
  // ============================================
  // 1. HTML Pages - Network First
  // ============================================
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document',
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAMES.HTML,
      networkTimeoutSeconds: SW_CONFIG.NETWORK_TIMEOUTS.DOCUMENTS,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: SW_CONFIG.CACHE_LIMITS.HTML_PAGES,
          maxAgeSeconds: SW_CONFIG.CACHE_TTL.HTML_PAGES,
        }),
      ],
    })
  );

  // ============================================
  // 2. CSS & JS - Stale While Revalidate
  // ============================================
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'style' ||
      request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAMES.STATIC,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: SW_CONFIG.CACHE_LIMITS.STATIC_RESOURCES,
          maxAgeSeconds: SW_CONFIG.CACHE_TTL.STATIC_RESOURCES,
        }),
      ],
    })
  );

  // ============================================
  // 3. Images - Cache First
  // ============================================
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAMES.IMAGES,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: SW_CONFIG.CACHE_LIMITS.IMAGES,
          maxAgeSeconds: SW_CONFIG.CACHE_TTL.IMAGES,
        }),
      ],
    })
  );

  // ============================================
  // 4. Fonts - Cache First
  // ============================================
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAMES.FONTS,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: SW_CONFIG.CACHE_LIMITS.FONTS,
          maxAgeSeconds: SW_CONFIG.CACHE_TTL.FONTS,
        }),
      ],
    })
  );

  // ============================================
  // 5. Manifests - Network First
  // ============================================
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.endsWith('.webmanifest'),
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAMES.MANIFESTS,
      networkTimeoutSeconds: SW_CONFIG.NETWORK_TIMEOUTS.MANIFESTS,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: SW_CONFIG.CACHE_LIMITS.MANIFESTS,
          maxAgeSeconds: SW_CONFIG.CACHE_TTL.MANIFESTS,
        }),
      ],
    })
  );

  // ============================================
  // Firebase Storage - Cache First
  // ============================================
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://firebasestorage.googleapis.com',
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAMES.FIREBASE_STORAGE,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: SW_CONFIG.CACHE_LIMITS.FIREBASE_STORAGE,
          maxAgeSeconds: SW_CONFIG.CACHE_TTL.FIREBASE_STORAGE,
        }),
      ],
    })
  );

  // ============================================
  // Firebase Firestore - Network First
  // ============================================
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://firestore.googleapis.com',
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAMES.FIREBASE_FIRESTORE,
      networkTimeoutSeconds: SW_CONFIG.NETWORK_TIMEOUTS.FIRESTORE,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: SW_CONFIG.CACHE_LIMITS.FIREBASE_FIRESTORE,
          maxAgeSeconds: SW_CONFIG.CACHE_TTL.FIREBASE_FIRESTORE,
        }),
      ],
    })
  );

  // ============================================
  // Firebase Auth - Network Only
  // ============================================
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://identitytoolkit.googleapis.com',
    new workbox.strategies.NetworkOnly()
  );

  // ============================================
  // Google Fonts - Cache First
  // ============================================
  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAMES.GOOGLE_FONTS,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: SW_CONFIG.CACHE_TTL.GOOGLE_FONTS,
        }),
      ],
    })
  );

  // ============================================
  // API Calls - Network First
  // ============================================
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAMES.API,
      networkTimeoutSeconds: SW_CONFIG.NETWORK_TIMEOUTS.API,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: SW_CONFIG.CACHE_LIMITS.API_CALLS,
          maxAgeSeconds: SW_CONFIG.CACHE_TTL.API_CALLS,
        }),
      ],
    })
  );

  // ============================================
  // Navigation Fallback
  // ============================================
  const navigationRoute = new workbox.routing.NavigationRoute(
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAMES.NAVIGATIONS,
      networkTimeoutSeconds: SW_CONFIG.NETWORK_TIMEOUTS.NAVIGATION,
    }),
    {
      denylist: [/^\/api\//],
    }
  );

  workbox.routing.registerRoute(navigationRoute);
}

// Support both ES6 modules and importScripts contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupRouting };
}
