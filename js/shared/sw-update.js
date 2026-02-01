/**
 * @fileoverview Service Worker Update Service
 * @description Registers and monitors Service Worker updates, handles app versioning
 * @module shared/sw-update
 */

// Update check configuration - Keep in sync with config/sw-constants.js
// Service Worker config cannot be imported as ES6 module, so we define critical values here
const UPDATE_CHECK_INTERVAL = 1 * 60 * 1000; // 1 minute for development (change to 5-30 min for production)

let currentVersion = localStorage.getItem("app-version") || "0";
let updateCheckInterval = null;

/**
 * Register the Service Worker
 * @async
 * @returns {Promise<ServiceWorkerRegistration|null>} Registration object or null
 */
async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log("[SW Register] Service Worker not supported");
    return null;
  }

  try {
    const registration =
      await navigator.serviceWorker.register("/service-worker.js");
    console.log("[SW Register] Service Worker registered!", registration);
    return registration;
  } catch (error) {
    console.warn("[SW Register] Registration failed:", error);
    return null;
  }
}

// ============================================
// Update Checking
// ============================================

/**
 * Setup update checking on page load
 * @async
 */
async function setupUpdateListeners() {
  const registration = await registerServiceWorker();
  if (!registration) return;

  registration.addEventListener("updatefound", handleUpdateFound);
  await performInitialUpdateCheck();
  startPeriodicUpdateChecks();
}

/**
 * Handle update found event
 * @param {Event} event - Update found event
 */
function handleUpdateFound(event) {
  const registration = event.target;
  const newWorker = registration.installing;

  if (newWorker) {
    newWorker.addEventListener("statechange", () => {
      if (
        newWorker.state === "installed" &&
        navigator.serviceWorker.controller
      ) {
        console.log("[SW Update] New version ready to install");
        storeVersionAndNotifyClients();
      }
    });
  }
}

/**
 * Perform initial update check with delay
 * @async
 */
async function performInitialUpdateCheck() {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        await updateServiceWorker();
      } catch (error) {
        console.debug("[SW Update] Initial check failed:", error);
      }
      resolve();
    }, 1000);
  });
}

/**
 * Start periodic update checks using configured interval
 */
function startPeriodicUpdateChecks() {
  updateCheckInterval = setInterval(
    async () => {
      try {
        if (!("serviceWorker" in navigator)) return;
        await updateServiceWorker();
      } catch (error) {
        console.debug("[SW Update] Periodic check failed:", error);
      }
    },
    UPDATE_CHECK_INTERVAL,
  );
}

/**
 * Update Service Worker with error handling
 * @async
 * @private
 */
async function updateServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log("[SW Update] Service Worker context unavailable");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration) {
      await registration.update();
    }
  } catch (error) {
    const errorMsg = error.toString();
    const shouldIgnore =
      errorMsg.includes("uninstalled") ||
      errorMsg.includes("not, or is no longer");

    if (!shouldIgnore) {
      throw error;
    }
  }
}

// ============================================
// Message Handling
// ============================================

/**
 * Handle messages from Service Worker
 * @param {MessageEvent} event - Message from SW
 */
function handleSwMessage(event) {
  const { data } = event;
  if (!data) return;

  if (data.type === "SW_UPDATE_AVAILABLE") {
    handleUpdateAvailable(data.version);
  } else if (data.type === "SW_ACTIVATED") {
    handleSwActivated(data.version);
  }
}

/**
 * Handle SW_UPDATE_AVAILABLE message
 * @param {string} newVersion - New version from SW
 */
function handleUpdateAvailable(newVersion) {
  console.log(`[SW Message] Update available: version ${newVersion}`);

  const oldVersion = localStorage.getItem("app-version") || "0";
  if (newVersion !== oldVersion) {
    notifyUpdateAvailable(newVersion);
    localStorage.setItem("app-version", newVersion);
    currentVersion = newVersion;
  }
}

/**
 * Handle SW_ACTIVATED message - triggers page reload
 * @param {string} activatedVersion - Activated SW version
 */
function handleSwActivated(activatedVersion) {
  console.log(
    `[SW Message] Service Worker activated: version ${activatedVersion}`,
  );

  const storedVersion = localStorage.getItem("app-version");
  if (storedVersion && storedVersion !== activatedVersion) {
    console.log("[SW Message] New version detected, reloading page...");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}

// ============================================
// Notifications
// ============================================

/**
 * Notify user about available update
 * @param {string} newVersion - New version string
 */
function notifyUpdateAvailable(newVersion) {
  console.log(`[Update Notification] New version ${newVersion} available`);

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Join Update Available", {
      body: "A new version of Join is available. Reload to update.",
      icon: "/assets/theme-dark/icon-192.png",
      badge: "/assets/theme-dark/favicon.png",
    });
  }

  window.dispatchEvent(
    new CustomEvent("swUpdateAvailable", { detail: { version: newVersion } }),
  );
}

// ============================================
// Storage
// ============================================

/**
 * Store version and notify clients
 * @async
 */
async function storeVersionAndNotifyClients() {
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.installing) {
      notifyUpdateAvailable(currentVersion);
    }
  } catch (error) {
    console.error("[SW Update] Failed to store version:", error);
  }
}

// ============================================
// Public API
// ============================================

/**
 * Initialize Service Worker update checker
 * @async
 */
async function initSwUpdateChecker() {
  if (!("serviceWorker" in navigator)) {
    console.log("[Update Check] Service Worker not supported");
    return;
  }

  localStorage.setItem("app-version", currentVersion);

  window.addEventListener("load", setupUpdateListeners);
  navigator.serviceWorker.addEventListener("message", handleSwMessage);
}

/**
 * Manually trigger update check
 * @async
 */
async function checkForUpdatesNow() {
  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  } catch (error) {
    console.error("[SW Update] Manual check failed:", error);
  }
}

/**
 * Stop update checker and cleanup listeners
 */
function stopUpdateChecker() {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
  navigator.serviceWorker.removeEventListener("message", handleSwMessage);
}

/**
 * Force reload app with cache bypass
 */
function forceReloadApp() {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "CHECK_UPDATE" });
  }

  setTimeout(() => {
    window.location.reload(true);
  }, 500);
}

// ============================================
// Initialization
// ============================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSwUpdateChecker);
} else {
  initSwUpdateChecker();
}

export {
  initSwUpdateChecker,
  checkForUpdatesNow,
  stopUpdateChecker,
  forceReloadApp,
};
