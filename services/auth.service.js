/**
 * @fileoverview Firebase Authentication Service
 * @description Handles user authentication with Firebase Auth including registration,
 *              login, logout, guest access, and auth state management.
 * @module services/auth.service
 */

import { auth } from "../config/firebase.config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";

/**
 * Registers a new user with email and password using Firebase Authentication.
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password (min 6 characters)
 * @returns {Promise<Object>} - Firebase user object
 * @throws {Error} - Firebase auth error (e.g., email-already-in-use, weak-password)
 */
async function registerWithAuth(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error.code, error.message);
    throw error;
  }
}

/**
 * Signs in an existing user with email and password.
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Firebase user object
 * @throws {Error} - Firebase auth error (e.g., user-not-found, wrong-password)
 */
async function signInWithAuth(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Sign in error:", error.code, error.message);
    throw error;
  }
}

/**
 * Signs in anonymously as a guest user.
 * Guest users can test all features but data may be cleared.
 *
 * @returns {Promise<Object>} - Firebase user object with isAnonymous: true
 * @throws {Error} - Firebase auth error
 */
async function signInAnonymouslyAsGuest() {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Guest sign in error:", error.code, error.message);
    throw error;
  }
}

/**
 * Signs out the current user from Firebase Authentication.
 * Also clears localStorage to remove session data.
 *
 * @returns {Promise<void>}
 * @throws {Error} - Firebase auth error
 */
async function signOutUser() {
  try {
    await signOut(auth);
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserEmail");
  } catch (error) {
    console.error("Sign out error:", error.code, error.message);
    throw error;
  }
}

/**
 * Returns the currently authenticated Firebase user.
 *
 * @returns {Object|null} - Current Firebase user object or null if not authenticated
 */
function getCurrentAuthUser() {
  return auth.currentUser;
}

/**
 * Listens to authentication state changes.
 * Callback is invoked whenever the user signs in or out.
 *
 * @param {Function} callback - Callback function that receives the user object (or null)
 * @returns {Function} - Unsubscribe function to stop listening
 * @example
 * const unsubscribe = onAuthChange((user) => {
 *   if (user) {
 *     console.log('User signed in:', user.email);
 *   } else {
 *     console.log('User signed out');
 *   }
 * });
 */
function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Deletes the currently authenticated user from Firebase Auth.
 * WARNING: This is permanent and cannot be undone.
 *
 * @returns {Promise<void>}
 * @throws {Error} - Throws if no user is signed in or deletion fails
 */
async function deleteCurrentUser() {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("No user is currently signed in");
    }

    await deleteUser(currentUser);
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentUserEmail");
  } catch (error) {
    console.error("Delete user error:", error.code, error.message);
    throw error;
  }
}

/**
 * Checks if a user is currently authenticated.
 *
 * @returns {boolean} - True if user is authenticated, false otherwise
 */
function isUserAuthenticated() {
  return auth.currentUser !== null;
}

export {
  registerWithAuth,
  signInWithAuth,
  signInAnonymouslyAsGuest,
  signOutUser,
  getCurrentAuthUser,
  onAuthChange,
  deleteCurrentUser,
  isUserAuthenticated
};
