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
import { getUserInitials } from "../../services/data.service.js";
import { navigateToPage } from "../shared/include-html.js";

/**
 * Initializes header functionality.
 * Sets up event listeners and displays user initials.
 */
function initHeader() {
  setupEventListeners();
  displayUserInitials();
}

/**
 * Sets up all header event listeners.
 */
function setupEventListeners() {
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
async function displayUserInitials() {
  const user = getCurrentAuthUser();
  const initialsElement = document.getElementById("userInitials");

  if (!initialsElement) return;

  if (user && user.email !== "guest@join.com") {
    const initials = getUserInitials(user.displayName || user.email);
    initialsElement.textContent = initials;
  } else {
    initialsElement.textContent = "G";
  }
}

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
    await signOutUser();
    localStorage.removeItem("joinUser");
    sessionStorage.removeItem("joinUser");
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

export { initHeader };
