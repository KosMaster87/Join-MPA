/**
 * @fileoverview Service Worker Constants Configuration
 * @description Centralized configuration for Service Worker behavior
 *              Compatible with both Service Worker and ES6 module contexts
 * @module config/sw-constants
 */

const SW_CONFIG = {
  // Versioning - WICHTIG: Erhöhe dies bei jedem Deployment um alle Caches zu invalidieren!
  CACHE_VERSION: '19',

  // Database Configuration
  SETTINGS_DB: 'join-mpa-settings',

  // Update Checking - Set to 1 minute during development, 5-30 minutes in production
  UPDATE_CHECK_INTERVAL: 1 * 60 * 1000, // 1 minute for development (change to 5-30 min for production)
  UPDATE_CHECK_DELAY: 1000, // 1 second delay after registration

  // Caching Timeouts (in seconds)
  NETWORK_TIMEOUTS: {
    DOCUMENTS: 5,
    MANIFESTS: 3,
    API: 5,
    NAVIGATION: 3,
    FIRESTORE: 5,
  },

  // Cache Entry Limits
  CACHE_LIMITS: {
    HTML_PAGES: 50,
    STATIC_RESOURCES: 100,
    IMAGES: 200,
    FONTS: 30,
    MANIFESTS: 5,
    FIREBASE_STORAGE: 100,
    FIREBASE_FIRESTORE: 50,
    API_CALLS: 20,
  },

  // Cache TTL (Time To Live) in seconds
  CACHE_TTL: {
    HTML_PAGES: 24 * 60 * 60, // 1 day
    STATIC_RESOURCES: 30 * 24 * 60 * 60, // 30 days
    IMAGES: 60 * 24 * 60 * 60, // 60 days
    FONTS: 365 * 24 * 60 * 60, // 1 year
    MANIFESTS: 0, // No cache (always network first)
    FIREBASE_STORAGE: 30 * 24 * 60 * 60, // 30 days
    FIREBASE_FIRESTORE: 24 * 60 * 60, // 1 day
    GOOGLE_FONTS: 365 * 24 * 60 * 60, // 1 year
    API_CALLS: 60 * 60, // 1 hour
  },
};

// For Service Worker: Define in global scope (no ES6 export)
// importScripts() in service-worker.js will have access to this globally
// This is intentional - Service Workers don't support ES6 imports

