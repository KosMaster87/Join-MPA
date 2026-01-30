/**
 * @fileoverview Theme service for managing application themes
 * @description Provides functions to switch between light, dark, and device themes.
 *              Implements hybrid approach using CSS light-dark() function with manual control.
 *              Integrates with PWA manifest and favicon switching.
 * @module shared/theme-service
 */

const THEMES = ["device", "light", "dark"];
const THEME_ICONS = {
  device: "../assets/img/theme/device.svg",
  light: "../assets/img/theme/light-mode.svg",
  dark: "../assets/img/theme/dark-mode.svg",
};

/**
 * Generate manifest version timestamp
 * @returns {number} Current timestamp in seconds (for cache busting)
 */
function getManifestVersion() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Get manifest URLs with version query parameter
 * @returns {Object} Object with dark and light manifest paths
 */
function getManifestPaths() {
  const version = getManifestVersion();
  return {
    dark: `./assets/manifest-dark.webmanifest?v=${version}`,
    light: `./assets/manifest-light.webmanifest?v=${version}`,
  };
}

const MANIFEST_PATHS = getManifestPaths();

const FAVICON_PATHS = {
  dark: "./assets/theme-dark/favicon.png",
  light: "./assets/theme-light/favicon.png",
};

/**
 * Theme color mapping for meta tag updates
 * @type {Object} Maps theme to theme-color hex value
 */
const THEME_COLORS = {
  dark: "#dfdfdf",
  light: "#ffffff",
};

// ============================================
// Theme Utilities
// ============================================

/**
 * Get next theme in rotation cycle
 * @param {string} current - Current theme (device, light, or dark)
 * @returns {string} Next theme in rotation
 */
function getNextTheme(current) {
  const idx = THEMES.indexOf(current);
  return THEMES[(idx + 1) % THEMES.length];
}

/**
 * Detect system color scheme preference
 * @returns {string} System theme (dark or light)
 */
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// ============================================
// DOM Updates
// ============================================

/**
 * Create manifest link element
 * @param {string} theme - Theme (light or dark)
 * @returns {HTMLLinkElement} Manifest link element with current version
 */
function createManifestLink(theme) {
  const manifest = document.createElement("link");
  const paths = getManifestPaths();
  manifest.rel = "manifest";
  manifest.href = paths[theme];
  return manifest;
}

/**
 * Create favicon link element
 * @param {string} theme - Theme (light or dark)
 * @returns {HTMLLinkElement} Favicon link element
 */
function createFaviconLink(theme) {
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href = FAVICON_PATHS[theme];
  return favicon;
}

/**
 * Remove manifest and icon links from document head
 */
function removeManifestAndFaviconLinks() {
  document
    .querySelectorAll('link[rel="manifest"], link[rel*="icon"]')
    .forEach((el) => el.remove());
}

/**
 * Add manifest and favicon links to document head for theme
 * @param {string} theme - Theme (light or dark)
 */
function addManifestAndFaviconLinks(theme) {
  document.head.appendChild(createManifestLink(theme));
  document.head.appendChild(createFaviconLink(theme));
}

/**
 * Update theme color meta tag for browser UI
 * Handles creation if missing, updates existing tag
 * @private
 * @param {string} theme - Theme (light or dark)
 */
function updateThemeColorMeta(theme) {
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (!metaThemeColor) {
    metaThemeColor = document.createElement("meta");
    metaThemeColor.setAttribute("name", "theme-color");
    document.head.appendChild(metaThemeColor);
  }
  metaThemeColor.setAttribute("content", THEME_COLORS[theme]);
}

/**
 * Update manifest and favicon for theme
 * @param {string} theme - Theme (light or dark)
 */
function updateManifestAndFavicon(theme) {
  removeManifestAndFaviconLinks();
  addManifestAndFaviconLinks(theme);
  updateThemeColorMeta(theme);
}

/**
 * Update theme toggle button icon
 * @param {string} theme - Theme (device, light, or dark)
 */
function updateThemeIcon(theme) {
  const icon = document.getElementById("headerThemeIcon");
  if (icon) {
    icon.src = THEME_ICONS[theme];
  }
}

/**
 * Update summary card icons for specified theme
 * @param {string} theme - Theme (light or dark)
 */
function performSummaryIconUpdate(theme) {
  requestAnimationFrame(() => {
    const isDark = theme === "dark";
    const themeIcons = document.querySelectorAll(
      "[data-theme-light][data-theme-dark]",
    );
    themeIcons.forEach((img) => {
      img.src = isDark ? img.dataset.themeDark : img.dataset.themeLight;
    });
  });
}

/**
 * Update summary icons asynchronously with delay
 * @async
 * @param {string} theme - Theme (light or dark)
 * @returns {Promise<void>}
 */
async function updateSummaryIconsForTheme(theme) {
  return new Promise((resolve) => {
    setTimeout(() => {
      performSummaryIconUpdate(theme);
      resolve();
    }, 100);
  });
}

// ============================================
// Theme Management
// ============================================

/**
 * Apply theme to document with all visual updates
 * @async
 * @param {string} theme - Theme (device, light, or dark)
 */
async function applyTheme(theme) {
  const realTheme = theme === "device" ? getSystemTheme() : theme;
  document.documentElement.setAttribute("data-theme", realTheme);
  updateManifestAndFavicon(realTheme);
  updateThemeIcon(theme);
  await updateSummaryIconsForTheme(realTheme);
  localStorage.setItem("joinTheme", theme);
  syncSettingsWithServiceWorker();
}

/**
 * Apply theme without triggering icon updates
 * @param {string} theme - Theme (device, light, or dark)
 */
function applyThemeWithoutIcons(theme) {
  const realTheme = theme === "device" ? getSystemTheme() : theme;
  document.documentElement.setAttribute("data-theme", realTheme);
  updateManifestAndFavicon(realTheme);
  localStorage.setItem("joinTheme", theme);
}

/**
 * Set and apply theme
 * @async
 * @param {string} theme - Theme to apply (device, light, or dark)
 */
async function setTheme(theme) {
  await applyTheme(theme);
}

/**
 * Initialize theme from local storage
 * @async
 */
async function initTheme() {
  const theme = localStorage.getItem("joinTheme") || "device";
  await applyTheme(theme);
}

/**
 * Handle theme toggle button click event
 */
function handleThemeToggle() {
  const current = localStorage.getItem("joinTheme") || "device";
  const next = getNextTheme(current);
  setTheme(next);
}

/**
 * Setup theme toggle button event listener
 */
function setupThemeToggle() {
  const theme = localStorage.getItem("joinTheme") || "device";
  updateThemeIcon(theme);
  const themeBtn = document.getElementById("headerThemeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", handleThemeToggle);
  }
}

// ============================================
// Service Worker Integration
// ============================================

/**
 * Sync user theme settings with Service Worker
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

// ============================================
// Initialization
// ============================================

/**
 * Get existing manifest link from document
 * @returns {HTMLLinkElement|null} Manifest link element or null
 */
function getExistingManifestLink() {
  return document.querySelector('link[rel="manifest"]');
}

/**
 * Create new manifest link with fresh version
 * @param {string} realTheme - Resolved theme (light or dark)
 * @returns {HTMLLinkElement} New manifest link element
 */
function createFreshManifestLink(realTheme) {
  const freshPaths = getManifestPaths();
  const manifestLink = document.createElement("link");
  manifestLink.rel = "manifest";
  manifestLink.href = freshPaths[realTheme];
  return manifestLink;
}

/**
 * Check if manifest link needs updating
 * @param {HTMLLinkElement} existingLink - Existing manifest link
 * @param {string} realTheme - Resolved theme (light or dark)
 * @returns {boolean} True if link should be updated
 */
function manifestLinkIsStale(existingLink, realTheme) {
  const freshPaths = getManifestPaths();
  return existingLink.href !== freshPaths[realTheme];
}

/**
 * Ensure manifest link is up-to-date with current version
 * @param {string} theme - Theme from localStorage
 */
function ensureManifestIsUpToDate(theme) {
  const realTheme = theme === "device" ? getSystemTheme() : theme;
  const existingLink = getExistingManifestLink();

  if (!existingLink) {
    const freshLink = createFreshManifestLink(realTheme);
    document.head.appendChild(freshLink);
    console.log("[Theme Service] Created manifest link:", freshLink.href);
  } else if (manifestLinkIsStale(existingLink, realTheme)) {
    const freshPaths = getManifestPaths();
    existingLink.href = freshPaths[realTheme];
    console.log("[Theme Service] Updated manifest link:", existingLink.href);
  }
}

/**
 * Initialize theme service on module load
 */
async function initializeThemeService() {
  try {
    const theme = localStorage.getItem("joinTheme") || "device";
    applyThemeWithoutIcons(theme);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setupThemeToggle();
        ensureManifestIsUpToDate(theme);
      });
    } else {
      setupThemeToggle();
      ensureManifestIsUpToDate(theme);
    }
  } catch (error) {
    console.error("[Theme Service] Initialization failed:", error);
  }
}

export {
  THEMES,
  THEME_ICONS,
  getManifestVersion,
  getManifestPaths,
  getNextTheme,
  getSystemTheme,
  createManifestLink,
  createFaviconLink,
  removeManifestAndFaviconLinks,
  updateManifestAndFavicon,
  updateThemeIcon,
  updateSummaryIconsForTheme,
  applyTheme,
  applyThemeWithoutIcons,
  setTheme,
  initTheme,
  handleThemeToggle,
  setupThemeToggle,
  syncSettingsWithServiceWorker,
  ensureManifestIsUpToDate,
  initializeThemeService,
};

initializeThemeService().catch((error) => {
  console.error("[Theme Service] Module initialization error:", error);
});
