/**
 * @fileoverview Central splash screen utility for MPA.
 * @description Provides showSplash and hideSplash functions for consistent splash handling.
 * @module services/splash.service
 */

let splashShownAt = null;

/**
 * Hides the splash screen after a minimum delay for smooth animation.
 * @param {number} minDuration - Mindestdauer in ms, wie lange das Splash mindestens sichtbar bleibt
 */
export function showSplash() {
  const splash = document.getElementById("splashScreen");
  if (splash) splash.classList.remove("splash--hidden");
  splashShownAt = Date.now();
}

/**
 *
 * @param {number} minDuration
 * @returns
 */
export function hideSplashDelayed(minDuration = 800) {
  const splash = document.getElementById("splashScreen");
  if (!splash) return;
  const now = Date.now();
  const elapsed = splashShownAt ? now - splashShownAt : minDuration;
  const delay = Math.max(minDuration - elapsed, 0);
  setTimeout(() => {
    splash.classList.add("splash--hidden");
  }, delay);
}
