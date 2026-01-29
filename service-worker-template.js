/**
 * @fileoverview Service Worker Template for Join MPA PWA
 * @description Hybrid approach: Workbox precaching + custom logic
 *              This file is processed by Workbox to inject precache manifest.
 * @module service-worker-template
 */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
  NetworkOnly
} from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Version aus deinem Original
const CACHE_VERSION = '18';
const SETTINGS_DB = 'join-mpa-settings';

// ============================================
// Workbox Precaching (injected by build)
// ============================================
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// ============================================
// Runtime Caching Strategies
// ============================================

// 1. HTML Pages - Network First (immer frisch versuchen)
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'html-pages',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 Tag
      }),
    ],
  })
);

// 2. CSS & JS - Stale While Revalidate (schnell + update im Hintergrund)
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Tage
      }),
    ],
  })
);

// 3. Images - Cache First (ändern sich selten)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 Tage
      }),
    ],
  })
);

// 4. Fonts - Cache First (sehr langlebig)
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Jahr
      }),
    ],
  })
);

// 5. Manifests - Stale While Revalidate (theme-wechsel!)
registerRoute(
  ({ url }) => url.pathname.endsWith('.webmanifest'),
  new StaleWhileRevalidate({
    cacheName: 'manifests',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 5,
        maxAgeSeconds: 60 * 60, // 1 Stunde
      }),
    ],
  })
);

// ============================================
// Firebase Runtime Caching
// ============================================

// Firebase Storage - Cache First (Bilder, Media)
registerRoute(
  ({ url }) => url.origin === 'https://firebasestorage.googleapis.com',
  new CacheFirst({
    cacheName: 'firebase-storage',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Tage
      }),
    ],
  })
);

// Firebase Firestore - Network First (Daten sollen frisch sein)
registerRoute(
  ({ url }) => url.origin === 'https://firestore.googleapis.com',
  new NetworkFirst({
    cacheName: 'firebase-firestore',
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 Tag
      }),
    ],
  })
);

// Firebase Auth - Network Only (NIEMALS cachen!)
registerRoute(
  ({ url }) => url.origin === 'https://identitytoolkit.googleapis.com',
  new NetworkOnly()
);

// Google Fonts - Cache First
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Jahr
      }),
    ],
  })
);

// API Calls - Network First
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60, // 1 Stunde
      }),
    ],
  })
);

// ============================================
// Navigation Fallback (Offline Page)
// ============================================
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: 'navigations',
    networkTimeoutSeconds: 3,
  }),
  {
    // Nicht für API-Calls
    denylist: [/^\/api\//],
  }
);

registerRoute(navigationRoute);

// ============================================
// Install & Activate (mit skipWaiting)
// ============================================
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing version ${CACHE_VERSION}`);
  self.skipWaiting(); // Sofort aktivieren
});

self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating version ${CACHE_VERSION}`);
  self.clients.claim(); // Übernimm sofort alle Clients
});

// ============================================
// DEINE Custom Message Handler (beibehalten!)
// ============================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_SETTINGS') {
    const settings = event.data.payload;
    syncSettingsToWorker(settings);
  }

  if (event.data && event.data.type === 'CHECK_UPDATE') {
    storeVersionAndNotifyClients();
  }
});

async function storeVersionAndNotifyClients() {
  try {
    const db = await openSettingsDatabase();
    const tx = db.transaction(['settings'], 'readwrite');
    const store = tx.objectStore('settings');
    await store.put({ key: 'sw-version', value: CACHE_VERSION });

    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SW_UPDATE_AVAILABLE',
        version: CACHE_VERSION,
      });
    });

    console.log(`[SW] Version ${CACHE_VERSION} stored and clients notified`);
  } catch (error) {
    console.error('[SW] Failed to store version:', error);
  }
}

async function syncSettingsToWorker(settings) {
  try {
    const db = await openSettingsDatabase();
    const tx = db.transaction(['settings'], 'readwrite');
    const store = tx.objectStore('settings');
    await store.clear();

    for (const [key, value] of Object.entries(settings)) {
      await store.put({ key, value });
    }

    console.log('[SW] Settings synced:', settings);
  } catch (error) {
    console.error('[SW] Failed to sync settings:', error);
  }
}

function openSettingsDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SETTINGS_DB, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
  });
}
