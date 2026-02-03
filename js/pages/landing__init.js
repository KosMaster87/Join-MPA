/**
 * @fileoverview Landing Page Module
 * @description Displays splash screen and redirects users based on authentication status
 * @module js/pages/landing__init
 */

import { onAuthChange } from "../../services/auth.service.js";

const SPLASH_DURATION = 1000;
const REDIRECT_DELAY = 500;
const CURRENT_PATH = window.location.pathname;

const PAGE_CONFIG = {
  isSummary: CURRENT_PATH.endsWith("/summary.html"),
  isLogin: CURRENT_PATH.endsWith("/login.html"),
  isIndex: /\/index\.html$|\/$/.test(CURRENT_PATH),
};

/**
 * Initialize landing page
 * Redirects based on authentication status with splash screen
 * @async
 * @returns {Promise<void>}
 */
async function initLanding() {
  if (!PAGE_CONFIG.isIndex) return;
  if (PAGE_CONFIG.isSummary || PAGE_CONFIG.isLogin) return;

  let hasRedirected = false;
  const splashScreen = document.getElementById("splashScreen");
  const unsubscribe = onAuthChange((user) => {
    if (hasRedirected) return;

    hasRedirected = true;
    handleAuthChange(user, splashScreen, unsubscribe);
  });
}

/**
 * Handle user authentication change
 * @async
 * @param {Object} user - User object or null
 * @param {HTMLElement|null} splashScreen - Splash element
 * @param {Function} unsubscribe - Unsubscribe function
 */
async function handleAuthChange(user, splashScreen, unsubscribe) {
  unsubscribe();

  await new Promise((resolve) => {
    setTimeout(resolve, SPLASH_DURATION);
  });

  if (user) {
    redirectToSummary(splashScreen);
  } else {
    redirectToLogin(splashScreen);
  }
}

/**
 * Redirect to summary page
 * @param {HTMLElement|null} splashScreen - Splash element
 */
function redirectToSummary(splashScreen) {
  hideSplashScreen(splashScreen);
  setTimeout(() => {
    performRedirect("./summary.html");
  }, REDIRECT_DELAY);
}

/**
 * Redirect to login page
 * @param {HTMLElement|null} splashScreen - Splash element
 */
function redirectToLogin(splashScreen) {
  hideSplashScreen(splashScreen);
  setTimeout(() => {
    performRedirect("./login.html");
  }, REDIRECT_DELAY);
}

/**
 * Hide splash screen with animation
 * @param {HTMLElement|null} splashScreen - Splash element
 */
function hideSplashScreen(splashScreen) {
  if (splashScreen) {
    splashScreen.classList.add("splash--hidden");
  }
}

/**
 * Perform redirect to target URL
 * @param {string} url - Target URL
 */
function performRedirect(url) {
  window.location.href = url;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLanding);
} else {
  initLanding();
}

export { initLanding };
