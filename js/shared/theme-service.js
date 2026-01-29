/**
 * @fileoverview Theme service for managing application themes.
 * @description Provides functions to switch between light, dark, and device themes.
 *              Implements hybrid approach using CSS light-dark() function with manual control.
 *              Integrates with PWA manifest and favicon switching.
 *              Cache busting handled automatically by Workbox.
 * @module shared/theme-service
 */

const THEMES = ["device", "light", "dark"];
const THEME_ICONS = {
  device: "../assets/img/theme/device.svg",
  light: "../assets/img/theme/light-mode.svg",
  dark: "../assets/img/theme/dark-mode.svg",
};

/**
 * Gets the next theme in the rotation cycle.
 *
 * @param {string} current - Current theme ("device", "light", or "dark")
 * @returns {string} Next theme in the cycle
 */
function getNextTheme(current) {
  const idx = THEMES.indexOf(current);
  return THEMES[(idx + 1) % THEMES.length];
}

/**
 * Gets the system theme preference.
 *
 * @returns {string} System theme ("dark" or "light")
 */
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Applies the selected theme to the document with hybrid approach.
 * Sets data-theme attribute and updates manifest + favicon.
 * Syncs settings with Service Worker for PWA persistence.
 *
 * @param {string} theme - Theme to apply ("device", "light", or "dark")
 */
async function applyTheme(theme) {
  const realTheme = theme === "device" ? getSystemTheme() : theme;
  console.log("Applying theme:", theme, "Real theme:", realTheme);

  document.documentElement.setAttribute("data-theme", realTheme);

  updateManifestAndFavicon(realTheme);
  updateThemeIcon(theme);

  // Only update summary icons if they exist in DOM
  await updateSummaryIconsForTheme(realTheme);

  localStorage.setItem("joinTheme", theme);

  // Sync settings with Service Worker for PWA
  syncSettingsWithServiceWorker();
}

/**
 * Applies theme to document without updating icons.
 * Used during initial service setup when icons may not be in DOM yet.
 *
 * @param {string} theme - Theme to apply ("device", "light", or "dark")
 */
function applyThemeWithoutIcons(theme) {
  const realTheme = theme === "device" ? getSystemTheme() : theme;

  document.documentElement.setAttribute("data-theme", realTheme);

  updateManifestAndFavicon(realTheme);
  localStorage.setItem("joinTheme", theme);
}

/**
 * Updates PWA manifest and favicon based on theme.
 *
 * @param {string} theme - Theme ("light" or "dark")
 */
function updateManifestAndFavicon(theme) {
  const head = document.head;

  document
    .querySelectorAll('link[rel="manifest"], link[rel*="icon"]')
    .forEach((el) => el.remove());

  const manifest = document.createElement("link");

  manifest.rel = "manifest";
  // Workbox handles cache busting automatically via StaleWhileRevalidate strategy
  manifest.href =
    theme === "dark"
      ? "./assets/manifest-dark.webmanifest"
      : "./assets/manifest-light.webmanifest";
  head.appendChild(manifest);

  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href =
    theme === "dark"
      ? "./assets/theme-dark/favicon.png"
      : "./assets/theme-light/favicon.png";
  head.appendChild(favicon);
}

/**
 * Updates theme toggle button icon.
 *
 * @param {string} theme - Theme ("device", "light", or "dark")
 */
function updateThemeIcon(theme) {
  const icon = document.getElementById("headerThemeIcon");
  if (icon) {
    icon.src = THEME_ICONS[theme];
  }
}

/**
 * Saves and applies a theme.
 *
 * @param {string} theme - Theme to save and apply ("device", "light", or "dark")
 */
function setTheme(theme) {
  applyTheme(theme);
}

/**
 * Initializes theme on page load from localStorage.
 */
function initTheme() {
  const theme = localStorage.getItem("joinTheme") || "device";
  applyTheme(theme);
}

/**
 * Updates summary card icons to use theme-specific SVGs.
 * Looks for images with data-theme-light and data-theme-dark attributes
 * and swaps their src based on the current theme.
 * Returns a Promise that resolves when icons are updated.
 *
 * @param {string} theme - Theme ("light" or "dark")
 * @returns {Promise<void>}
 */
// function updateSummaryIconsForTheme(theme) {
//   return new Promise((resolve) => {
//     requestAnimationFrame(() => {
//       const themeIcons = document.querySelectorAll(
//         "[data-theme-light][data-theme-dark]",
//       );
//       const isDark = theme === "dark";

//       themeIcons.forEach((img) => {
//         img.src = isDark ? img.dataset.themeDark : img.dataset.themeLight;
//       });

//       resolve();
//     });
//   });
// }
// Fallback mit Timer - TODO: Entfernen, wenn nicht mehr benötigt
function updateSummaryIconsForTheme(theme) {
  return new Promise((resolve) => {
    // Use small timeout to ensure DOM is fully rendered, especially on fast connections
    setTimeout(() => {
      requestAnimationFrame(() => {
        const themeIcons = document.querySelectorAll(
          "[data-theme-light][data-theme-dark]",
        );
        const isDark = theme === "dark";

        themeIcons.forEach((img) => {
          img.src = isDark ? img.dataset.themeDark : img.dataset.themeLight;
        });

        resolve();
      });
    }, 100);
  });
}

/**
 * Sets up theme toggle button listener and initializes theme on page load.
 * Called whenever header is loaded/reloaded.
 */
function setupThemeToggle() {
  const theme = localStorage.getItem("joinTheme") || "device";

  // Update header icon to match current theme
  updateThemeIcon(theme);

  const themeBtn = document.getElementById("headerThemeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", handleThemeToggle);
  }
}

/**
 * Initializes the theme service on module load.
 * Sets data-theme attribute without updating icons (they don't exist yet).
 * Called automatically when this module is imported.
 */
function initializeThemeService() {
  const theme = localStorage.getItem("joinTheme") || "device";
  // Use applyThemeWithoutIcons to avoid updating icons that don't exist yet
  applyThemeWithoutIcons(theme);

  // Set up theme toggle listener when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupThemeToggle);
  } else {
    setupThemeToggle();
  }
}

/**
 * Handles theme toggle click event.
 */
function handleThemeToggle() {
  const current = localStorage.getItem("joinTheme") || "device";
  const next = getNextTheme(current);
  setTheme(next);
}

/**
 * Syncs application settings with the Service Worker.
 * Sends current settings from localStorage to the SW for persistence.
 * This ensures settings are maintained across page reloads in PWA mode.
 */
function syncSettingsWithServiceWorker() {
  if ("serviceWorker" in navigator) {
    const settings = {
      joinTheme: localStorage.getItem("joinTheme") || "device",
    };

    navigator.serviceWorker.controller?.postMessage({
      type: "SYNC_SETTINGS",
      payload: settings,
    });
  }
}

export {
  THEMES,
  THEME_ICONS,
  getNextTheme,
  getSystemTheme,
  applyTheme,
  // applyThemeWithoutIcons,
  setTheme,
  initTheme,
  setupThemeToggle,
  handleThemeToggle,
  updateSummaryIconsForTheme,
  syncSettingsWithServiceWorker,
};

initializeThemeService();
