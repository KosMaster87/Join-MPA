/**
 * @fileoverview Central splash screen utility for MPA.
 * @description Provides showSplash and hideSplash functions for consistent splash handling.
 * @module services/splash.service
 */

/**
 * Shows the splash screen if present in the DOM.
 */
export function showSplash() {
  const splash = document.getElementById("splashScreen");
  if (splash) splash.classList.remove("splash--hidden");
}

/**
 * Hides the splash screen if present in the DOM.
 */
export function hideSplash() {
  const splash = document.getElementById("splashScreen");
  if (splash) splash.classList.add("splash--hidden");
}
