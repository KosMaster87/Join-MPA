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
precacheAndRoute([{"revision":"c9cbbc5f66548082844a7ebf4d00884e","url":"index.html"},{"revision":"9941d13ee0bf828b16ac5f31b0b5b6d4","url":"pages/summary.html"},{"revision":"8859d126ebafba9156844dfefba971aa","url":"pages/register.html"},{"revision":"971733f62d83093db075891648b5c337","url":"pages/login.html"},{"revision":"65103f42fb3a03645062e88da978b8e2","url":"css/pages/summary.css"},{"revision":"70b51436eb693d6825f33e5c9e81cb80","url":"css/pages/register.css"},{"revision":"1922789b8c693909b52c4645563c3583","url":"css/pages/login.css"},{"revision":"04ea6d1d929cbf4560707a94c55d8278","url":"css/layout/auth-layout.css"},{"revision":"7d8850569aaaa7faf70f52a1e92b3474","url":"css/layout/app-layout.css"},{"revision":"0758ebb7b8bd1b491e4c7809bea60105","url":"css/components/toast.css"},{"revision":"9801767e696db778c0c15814e3b9e004","url":"css/components/splash.css"},{"revision":"2bc1df1457989bbc41e079a08e4728b5","url":"css/components/menu.css"},{"revision":"9876b8fe5d9cc9bbe45edd3473780c50","url":"css/components/header.css"},{"revision":"cf9b2b79a303a27b3befea37175d4b87","url":"css/base/variables.css"},{"revision":"c448986f24ab37361aaee47847c8931e","url":"css/base/reset.css"},{"revision":"9c52ec424fb3e366d860e6196a835492","url":"css/base/fonts.css"},{"revision":"472cb3bf4fbac9ad67719a7300e5e97f","url":"js/summary/summary__init.js"},{"revision":"297c1cdc636611ba77468b1e4dd71cd1","url":"js/summary/summary-tasks.js"},{"revision":"57a22149f0d91f7194ae67c501052dc8","url":"js/summary/summary-layout.js"},{"revision":"0e41e4ab991254e80d218e9e79ac7320","url":"js/summary/summary-greeting.js"},{"revision":"c1b343bb34d1041a03f82dc0e106de36","url":"js/shared/validators.js"},{"revision":"d8a323b69838b79fccaf6491975b9842","url":"js/shared/ui-helpers.js"},{"revision":"cf80ad4f59a2098ecadf6af035764a7a","url":"js/shared/theme-service.js"},{"revision":"0af1a498d39529370700b7e36fdffa32","url":"js/shared/sw-update.js"},{"revision":"9d80d167d4faf77b9af28ee4eefac8be","url":"js/shared/install-prompt.js"},{"revision":"ba7c07df9eda38ec6e92eabe8f5e3615","url":"js/shared/include-html.js"},{"revision":"1b850bf6fce4bc396730e1bba0384804","url":"js/shared/fade-service.js"},{"revision":"ba4b71aaa528e1ce044dec6768070881","url":"js/pages/landing__init.js"},{"revision":"60e9ad677b3d6164d0a67721f6847a98","url":"js/layout/menu__navigation.js"},{"revision":"5862086b72478646587d87d6aab722b4","url":"js/header/header__init.js"},{"revision":"a2ae7387dc2ddfea24a947516fdc702d","url":"js/header/header-user-menu.js"},{"revision":"e2b351ffe283dd2eadd385b210bf5fd6","url":"js/header/header-user-display.js"},{"revision":"25419bb0da10ff454a931d771ef7e21a","url":"js/header/header-navigation.js"},{"revision":"7556ebd881b9fb49f4ae82a00faca6ce","url":"js/header/header-auth.js"},{"revision":"bca5382e90555f5674e6b277232f4d58","url":"js/auth/auth__register.js"},{"revision":"d4f2dbbeb5b6b6d7ef27638ad2aba569","url":"js/auth/auth__login.js"},{"revision":"95a811cb2e2ed9ce86e0c2e206801e71","url":"assets/img/theme/light-mode.svg"},{"revision":"c3eaa2616f92ae48069ed76bfb6391b2","url":"assets/img/theme/device.svg"},{"revision":"bd735a67e22dc77904c13a4f7c0ca432","url":"assets/img/theme/dark-mode.svg"},{"revision":"586b0a28cf66ee4dd6d26cbbcf5bfe3b","url":"assets/img/summary/urgency-default.svg"},{"revision":"425cb4fa7251a5d6b407a076ea90dbf3","url":"assets/img/summary/pencil-white.svg"},{"revision":"2539f2c76d5d919ac6d3229d2d8008b5","url":"assets/img/summary/pencil-blue.svg"},{"revision":"693358c9f54b4ae9d774ce998fdf152a","url":"assets/img/summary/check-white.svg"},{"revision":"a3419acb95f78497acc22bd8cbdc83fa","url":"assets/img/summary/check-blue.svg"},{"revision":"78a24b6265f46dbb82e1765fe4907b11","url":"assets/img/shared/join-logo-white.svg"},{"revision":"3d7d27397382f8116b23730ed8ab1fe5","url":"assets/img/shared/join-logo-blue.svg"},{"revision":"bed9e4794b9bc07f87a7aea822797488","url":"assets/img/shared/arrow-left-default.svg"},{"revision":"0e28cc8253385763d24d87a37bb601f5","url":"assets/img/screenshots/preview-join.png"},{"revision":"a544c03f5111407e9878e6d041152168","url":"assets/img/menu/summary-default.svg"},{"revision":"b54302294be88ddc9826f4f0339543b9","url":"assets/img/menu/contacts-default.svg"},{"revision":"752cdef313303f79d376b112d889b622","url":"assets/img/menu/board-default.svg"},{"revision":"56396e6325d63147c2b376a24532ce63","url":"assets/img/menu/add-task-default.svg"},{"revision":"ff68f9dfa712e3df464f85182ed507e7","url":"assets/img/language/language-en.png"},{"revision":"77eb45994ca26fb447a26bbef1a188f5","url":"assets/img/language/language-de.png"},{"revision":"966c4118dae2702edc99c82e884cdc04","url":"assets/img/header/help-default.svg"},{"revision":"961dc9e6f7b447643fb8ccc348dba919","url":"assets/img/auth/visibility-on-default.svg"},{"revision":"5abab8dfab8f1c66959be3580c008c52","url":"assets/img/auth/visibility-off-default.svg"},{"revision":"cd02a4ff43b8c191ba68a2c192f7744c","url":"assets/img/auth/person-default.svg"},{"revision":"19f88f6c209eb8bd63bc6891dda2a7d0","url":"assets/img/auth/mail-default.svg"},{"revision":"080bce5f009ba9d190be0dd6f62a6d76","url":"assets/img/auth/lock-default.svg"},{"revision":"2e58d0ba2063e2c97aaac98bb4137f5a","url":"assets/img/auth/checkbox-default.svg"},{"revision":"c7f1a7d30f383078e92d834c82b7423a","url":"assets/img/auth/checkbox-checked.svg"},{"revision":"73aaa95eab3115ea5a1e5c1cf16ea645","url":"assets/fonts/inter/inter-v13-latin-regular.woff2"},{"revision":"360288f2a48cc8bd09648ddec768f780","url":"assets/fonts/inter/inter-v13-latin-900.woff2"},{"revision":"9b96e5d17b9b517c40252bf4ea408121","url":"assets/fonts/inter/inter-v13-latin-800.woff2"},{"revision":"2a4c97ec45ef9f6d47fb0e7cd47ae67c","url":"assets/fonts/inter/inter-v13-latin-700.woff2"},{"revision":"0bf7eadca131e06ec47943f8b4981f72","url":"assets/fonts/inter/inter-v13-latin-600.woff2"},{"revision":"96948ea7ac03e6e7bfb59c582357ea90","url":"assets/fonts/inter/inter-v13-latin-500.woff2"},{"revision":"dbbd96470df8fd37d0f322fc66128bda","url":"assets/fonts/inter/inter-v13-latin-300.woff2"},{"revision":"2a1938cd178e6f6fbda42817059bc3c8","url":"assets/fonts/inter/inter-v13-latin-200.woff2"},{"revision":"3e8055911b7872f6dd5c89d6e8bfb257","url":"assets/fonts/inter/inter-v13-latin-100.woff2"},{"revision":"0f0fd699d568ec1bf0594dcfc15de95a","url":"assets/theme-light/icon-96.png"},{"revision":"63df64a5a219af339693c66653dfdf80","url":"assets/theme-light/icon-72.png"},{"revision":"86c49abe9c631decc72377ce62c7c062","url":"assets/theme-light/icon-512.png"},{"revision":"1db9d2b20ba48d9f771b7c373c8c22ed","url":"assets/theme-light/icon-512-maskable.png"},{"revision":"44239ed6827e5a82e0a4739b86393ee5","url":"assets/theme-light/icon-384.png"},{"revision":"af0caed0b3a569ba658ee92d7670c461","url":"assets/theme-light/icon-32.png"},{"revision":"59066163ed3b225d8f3331635d122a60","url":"assets/theme-light/icon-192.png"},{"revision":"ed4c74e38ec30bb86c3e12920e1971ef","url":"assets/theme-light/icon-192-maskable.png"},{"revision":"d30ace20373ca3dc97bc983626632dc9","url":"assets/theme-light/icon-152.png"},{"revision":"33dbd096072f9b479d91cc87e1bc9ef1","url":"assets/theme-light/icon-144.png"},{"revision":"21aa6921526aa57fcd9812cd8497c3a2","url":"assets/theme-light/icon-128.png"},{"revision":"901a8b26041ec98b52f92df0d1458c0d","url":"assets/theme-light/favicon.png"},{"revision":"235f2c6c52915ace6494f0da23e5feef","url":"assets/theme-dark/icon-96.png"},{"revision":"7724e3f4c9f0ab80c69589dbbe6612f4","url":"assets/theme-dark/icon-72.png"},{"revision":"c00ace19c9e9156501c89ee793a40e9c","url":"assets/theme-dark/icon-512.png"},{"revision":"359c8cb8ddcf602df19b92bf1d31f1de","url":"assets/theme-dark/icon-512-maskable.png"},{"revision":"562bc58641073f5c16d412b8102228c9","url":"assets/theme-dark/icon-384.png"},{"revision":"aade6b22c39b18505ba63c4f059d3ec6","url":"assets/theme-dark/icon-32.png"},{"revision":"5263178a5fa925fd72e0f8a27fdd0b04","url":"assets/theme-dark/icon-192.png"},{"revision":"baf165a413ae9eec207c1bdaa0abf0b3","url":"assets/theme-dark/icon-192-maskable.png"},{"revision":"33b3230bec5c2b806035a4dd39771c70","url":"assets/theme-dark/icon-152.png"},{"revision":"8cb61ad9b532544a8b21d12d9f13689d","url":"assets/theme-dark/icon-144.png"},{"revision":"ce50ebfe8b6d057d57083d0a3197e798","url":"assets/theme-dark/icon-128.png"},{"revision":"ce875e73cd260b2f42315323292c4ed6","url":"assets/theme-dark/favicon.png"},{"revision":"bab90f297ed97aabf1471009dcda5055","url":"config/firebase.config.js"},{"revision":"86d7d7a0378fbb87c9ce810986c32d0e","url":"services/user-data.service.js"},{"revision":"d6f686a21d10c8285e86d9096d2b5a85","url":"services/splash.service.js"},{"revision":"92725e89bc3767439d99d253863750d0","url":"services/firestore.service.js"},{"revision":"491342d71bcfd8d173e88c895cbf8ea8","url":"services/data.service.js"},{"revision":"745c8112cba9e83e80db29e50f56547e","url":"services/badge.service.js"},{"revision":"755ad840e9cca808c7755ece682815ed","url":"services/auth.service.js"}]);
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
