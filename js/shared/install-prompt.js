/**
 * @fileoverview PWA Install Prompt Manager
 * @description Prevents automatic install prompt from browser and allows manual trigger.
 *              Store the beforeinstallprompt event for later use.
 * @module shared/install-prompt
 */

let deferredPrompt = null;
let canShowInstallPrompt = false;

console.log("[Install Prompt] Module loading...");

/**
 * Initialize install prompt manager
 * Intercepts the beforeinstallprompt event and prevents default behavior
 * Allows manual control of when to show the install prompt
 */
function initInstallPrompt() {
  console.log("[Install Prompt] Initializing...");

  // Prevent automatic install prompt
  window.addEventListener("beforeinstallprompt", (event) => {
    console.log(
      "[Install Prompt] beforeinstallprompt fired, storing for manual trigger",
    );

    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();

    // Store the event for later use
    deferredPrompt = event;
    canShowInstallPrompt = true;

    // Dispatch custom event so app can show its own UI (e.g., button)
    window.dispatchEvent(
      new CustomEvent("pwaInstallPromptReady", {
        detail: { canInstall: true },
      }),
    );
  });

  // Listen for successful installation
  window.addEventListener("appinstalled", () => {
    console.log("[Install Prompt] PWA installed successfully");
    deferredPrompt = null;
    canShowInstallPrompt = false;

    // Dispatch event so app can hide install button
    window.dispatchEvent(
      new CustomEvent("pwaInstalled", { detail: { installed: true } }),
    );
  });

  console.log("[Install Prompt] Initialization complete");
}

/**
 * Show the install prompt manually
 * Call this from a button click handler or custom UI
 *
 * @returns {Promise<boolean>} true if user installed, false otherwise
 */
async function showInstallPrompt() {
  if (!deferredPrompt || !canShowInstallPrompt) {
    console.warn(
      "[Install Prompt] Install prompt not available. Browser may not support PWA installation.",
    );
    return false;
  }

  try {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[Install Prompt] User response: ${outcome}`);

    // Clear the prompt
    deferredPrompt = null;
    canShowInstallPrompt = false;

    return outcome === "accepted";
  } catch (error) {
    console.error("[Install Prompt] Error showing install prompt:", error);
    return false;
  }
}

/**
 * Check if install prompt is available
 *
 * @returns {boolean} true if PWA can be installed
 */
function isInstallPromptAvailable() {
  return canShowInstallPrompt && deferredPrompt !== null;
}

/**
 * Get the deferred prompt (for advanced use cases)
 *
 * @returns {Event|null} The beforeinstallprompt event or null
 */
function getDeferredPrompt() {
  return deferredPrompt;
}

// Initialize on module load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInstallPrompt);
} else {
  initInstallPrompt();
}

// Export for manual use
export { showInstallPrompt, isInstallPromptAvailable, getDeferredPrompt };
