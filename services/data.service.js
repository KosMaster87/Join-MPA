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
    ...userData
  };

  await setDocument("users", userId, newUser);
  return newUser;
}

/**
 * Generates a random hex color code for user avatars.
 *
 * @returns {string} - Random hex color (e.g., "#FF5733")
 */
function generateRandomColor() {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFF5", "#FFD733", "#FF8C33", "#8C33FF", "#33FF8C"
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
  generateRandomColor,
  getUserInitials
};
