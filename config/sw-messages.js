/**
 * @fileoverview Service Worker Message Handler
 * @description Handles communication between client and Service Worker
 * @module config/sw-messages
 */

/**
 * Setup message event listener for Service Worker
 * @param {Object} SW_CONFIG - Service Worker configuration
 */
function setupMessages(SW_CONFIG) {
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SYNC_SETTINGS") {
      const settings = event.data.payload;
      syncSettingsToWorker(settings, SW_CONFIG.SETTINGS_DB);
    }

    if (event.data && event.data.type === "CHECK_UPDATE") {
      storeVersionAndNotifyClients(
        SW_CONFIG.CACHE_VERSION,
        SW_CONFIG.SETTINGS_DB,
      );
    }
  });
}

// Support both ES6 modules and importScripts contexts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { setupMessages };
}
