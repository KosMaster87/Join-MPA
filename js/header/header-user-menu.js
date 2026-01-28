/**
 * @fileoverview Header User Menu Module
 * @description Handles user menu dropdown toggle and outside click detection.
 * @module header/header-user-menu
 */

/**
 * Toggles user menu dropdown visibility.
 * Shows/hides menu and updates profile button active state.
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
 * Closes user menu when clicking outside of it.
 *
 * @param {MouseEvent} event - Click event object
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

/**
 * Sets up user menu button listeners.
 * Handles profile button toggle and logout actions.
 *
 * @param {Function} onLogout - Callback function for logout button
 */
function setupUserMenuListeners(onLogout) {
  const profileBtn = document.getElementById("headerProfileBtn");
  const logoutBtn = document.getElementById("headerLogoutBtn");

  if (profileBtn) profileBtn.addEventListener("click", toggleUserMenu);
  if (logoutBtn) logoutBtn.addEventListener("click", onLogout);
}

/**
 * Sets up outside click listener for closing user menu.
 */
function setupOutsideClickListener() {
  document.addEventListener("click", handleOutsideClick);
}

export {
  toggleUserMenu,
  handleOutsideClick,
  setupOutsideClickListener,
  setupUserMenuListeners,
};
