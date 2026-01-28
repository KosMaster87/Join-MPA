/**
 * @fileoverview PWA theme loader for dynamic manifest and favicon switching.
 * @description Initializes theme on page load by calling theme-service.
 *              The theme-service handles manifest and favicon switching.
 * @module shared/pwa-theme-loader
 */

import { initTheme } from "./theme-service.js";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}
