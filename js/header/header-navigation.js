/**
 * @fileoverview Header Navigation Module
 * @description Sets up navigation button listeners for help, legality, and policy pages.
 * @module header/header-navigation
 */

import { navigateToPage } from "../shared/include-html.js";

/**
 * Sets up page navigation button listeners.
 * Handles clicks on help, legality, and policy buttons.
 */
function setupPageNavigationListeners() {
  const navigationBtns = {
    help: document.querySelector(".header__help-btn"),
    legality: document.getElementById("headerLegalityBtn"),
    policy: document.getElementById("headerPolicyBtn"),
  };

  Object.entries(navigationBtns).forEach(([page, btn]) => {
    if (btn) btn.addEventListener("click", () => navigateToPage(page));
  });
}

export { setupPageNavigationListeners };
