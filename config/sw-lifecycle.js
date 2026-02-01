/**
 * @fileoverview Service Worker Lifecycle Events
 * @description Handles install, activate, and cleanup events
 * @module config/sw-lifecycle
 */

/**
 * Setup lifecycle events for Service Worker
 * @param {Object} CACHE_NAMES - Cache name constants
 * @param {Object} SW_CONFIG - Service Worker configuration
 */
function setupLifecycle(CACHE_NAMES, SW_CONFIG) {
  // ============================================
  // Install Event
  // ============================================
  self.addEventListener('install', (event) => {
    console.log(`[SW] Installing version ${SW_CONFIG.CACHE_VERSION}`);
    self.skipWaiting(); // Sofort aktivieren
  });

  // ============================================
  // Activate Event
  // ============================================
  self.addEventListener('activate', (event) => {
    console.log(`[SW] Activating version ${SW_CONFIG.CACHE_VERSION}`);
    event.waitUntil(
      // Cleanup alte Caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Behalte nur aktuelle Caches
            const allowedCaches = getAllowedCaches();
            if (!allowedCaches.includes(cacheName)) {
              console.log(`[SW] Clearing cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );

    // Übernimm sofort alle Clients
    self.clients.claim();

    // Benachrichtige alle Clients von der neuen Version
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_ACTIVATED',
          version: SW_CONFIG.CACHE_VERSION,
        });
      });
    });
  });
}

// Support both ES6 modules and importScripts contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupLifecycle };
}
