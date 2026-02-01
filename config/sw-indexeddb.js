/**
 * @fileoverview Service Worker IndexedDB Helper Functions
 * @description Manages IndexedDB operations for settings storage
 * @module config/sw-indexeddb
 */

/**
 * Open or create the settings database
 * @param {string} dbName - Database name
 * @returns {Promise<IDBDatabase>} Database instance
 */
function openSettingsDatabase(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
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

/**
 * Store version and notify clients of update
 * @param {string} cacheVersion - Current cache version
 * @param {string} settingsDb - Settings database name
 */
async function storeVersionAndNotifyClients(cacheVersion, settingsDb) {
  try {
    const db = await openSettingsDatabase(settingsDb);
    const tx = db.transaction(['settings'], 'readwrite');
    const store = tx.objectStore('settings');
    await store.put({ key: 'sw-version', value: cacheVersion });

    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SW_UPDATE_AVAILABLE',
        version: cacheVersion,
      });
    });

    console.log(`[SW] Version ${cacheVersion} stored and clients notified`);
  } catch (error) {
    console.error('[SW] Failed to store version:', error);
  }
}

/**
 * Sync settings from client to worker
 * @param {Object} settings - Settings object to sync
 * @param {string} settingsDb - Settings database name
 */
async function syncSettingsToWorker(settings, settingsDb) {
  try {
    const db = await openSettingsDatabase(settingsDb);
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

// Support both ES6 modules and importScripts contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    openSettingsDatabase,
    storeVersionAndNotifyClients,
    syncSettingsToWorker,
  };
}
