/**
 * @fileoverview Initializes header functionality, including user menu interactions and logout process.
 * @description Sets up event listeners for header buttons, displays user initials,
 *             and handles user logout by interacting with the authentication service.
 * @module layout/header__init
 */

import { signOutUser } from "../../services/auth.service.js";
import {
  getUserInitials,
  assignUserBadge,
  assignRandomBadge,
} from "../../services/badge.service.js";
import { navigateToPage } from "../shared/include-html.js";
import { showSplash } from "../../services/splash.service.js";
import { setupThemeToggle } from "../shared/theme-service.js";

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
  setupThemeToggle();
  setupPageNavigationListeners();
  setupUserMenuListeners();
  setupOutsideClickListener();
}

/**
 * Sets up navigation button listeners (help, legality, policy).
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

/**
 * Sets up user menu and logout listeners.
 */
function setupUserMenuListeners() {
  const profileBtn = document.getElementById("headerProfileBtn");
  const logoutBtn = document.getElementById("headerLogoutBtn");

  if (profileBtn) profileBtn.addEventListener("click", toggleUserMenu);
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
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
 * Toggles the visibility of the user menu dropdown.
 */
function toggleUserMenu() {
  const menu = document.getElementById("headerUserMenu");
  const profileBtn = document.getElementById("headerProfileBtn");
  if (!menu || !profileBtn) return;

  const isHidden = menu.hasAttribute("hidden");

  if (isHidden) {
    menu.removeAttribute("hidden");
    profileBtn.classList.add("is-active");
  } else {
    menu.setAttribute("hidden", "");
    profileBtn.classList.remove("is-active");
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

/**
 * Sets up outside click handler for closing user menu.
 */
function setupOutsideClickListener() {
  document.addEventListener("click", handleOutsideClick);
}

/**
 * Closes user menu when clicking outside.
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
    profileBtn.classList.remove("is-active");
  }
}

export { initHeader };
