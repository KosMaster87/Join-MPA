/**
 * @fileoverview Service Worker Template for Join MPA PWA
 * @description Main service worker entry point - orchestrates precaching and routing
 *              This file is processed by Workbox to inject precache manifest.
 * @module service-worker-template
 */

// ============================================
// Load Libraries & Configuration
// ============================================

// Load Workbox libraries - UMD Builds for Service Workers
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js",
);

// Load configuration modules
importScripts("/config/cache-config.js");
importScripts("/config/sw-constants.js");
importScripts("/config/sw-routing.js");
importScripts("/config/sw-lifecycle.js");
importScripts("/config/sw-indexeddb.js");
importScripts("/config/sw-messages.js");

// Ensure workbox is available
if (workbox) {
  console.log("[SW] Workbox loaded successfully");
} else {
  console.error("[SW] Workbox failed to load!");
}

// ============================================
// Workbox Precaching (injected by build)
// ============================================
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
workbox.precaching.cleanupOutdatedCaches();

// ============================================
// Setup All Service Worker Features
// ============================================
setupRouting(CACHE_NAMES, SW_CONFIG);
setupLifecycle(CACHE_NAMES, SW_CONFIG);
setupMessages(SW_CONFIG);
