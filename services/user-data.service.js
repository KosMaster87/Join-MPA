/**
 * @fileoverview User Data Service
 * @description Handles loading and managing user data from Firestore.
 *              Determines user type (guest vs registered) and fetches appropriate data.
 * @module services/user-data.service
 */

import { getCurrentAuthUser } from "./auth.service.js";
import { getItem } from "./data.service.js";

/**
 * Loads current authenticated user's data and stores globally.
 * Sets window.currentUserData and returns the data.
 *
 * @returns {Promise<Object|null>} - User data or null if not authenticated
 */
async function loadCurrentUserData() {
  try {
    const user = getCurrentAuthUser();
    if (!user) return null;

    const userData = await fetchUserDataFromFirestore(user.uid);
    window.currentUserData = userData;
    return userData;
  } catch (error) {
    console.error("[loadCurrentUserData] Error:", error);
    window.currentUserData = null;
    return null;
  }
}

/**
 * Fetches user data from Firestore.
 * Returns null if no user is authenticated or fetch fails.
 *
 * @param {string} userId - User ID to fetch
 * @returns {Promise<Object|null>} - User data object or null
 */
async function fetchUserDataFromFirestore(userId) {
  try {
    const collection = getUserDataCollection();
    const userData = await getItem(collection, userId);
    return userData || null;
  } catch (error) {
    console.error("[fetchUserDataFromFirestore] Error:", error);
    return null;
  }
}

/**
 * Determines which Firestore collection to use based on user type.
 * Guest users store data in "guests" collection, others in "users".
 *
 * @returns {string} - Collection name ("guests" or "users")
 */
function getUserDataCollection() {
  const isGuest = localStorage.getItem("isGuest") === "true";
  return isGuest ? "guests" : "users";
}

export {
  loadCurrentUserData,
  fetchUserDataFromFirestore,
  getUserDataCollection,
};
