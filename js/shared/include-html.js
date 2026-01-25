/**
 * @fileoverview HTML Inclusion and Navigation Utility
 * @description Provides functions to dynamically include external HTML files (header, menu)
 *              into the current page and handle page navigation with authentication checks.
 *              Uses w3-include-html attribute to load templates.
 * @module js/shared/include-html
 */

/**
 * Includes external HTML content by loading files specified in w3-include-html attributes.
 * Elements with the attribute `w3-include-html` will be replaced with the fetched content.
 * If the file is not found, it displays "Page not found".
 *
 * @returns {Promise<void>} - Resolves when all includes are loaded
 * @example
 * // In HTML:
 * // <div w3-include-html="./assets/templates/header.html"></div>
 * // In JavaScript:
 * // await includeHTML();
 */
async function includeHTML() {
  const includeElements = document.querySelectorAll("[w3-include-html]");

  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    const file = element.getAttribute("w3-include-html");

    try {
      const response = await fetch(file);
      if (response.ok) {
        element.innerHTML = await response.text();
      } else {
        element.innerHTML = "Page not found";
        console.error(`Failed to load template: ${file}`);
      }
    } catch (error) {
      element.innerHTML = "Error loading content";
      console.error(`Error loading template ${file}:`, error);
    }
  }
}

/**
 * Navigates to a protected page after checking authentication status.
 * If user is logged in, navigates to the specified page.
 * If not logged in, redirects to the login page.
 *
 * @param {string} pageName - The name of the page to navigate to (without .html extension)
 * @example
 * // navigateToPage('board'); // Goes to board.html if authenticated
 */
function navigateToPage(pageName) {
  const currentUserId = localStorage.getItem("currentUserId");

  if (currentUserId) {
    window.location.href = `./${pageName}.html`;
    // window.location.href = `./pages/${pageName}.html`;
  } else {
    window.location.href = "./index.html";
  }
}

/**
 * Navigates to a page without authentication check.
 * Used for public pages like help, legal notice, privacy policy.
 *
 * @param {string} pageName - The name of the page to navigate to (without .html extension)
 * @example
 * // navigateToPublicPage('help'); // Goes to help.html
 */
function navigateToPublicPage(pageName) {
  window.location.href = `./${pageName}.html`;
  // window.location.href = `./pages/${pageName}.html`;
}

/**
 * Redirects to login page (index.html).
 * Used when user logs out or session expires.
 * Detects if called from pages/ subdirectory or root.
 */
function redirectToLogin() {
  const isInPagesFolder = window.location.pathname.includes("/");
  // const isInPagesFolder = window.location.pathname.includes("/pages/");
  window.location.href = isInPagesFolder ? "../index.html" : "./index.html";
}

/**
 * Checks if user is authenticated on page load.
 * Redirects to login if not authenticated.
 * Call this function on protected pages during initialization.
 *
 * @returns {boolean} - True if authenticated, false otherwise
 */
function checkAuthentication() {
  const currentUserId = localStorage.getItem("currentUserId");

  if (!currentUserId) {
    redirectToLogin();
    return false;
  }

  return true;
}

export {
  includeHTML,
  navigateToPage,
  navigateToPublicPage,
  redirectToLogin,
  checkAuthentication,
};
