/**
 * @fileoverview PWA Install Prompt Manager
 * @description Manages beforeinstallprompt event and manual install trigger
 * @module shared/install-prompt
 */

let deferredPrompt = null;
let canShowInstallPrompt = false;

console.log("[Install Prompt] Module loading...");

// ============================================
// Event Listeners Setup
// ============================================

/**
 * Handle beforeinstallprompt event
 * @param {Event} event - beforeinstallprompt event
 */
function handleBeforeInstallPrompt(event) {
  event.preventDefault();
  deferredPrompt = event;
  canShowInstallPrompt = true;

  console.log(
    "[Install Prompt] beforeinstallprompt fired, storing for manual trigger",
  );

  dispatchCustomEvent("pwaInstallPromptReady", { canInstall: true });
}

/**
 * Handle appinstalled event
 */
function handleAppInstalled() {
  console.log("[Install Prompt] PWA installed successfully");
  deferredPrompt = null;
  canShowInstallPrompt = false;
  dispatchCustomEvent("pwaInstalled", { installed: true });
}

/**
 * Dispatch custom event to window
 * @param {string} eventName - Event name
 * @param {Object} detail - Event detail data
 */
function dispatchCustomEvent(eventName, detail) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

// ============================================
// Public API
// ============================================

/**
 * Initialize install prompt manager
 */
function initInstallPrompt() {
  console.log("[Install Prompt] Initializing...");

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);

  console.log("[Install Prompt] Initialization complete");
}

/**
 * Show the install prompt manually
 * @async
 * @returns {Promise<boolean>} true if user accepted, false otherwise
 */
async function showInstallPrompt() {
  if (!deferredPrompt || !canShowInstallPrompt) {
    console.warn("[Install Prompt] Install prompt not available");
    return false;
  }

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`[Install Prompt] User response: ${outcome}`);

    deferredPrompt = null;
    canShowInstallPrompt = false;

    return outcome === "accepted";
  } catch (error) {
    console.error("[Install Prompt] Error showing prompt:", error);
    return false;
  }
}

/**
 * Check if install prompt is available
 * @returns {boolean} true if PWA can be installed
 */
function isInstallPromptAvailable() {
  return canShowInstallPrompt && deferredPrompt !== null;
}

/**
 * Get the deferred prompt event
 * @returns {Event|null} beforeinstallprompt event or null
 */
function getDeferredPrompt() {
  return deferredPrompt;
}

// ============================================
// Initialization
// ============================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInstallPrompt);
} else {
  initInstallPrompt();
}

export { showInstallPrompt, isInstallPromptAvailable, getDeferredPrompt };
