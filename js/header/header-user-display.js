/**
 * @fileoverview Header User Display Module
 * @description Manages user initials display and badge color assignment.
 * @module header/header-user-display
 */

import {
  getUserInitials,
  assignUserBadge,
  assignRandomBadge,
} from "../../services/badge.service.js";

/**
 * Displays user initials in header profile button.
 *
 * @param {Object} userData - User data from Firestore
 */
function displayUserInitials(userData) {
  const initialsElement = document.getElementById("userInitials");
  const profileBtn = document.getElementById("headerProfileBtn");

  if (initialsElement && profileBtn && userData) {
    updateUserInitialsAndBadge(userData, initialsElement, profileBtn);
  }
}

/**
 * Updates user initials and badge color in header.
 *
 * @param {Object} user - Current user object
 * @param {HTMLElement} initialsElement - Initials display element
 * @param {HTMLElement} profileBtn - Profile button element
 */
function updateUserInitialsAndBadge(user, initialsElement, profileBtn) {
  setUserInitialsText(user, initialsElement);
  assignBadgeForUser(user, profileBtn);
}

/**
 * Sets user initials text in display element.
 * Returns "G" for guests, otherwise extracts from name.
 *
 * @param {Object} user - User data object
 * @param {HTMLElement} initialsElement - Element to display initials
 */
function setUserInitialsText(user, initialsElement) {
  if (user.isGuest || !user.name) {
    initialsElement.textContent = "G";
    return;
  }

  const initials = getUserInitials(user.name);
  initialsElement.textContent = initials;
}

/**
 * Assigns appropriate badge color to user profile button.
 * Uses user-specific color if available, otherwise random.
 *
 * @param {Object} user - User data object
 * @param {HTMLElement} profileBtn - Profile button element
 */
function assignBadgeForUser(user, profileBtn) {
  removeBadgeClasses(profileBtn);

  if (user.id) {
    assignUserBadge(user, profileBtn);
  } else {
    assignRandomBadge(profileBtn);
  }
}

/**
 * Removes all badge color classes from profile button.
 * Clears classes badge-1 through badge-16.
 *
 * @param {HTMLElement} profileBtn - Profile button element
 */
function removeBadgeClasses(profileBtn) {
  for (let i = 1; i <= 16; i++) {
    profileBtn.classList.remove(`header__profile-btn--badge-${i}`);
  }
}

export {
  displayUserInitials,
  updateUserInitialsAndBadge,
  setUserInitialsText,
  assignBadgeForUser,
  removeBadgeClasses,
};
