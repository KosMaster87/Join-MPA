/**
 * @fileoverview Cache Configuration for Service Worker and Client Code
 * @description Centralized cache names used throughout the PWA
 *              Compatible with both Service Worker (importScripts) and ES6 modules
 * @module config/cache-config
 */

// Define all cache names used in the application
const CACHE_NAMES = {
  // Content Caches
  HTML: "html-pages", // HTML documents (login, summary, etc.)
  STATIC: "static-resources", // CSS and JavaScript files
  IMAGES: "images", // Image assets
  FONTS: "fonts", // Font files
  MANIFESTS: "manifests", // Web app manifests

  // External Service Caches
  FIREBASE_STORAGE: "firebase-storage", // Firebase Storage (images, media)
  FIREBASE_FIRESTORE: "firebase-firestore", // Firestore data
  GOOGLE_FONTS: "google-fonts", // Google Fonts CDN
  API: "api-cache", // API responses
  NAVIGATIONS: "navigations", // Navigation routes
};

/**
 * Get array of all allowed cache names for cleanup
 * @returns {string[]} Array of all cache names
 */
function getAllowedCaches() {
  return Object.values(CACHE_NAMES);
}

// Support both ES6 modules and importScripts contexts
if (typeof module !== "undefined" && module.exports) {
  // ES6 Module context (client code, node)
  module.exports = {
    CACHE_NAMES,
    getAllowedCaches,
  };
}
// Otherwise it's available as global variables in Service Worker context
