/**
 * @fileoverview Initializes header functionality, including user menu interactions and logout process.
 * @description Sets up event listeners for header buttons, displays user initials,
 *             and handles user logout by interacting with the authentication service.
 * @module layout/header__init
 */

import {
  getCurrentAuthUser,
  signOutUser,
} from "../../services/auth.service.js";
import {
  getUserInitials,
  assignUserBadge,
  assignRandomBadge,
  hashString
} from "../../services/badge.service.js";
import { navigateToPage } from "../shared/include-html.js";
import { showSplash } from "../../services/splash.service.js";
import { THEMES, THEME_ICONS, getNextTheme, applyTheme, setTheme, initTheme } from "../shared/theme-service.js";

/**
 * Initializes header functionality.
 * Sets up event listeners and displays user initials.
 */
function initHeader(userData) {
  setupEventListeners();
  if (userData) displayUserInitials(userData);
}

/**
 * Sets up all header event listeners.
 */
function setupEventListeners() {
  // Theme toggle button
  const themeBtn = document.getElementById("headerThemeBtn");
  if (themeBtn) themeBtn.addEventListener("click", () => {
    const current = localStorage.getItem("joinTheme") || "device";
    const next = getNextTheme(current);
    setTheme(next);
  });

  // Init theme on load (only once)
  document.addEventListener("DOMContentLoaded", initTheme);

  const profileBtn = document.getElementById("headerProfileBtn");
  const helpBtn = document.querySelector(".header__help-btn");
  const legalityBtn = document.getElementById("headerLegalityBtn");
  const policyBtn = document.getElementById("headerPolicyBtn");
  const logoutBtn = document.getElementById("headerLogoutBtn");

  if (profileBtn) profileBtn.addEventListener("click", toggleUserMenu);
  if (helpBtn) helpBtn.addEventListener("click", () => navigateToPage("help"));
  if (legalityBtn)
    legalityBtn.addEventListener("click", () => navigateToPage("legality"));
  if (policyBtn)
    policyBtn.addEventListener("click", () => navigateToPage("policy"));
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  document.addEventListener("click", handleOutsideClick);
}

/**
 * Displays user initials in the header profile button.
 */
function displayUserInitials(userData) {
  const initialsElement = document.getElementById("userInitials");
  const profileBtn = document.getElementById("headerProfileBtn");

  setUserInitialsAndBadge(userData, initialsElement, profileBtn);
}

/**
 * Removes all badge color classes from profile button.
 *
 * @param {HTMLElement} profileBtn - Profile button element
 */
function removeBadgeClasses(profileBtn) {
  for (let i = 1; i <= 16; i++) {
    profileBtn.classList.remove(`header__profile-btn--badge-${i}`);
  }
}

/**
 * Sets user initials and assigns badge color.
 *
 * @param {Object} user - Current user object
 * @param {HTMLElement} initialsElement - Initials display element
 * @param {HTMLElement} profileBtn - Profile button element
 */
function setUserInitialsAndBadge(user, initialsElement, profileBtn) {
  removeBadgeClasses(profileBtn);

  if (user.isGuest || !user.name) {
    initialsElement.textContent = "G";
    assignRandomBadge(profileBtn);
    return;
  }

  const initials = getUserInitials(user.name);
  initialsElement.textContent = initials;
  if (user.id) {
    assignUserBadge(user, profileBtn);
  } else {
    assignRandomBadge(profileBtn);
  }
}

/**
 * Assigns consistent badge color based on user ID.
 *
 * @param {Object} user - User object
 * @param {HTMLElement} profileBtn - Profile button element
 */

/**
 * Toggles the visibility of the user menu dropdown.
 */
function toggleUserMenu() {
  const menu = document.getElementById("headerUserMenu");
  if (!menu) return;

  const isHidden = menu.hasAttribute("hidden");
  if (isHidden) {
    menu.removeAttribute("hidden");
  } else {
    menu.setAttribute("hidden", "");
  }
}

/**
 * Closes user menu when clicking outside.
 *
 * @param {MouseEvent} event - Click event
 */
function handleOutsideClick(event) {
  const menu = document.getElementById("headerUserMenu");
  const profileBtn = document.getElementById("headerProfileBtn");

  if (!menu || !profileBtn) return;

  const isClickInside =
    menu.contains(event.target) || profileBtn.contains(event.target);
  if (!isClickInside && !menu.hasAttribute("hidden")) {
    menu.setAttribute("hidden", "");
  }
}

/**
 * Handles user logout.
 * Signs out user and redirects to login page.
 */
async function handleLogout() {
  try {
    showSplash();
    await signOutUser();
    localStorage.removeItem("joinUser");
    sessionStorage.removeItem("joinUser");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

export { initHeader };
