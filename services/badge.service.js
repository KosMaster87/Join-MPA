/**
 * @fileoverview Badge and initials utilities for consistent user visuals.
 * @description Provides functions to generate user initials, assign consistent badge colors
 *              based on user ID, and generate random colors for guest users.
 * @module services/badge.service
 */

/**
 * Simple hash function to generate consistent number from string.
 *
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Assigns consistent badge color based on user ID.
 *
 * @param {Object} user - User object
 * @param {HTMLElement} profileBtn - Profile button element
 */
function assignUserBadge(user, profileBtn) {
  const userId = user.uid || user.email;
  const badgeNumber = (hashString(userId) % 16) + 1;
  profileBtn.classList.add(`header__profile-btn--badge-${badgeNumber}`);
}

/**
 * Assigns random badge color for guest users.
 *
 * @param {HTMLElement} profileBtn - Profile button element
 */
function assignRandomBadge(profileBtn) {
  const randomBadge = Math.floor(Math.random() * 16) + 1;
  profileBtn.classList.add(`header__profile-btn--badge-${randomBadge}`);
}

/**
 * Generates a random color from the predefined badge colors.
 * Uses the 16 badge colors defined in CSS variables (--color-badge-1 to --color-badge-16).
 *
 * @returns {string} - Random hex color (e.g., "#ff7a00")
 */
function generateRandomColor() {
  const colors = [
    "#ff7a00", // --color-badge-1
    "#9327ff", // --color-badge-2
    "#6e52ff", // --color-badge-3
    "#fc71ff", // --color-badge-4
    "#ffbb2b", // --color-badge-5
    "#1fd7c1", // --color-badge-6
    "#462f8a", // --color-badge-7
    "#ff4646", // --color-badge-8
    "#00bee8", // --color-badge-9
    "#ffe62b", // --color-badge-10
    "#c3ff2b", // --color-badge-11
    "#0038ff", // --color-badge-12
    "#ffc701", // --color-badge-13
    "#ff745e", // --color-badge-14
    "#ffa35e", // --color-badge-15
    "#ff5eb3", // --color-badge-16
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Gets user initials from name.
 *
 * @param {string} name - User's full name
 * @returns {string} - User initials (max 2 characters)
 * @example
 * getUserInitials("John Doe"); // Returns "JD"
 */
function getUserInitials(name) {
  if (!name) return "??";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export {
  hashString,
  assignUserBadge,
  assignRandomBadge,
  generateRandomColor,
  getUserInitials,
};
