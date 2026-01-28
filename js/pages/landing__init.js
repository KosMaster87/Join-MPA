/**
 * @fileoverview Landing Page Module
 * @description Displays splash screen and redirects users based on authentication status.
 * @module js/pages/landing__init
 * DEPRECATED: Use index.html as landing page instead.
 */

import { onAuthChange } from "../../services/auth.service.js";

const SPLASH_DURATION = 1000; // Duration to show splash screen in ms
const REDIRECT_DELAY = 500; // Additional delay after splash
const CURRENT_PATH = window.location.pathname;
const IS_SUMMARY = CURRENT_PATH.endsWith("/summary.html");
// const IS_SUMMARY = CURRENT_PATH.endsWith('/pages/summary.html');
const IS_LOGIN = CURRENT_PATH.endsWith("/login.html");
// const IS_LOGIN = CURRENT_PATH.endsWith('/pages/login.html');
const IS_INDEX = /\/index\.html$|\/$/.test(window.location.pathname);

/**
 * Initialize landing page
 */
async function initLanding() {
  if (IS_SUMMARY || IS_LOGIN) return;

  let hasRedirected = false;
  const splash = document.getElementById("splashScreen");
  const unsubscribe = onAuthChange((user) => {
    console.log(unsubscribe);

    if (hasRedirected) return;
    hasRedirected = true;
    unsubscribe();
    setTimeout(() => {
      if (user) {
        if (splash) splash.classList.add("splash--hidden");
        setTimeout(() => {
          window.location.href = "./summary.html";
          // window.location.href = "./pages/summary.html";
        }, REDIRECT_DELAY);
      } else {
        if (splash) splash.classList.add("splash--hidden");
        setTimeout(() => {
          window.location.href = "./login.html";
          // window.location.href = "./pages/login.html";
        }, REDIRECT_DELAY);
      }
    }, SPLASH_DURATION);
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

/**
 * Initialize landing page if on index.html
 * If user is logged in, redirect to summary.html, else to login.html
 */
if (IS_INDEX) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLanding);
  } else {
    initLanding();
  }
}
