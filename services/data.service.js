/**
 * @fileoverview Data access layer for Firestore operations
 * @description Provides higher-level CRUD operations for specific collections (users, tasks, contacts).
 *              Handles data transformation, validation, and business logic.
 * @module services/data.service
 */

import {
  getDocument,
  setDocument,
  getAllDocuments,
  updateDocument,
  queryDocuments,
  deleteDocument,
} from "./firestore.service.js";

/**
 * Updates or creates an item in Firestore.
 * If the item exists, merges new data with existing data.
 *
 * @param {string} collectionName - Collection name (e.g., "users", "tasks", "contacts")
 * @param {string} id - Document ID
 * @param {Object} data - Data to update or create
 * @returns {Promise<Object>} - Updated or created data object
 */
async function setItem(collectionName, id, data) {
  const existingData = await getItem(collectionName, id);
  const mergedData = existingData
    ? { ...existingData, ...data }
    : { id, ...data };

  await setDocument(collectionName, id, mergedData);
  return mergedData;
}

/**
 * Retrieves a single item from Firestore.
 *
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @returns {Promise<Object|null>} - Document data or null if not found
 */
async function getItem(collectionName, id) {
  return await getDocument(collectionName, id);
}

/**
 * Retrieves all items from a Firestore collection.
 *
 * @param {string} collectionName - Collection name
 * @returns {Promise<Array>} - Array of all documents
 */
async function getAllItems(collectionName) {
  return await getAllDocuments(collectionName);
}

/**
 * Updates specific fields in a document.
 *
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
async function updateItem(collectionName, id, updates) {
  await updateDocument(collectionName, id, updates);
}

/**
 * Deletes an item from Firestore.
 *
 * @param {string} collectionName - Collection name
 * @param {string} id - Document ID
 * @returns {Promise<void>}
 */
async function deleteItem(collectionName, id) {
  await deleteDocument(collectionName, id);
}

/**
 * Finds a user by email address.
 *
 * @param {string} email - User email
 * @returns {Promise<Object|null>} - User object or null if not found
 */
async function findUserByEmail(email) {
  const users = await queryDocuments("users", "email", "==", email);
  return users.length > 0 ? users[0] : null;
}

/**
 * Gets all tasks for a specific user.
 *
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of user's tasks
 */
async function getUserTasks(userId) {
  return await queryDocuments("tasks", "userId", "==", userId);
}

/**
 * Gets all contacts for a specific user.
 *
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of user's contacts
 */
async function getUserContacts(userId) {
  return await queryDocuments("contacts", "userId", "==", userId);
}

/**
 * Creates a new guest document in Firestore (guests collection).
 *
 * @param {string} guestId - Firebase Auth UID
 * @param {Object} guestData - Guest data (name, email, etc.)
 * @returns {Promise<Object>} - Created guest object
 */
async function createGuest(guestId, guestData) {
  const newGuest = {
    id: guestId,
    name: guestData.name || "Guest",
    email: guestData.email || "guest@join.com",
    isGuest: true,
    createdAt: new Date().toISOString(),
    ...guestData,
  };
  await setDocument("guests", guestId, newGuest);
  return newGuest;
}

/**
 * Creates a new user document in Firestore.
 *
 * @param {string} userId - Firebase Auth UID
 * @param {Object} userData - User data (name, email, etc.)
 * @returns {Promise<Object>} - Created user object
 */
async function createUser(userId, userData) {
  const newUser = {
    id: userId,
    name: userData.name || "",
    email: userData.email || "",
    colorCode: generateRandomColor(),
    isGuest: userData.isGuest || false,
    createdAt: new Date().toISOString(),
    ...userData,
  };

  await setDocument("users", userId, newUser);
  return newUser;
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
  setItem,
  getItem,
  getAllItems,
  updateItem,
  deleteItem,
  findUserByEmail,
  getUserTasks,
  getUserContacts,
  createUser,
  createGuest,
  generateRandomColor,
  getUserInitials,
};
