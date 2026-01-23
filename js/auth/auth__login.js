/**
 * @fileoverview Login page logic
 * @description Handles user login functionality including form validation,
 *              Firebase authentication, and redirection to the summary page.
 * @module js/auth/auth__login
 */

import { signInWithAuth } from "../../services/auth.service.js";
import { findUserByEmail } from "../../services/data.service.js";
import { validateEmail, validatePassword } from "../shared/validators.js";
import { showToast, showLoading, hideLoading } from "../shared/ui-helpers.js";

/**
 * Initializes the login page by setting up event listeners.
 */
function initLogin() {
  const loginForm = document.getElementById("loginForm");
  const guestLoginBtn = document.getElementById("guestLoginBtn");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (guestLoginBtn) {
    guestLoginBtn.addEventListener("click", handleGuestLogin);
  }
}

/**
 * Handles the login form submission.
 *
 * @param {Event} event - Form submit event
 */
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const submitBtn = event.target.querySelector('button[type="submit"]');

  if (!validateLoginForm(email, password)) {
    return;
  }

  await attemptLogin(email, password, submitBtn);
}

/**
 * Validates the login form inputs.
 *
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {boolean} - True if valid, false otherwise
 */
function validateLoginForm(email, password) {
  const emailCheck = validateEmail(email);
  if (!emailCheck.isValid) {
    showToast(emailCheck.error, "error");
    return false;
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.isValid) {
    showToast(passwordCheck.error, "error");
    return false;
  }

  return true;
}

/**
 * Attempts to log in the user with Firebase Auth.
 *
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {HTMLElement} submitBtn - Submit button element
 */
async function attemptLogin(email, password, submitBtn) {
  try {
    showLoading(submitBtn);

    const user = await signInWithAuth(email, password);
    await saveUserSession(user.uid, user.email);

    showToast("Login successful!", "success");
    redirectToSummary();
  } catch (error) {
    handleLoginError(error);
  } finally {
    hideLoading(submitBtn);
  }
}

/**
 * Saves the user session to localStorage.
 *
 * @param {string} userId - Firebase user UID
 * @param {string} email - User email
 */
async function saveUserSession(userId, email) {
  localStorage.setItem("currentUserId", userId);
  localStorage.setItem("currentUserEmail", email);
}

/**
 * Handles login errors and displays appropriate messages.
 *
 * @param {Error} error - Firebase error object
 */
function handleLoginError(error) {
  let errorMessage = "Login failed. Please try again.";

  if (error.code === "auth/user-not-found") {
    errorMessage = "No account found with this email.";
  } else if (error.code === "auth/wrong-password") {
    errorMessage = "Incorrect password.";
  } else if (error.code === "auth/too-many-requests") {
    errorMessage = "Too many failed attempts. Please try again later.";
  }

  showToast(errorMessage, "error");
}

/**
 * Handles guest login functionality.
 */
async function handleGuestLogin() {
  const guestBtn = document.getElementById("guestLoginBtn");

  try {
    showLoading(guestBtn);

    // Guest users use a predefined account
    const guestEmail = "guest@join.com";
    const guestPassword = "guest123";

    const user = await signInWithAuth(guestEmail, guestPassword);
    await saveUserSession(user.uid, guestEmail);

    showToast("Logged in as guest!", "success");
    redirectToSummary();
  } catch (error) {
    showToast("Guest login failed. Please try again.", "error");
  } finally {
    hideLoading(guestBtn);
  }
}

/**
 * Redirects to the summary page after successful login.
 */
function redirectToSummary() {
  setTimeout(() => {
    window.location.href = "./pages/summary.html";
  }, 1000);
}

document.addEventListener("DOMContentLoaded", initLogin);

export { initLogin, handleLogin, handleGuestLogin };
