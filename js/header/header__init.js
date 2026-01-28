/**
 * @fileoverview Initializes header functionality, including user menu interactions and logout process.
 * @description Orchestrates event listeners, user display, and authentication handlers.
 * @module header/header__init
 */

import { setupThemeToggle } from "../shared/theme-service.js";
import { setupPageNavigationListeners } from "./header-navigation.js";
import { displayUserInitials } from "./header-user-display.js";
import {
  setupOutsideClickListener,
  setupUserMenuListeners,
} from "./header-user-menu.js";
import { handleLogout } from "./header-auth.js";

/**
 * Initializes header functionality.
 * Sets up all event listeners and displays user information.
 *
 * @param {Object|null} userData - Current user data
 */
function initHeader(userData) {
  setupThemeToggle();
  setupPageNavigationListeners();
  setupOutsideClickListener();
  setupUserMenuListeners(handleLogout);

  if (userData) {
    displayUserInitials(userData);
  }
}

export { initHeader };
