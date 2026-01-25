/**
 * @fileoverview Landing Page Module
 * @description Displays splash screen and redirects users based on authentication status.
 * @module js/pages/landing__init
 */

import { onAuthChange } from "../../services/auth.service.js";

const SPLASH_DURATION = 2000; // 2 seconds
const REDIRECT_DELAY = 500; // Additional delay after splash
const CURRENT_PATH = window.location.pathname;
const IS_SUMMARY = CURRENT_PATH.endsWith('/pages/summary.html');
const IS_LOGIN = CURRENT_PATH.endsWith('/pages/login.html');
const IS_INDEX = /\/index\.html$|\/$/.test(window.location.pathname);

/**
 * Initialize landing page
 */
async function initLanding() {
  if (IS_SUMMARY || IS_LOGIN) return;

  // Splash-Screen und Delay deaktiviert (Test)
  let hasRedirected = false;
  const unsubscribe = onAuthChange((user) => {
    if (hasRedirected) return;
    hasRedirected = true;
    unsubscribe();
    if (user) {
      window.location.href = "./pages/summary.html";
    } else {
      window.location.href = "./pages/login.html";
    }
  });
}

/**
 * Redirect to target page
 * @param {string} url - Target URL
 * @param {HTMLElement} splashScreen - Splash element
 */
function redirectTo(url, splashScreen) {
  if (splashScreen) splashScreen.classList.add("splash--hidden");
  setTimeout(() => {
    window.location.href = url;
  }, REDIRECT_DELAY);
}

if (IS_INDEX) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLanding);
  } else {
    initLanding();
  }
}
