/**
 * @fileoverview Service Worker Update Service
 * @description Registers the Service Worker and checks for app updates by monitoring SW updates.
 *              Automatically checks periodically and on page load.
 * @module shared/sw-update
 */

let currentVersion = localStorage.getItem("app-version") || "0";
let updateCheckInterval = null;

/**
 * Register the Service Worker
 */
async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log("[SW Register] Service Worker not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
    );
    console.log("[SW Register] Service Worker registered!", registration);
    return registration;
  } catch (error) {
    console.warn("[SW Register] Registration failed:", error);
    return null;
  }
}

/**
 * Initialize the SW update checker
 * Registers the SW and checks for updates on page load and periodically
 */
export function initSwUpdateChecker() {
  if (!("serviceWorker" in navigator)) {
    console.log("[Update Check] Service Worker not supported");
    return;
  }

  // Store initial version
  localStorage.setItem("app-version", currentVersion);

  // Register SW and set up update checking
  window.addEventListener("load", async () => {
    const registration = await registerServiceWorker();

    if (registration) {
      // Check for updates immediately
      registration.update();

      // Check for updates every 30 minutes
      updateCheckInterval = setInterval(() => {
        registration.update();
      }, 30 * 60 * 1000);
    }
  });

  // Listen for SW update messages
  navigator.serviceWorker.addEventListener("message", handleSwMessage);
}

/**
 * Handle messages from Service Worker
 */
function handleSwMessage(event) {
  if (event.data && event.data.type === "SW_UPDATE_AVAILABLE") {
    const newVersion = event.data.version;
    console.log(`[SW Message] Update available: version ${newVersion}`);

    const oldVersion = localStorage.getItem("app-version") || "0";
    if (newVersion !== oldVersion) {
      notifyUpdateAvailable(newVersion);
      localStorage.setItem("app-version", newVersion);
      currentVersion = newVersion;
    }
  }
}

/**
 * Notify user that an update is available
 * Shows a notification and dispatches event
 */
function notifyUpdateAvailable(newVersion) {
  console.log(`[Update Notification] New version ${newVersion} is available`);

  // Create and show browser notification
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Join Update Available", {
      body: "A new version of Join is available. Reload to update.",
      icon: "/assets/theme-dark/icon-192.png",
      badge: "/assets/theme-dark/favicon.png",
    });
  }

  // Dispatch custom event for app to handle (show toast, modal, etc.)
  window.dispatchEvent(
    new CustomEvent("swUpdateAvailable", {
      detail: { version: newVersion },
    }),
  );
}

/**
 * Trigger update check manually
 */
export function checkForUpdatesNow() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
}

/**
 * Stop checking for updates
 */
export function stopUpdateChecker() {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
  navigator.serviceWorker.removeEventListener("message", handleSwMessage);
}

/**
 * Force reload the page with cache busting
 */
export function forceReloadApp() {
  // Tell Service Worker to check for updates
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CHECK_UPDATE",
    });
  }

  // Hard reload after a short delay
  setTimeout(() => {
    window.location.reload(true); // true = bypass cache
  }, 500);
}

// Initialize on module load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSwUpdateChecker);
} else {
  initSwUpdateChecker();
}
