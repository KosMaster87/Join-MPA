/**
 * @fileoverview Menu navigation functionality.
 * @description Sets up event listeners for menu navigation items
 *              and highlights the active page in the menu.
 * @module layout/menu__navigation
 */

import { navigateToPage } from "../shared/include-html.js";

/**
 * Initializes menu navigation.
 * Sets up event listeners and highlights active page.
 */
function initMenu() {
  setupNavigationListeners();
  highlightActivePage();
}

/**
 * Sets up navigation event listeners for all menu items.
 */
function setupNavigationListeners() {
  const navSummary = document.getElementById("navSummary");
  const navBoard = document.getElementById("navBoard");
  const navAddTask = document.getElementById("navAddTask");
  const navContacts = document.getElementById("navContacts");

  if (navSummary)
    navSummary.addEventListener("click", () => navigateToPage("summary"));
  if (navBoard)
    navBoard.addEventListener("click", () => navigateToPage("board"));
  if (navAddTask)
    navAddTask.addEventListener("click", () => navigateToPage("addTask"));
  if (navContacts)
    navContacts.addEventListener("click", () => navigateToPage("contacts"));
}

/**
 * Highlights the active page in the menu.
 */
function highlightActivePage() {
  const currentPage = getCurrentPageName();
  const menuLinks = document.querySelectorAll(".menu__link");

  menuLinks.forEach((link) => {
    link.classList.remove("menu__link--active");
  });

  const activeLink = document.getElementById(`nav${capitalize(currentPage)}`);
  if (activeLink) {
    activeLink.classList.add("menu__link--active");
  }
}

/**
 * Gets the current page name from URL.
 *
 * @returns {string} - Current page name
 */
function getCurrentPageName() {
  const path = window.location.pathname;
  const page = path.split("/").pop().replace(".html", "");
  return page || "summary";
}

/**
 * Capitalizes first letter of a string.
 *
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { initMenu };
