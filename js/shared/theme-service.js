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

const FAVICON_PATHS = {
  dark: "./assets/theme-dark/favicon.png",
  light: "./assets/theme-light/favicon.png",
};

const THEME_COLOR_VARIABLES = {
  auth: "--bg-primary",
  app: "--bg-header",
};

let systemThemeListener = null;

/**
 * Generate manifest version timestamp
 * @returns {number} Current timestamp in seconds
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

/**
 * Get theme color from CSS variables
 * @param {string} context - Page context ('auth' or 'app')
 * @returns {string} Hex color value from CSS variable
 */
function getThemeColorFromCSS(context) {
  const varName = THEME_COLOR_VARIABLES[context];
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return color || "#dfdfdf";
}

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

/**
 * Remove existing system theme listener
 * @private
 */
function removeExistingListener() {
  if (systemThemeListener) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", systemThemeListener);
    systemThemeListener = null;
  }
}

/**
 * Handle system theme change event
 * @param {MediaQueryListEvent} event - Media query change event
 */
function handleSystemThemeChange(event) {
  const newSystemTheme = event.matches ? "dark" : "light";
  console.log(`[Theme Service] System theme changed to: ${newSystemTheme}`);
  document.documentElement.setAttribute("data-theme", newSystemTheme);
  updateManifestAndFavicon(newSystemTheme);
  updateThemeIcon("device");
  performSummaryIconUpdate(newSystemTheme);
  syncSettingsWithServiceWorker();
}

/**
 * Attach listener to media query
 * @private
 */
function attachMediaQueryListener() {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", systemThemeListener);
  console.log("[Theme Service] System theme listener activated");
}

/**
 * Setup listener for system theme changes
 */
function setupSystemThemeListener() {
  removeExistingListener();
  const currentTheme = localStorage.getItem("joinTheme") || "device";
  if (currentTheme !== "device") return;
  systemThemeListener = handleSystemThemeChange;
  attachMediaQueryListener();
}

/**
 * Remove system theme listener
 */
function removeSystemThemeListener() {
  removeExistingListener();
  console.log("[Theme Service] System theme listener removed");
}

/**
 * Create manifest link element
 * @param {string} theme - Theme (light or dark)
 * @returns {HTMLLinkElement} Manifest link element
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
 * Add manifest and favicon links to document head
 * @param {string} theme - Theme (light or dark)
 */
function addManifestAndFaviconLinks(theme) {
  document.head.appendChild(createManifestLink(theme));
  document.head.appendChild(createFaviconLink(theme));
}

/**
 * Detect current page context
 * @returns {string} Context ('auth' or 'app')
 */
function getPageContext() {
  const path = window.location.pathname;
  const isAuthPage =
    path.includes("/index.html") ||
    path.includes("/login.html") ||
    path.includes("/register.html") ||
    path === "/" ||
    /\/$/.test(path);
  return isAuthPage ? "auth" : "app";
}

/**
 * Get or create theme color meta tag
 * @returns {HTMLMetaElement} Theme color meta element
 */
function getOrCreateThemeColorMeta() {
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (!metaThemeColor) {
    metaThemeColor = document.createElement("meta");
    metaThemeColor.setAttribute("name", "theme-color");
    document.head.appendChild(metaThemeColor);
  }
  return metaThemeColor;
}

/**
 * Update theme color meta tag for browser UI
 * @param {string} theme - Theme (light or dark)
 */
function updateThemeColorMeta(theme) {
  const metaThemeColor = getOrCreateThemeColorMeta();
  const context = getPageContext();
  const color = getThemeColorFromCSS(context);
  metaThemeColor.setAttribute("content", color);
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
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        performSummaryIconUpdate(theme);
        resolve();
      }, 100);
    });
  } catch (error) {
    console.error("[Theme Service] Icon update failed:", error);
  }
}

/**
 * Set theme in local storage
 * @param {string} theme - Theme to store
 */
function storeTheme(theme) {
  localStorage.setItem("joinTheme", theme);
}

/**
 * Apply theme to document root
 * @param {string} theme - Theme to apply
 * @param {string} realTheme - Resolved theme (light or dark)
 */
function applyThemeToDocument(theme, realTheme) {
  storeTheme(theme);
  document.documentElement.setAttribute("data-theme", realTheme);
  void document.documentElement.offsetHeight;
}

/**
 * Apply theme with all visual updates
 * @async
 * @param {string} theme - Theme (device, light, or dark)
 */
async function applyTheme(theme) {
  try {
    const realTheme = theme === "device" ? getSystemTheme() : theme;
    applyThemeToDocument(theme, realTheme);
    updateManifestAndFavicon(realTheme);
    updateThemeIcon(theme);
    await updateSummaryIconsForTheme(realTheme);
    syncSettingsWithServiceWorker();
    setupSystemThemeListener();
  } catch (error) {
    console.error("[Theme Service] Apply theme failed:", error);
  }
}

/**
 * Apply theme without icon updates
 * @param {string} theme - Theme (device, light, or dark)
 */
function applyThemeWithoutIcons(theme) {
  const realTheme = theme === "device" ? getSystemTheme() : theme;
  applyThemeToDocument(theme, realTheme);
  updateManifestAndFavicon(realTheme);
  syncSettingsWithServiceWorker();
  setupSystemThemeListener();
}

/**
 * Set and apply theme
 * @async
 * @param {string} theme - Theme to apply (device, light, or dark)
 */
async function setTheme(theme) {
  try {
    await applyTheme(theme);
  } catch (error) {
    console.error("[Theme Service] Set theme failed:", error);
  }
}

/**
 * Initialize theme from local storage
 * @async
 */
async function initTheme() {
  try {
    const theme = localStorage.getItem("joinTheme") || "device";
    await applyTheme(theme);
  } catch (error) {
    console.error("[Theme Service] Init theme failed:", error);
  }
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
 * Update existing manifest link href
 * @param {HTMLLinkElement} link - Manifest link element
 * @param {string} realTheme - Resolved theme (light or dark)
 */
function updateManifestLinkHref(link, realTheme) {
  const freshPaths = getManifestPaths();
  link.href = freshPaths[realTheme];
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
  } else if (manifestLinkIsStale(existingLink, realTheme)) {
    updateManifestLinkHref(existingLink, realTheme);
  }
}

/**
 * Setup theme on DOMContentLoaded
 * @param {string} theme - Theme to setup
 */
function setupThemeOnLoad(theme) {
  setupThemeToggle();
  ensureManifestIsUpToDate(theme);
}

/**
 * Initialize theme service on module load
 * @async
 */
async function initializeThemeService() {
  try {
    const theme = localStorage.getItem("joinTheme") || "device";
    applyThemeWithoutIcons(theme);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        setupThemeOnLoad(theme),
      );
    } else {
      setupThemeOnLoad(theme);
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
  setupSystemThemeListener,
  removeSystemThemeListener,
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
