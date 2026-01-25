/**
 * @fileoverview Login page logic
 * @description Handles user login functionality including form validation,
 *              Firebase authentication, and redirection to the summary page.
 * @module js/auth/auth__login
 */

import {
  signInWithAuth,
  onAuthChange,
  signInAnonymouslyAsGuest,
} from "../../services/auth.service.js";
import { createGuest } from "../../services/data.service.js";
import { validateEmail, validatePassword } from "../shared/validators.js";
import { showToast, showLoading, hideLoading } from "../shared/ui-helpers.js";
import {
  showSplash,
  hideSplashDelayed,
} from "../../services/splash.service.js";

/**
 * Initializes the login page by setting up event listeners.
 */
function initLogin() {
  showSplash();
  hideSplashDelayed(800);
  setupLoginFormListener();
  setupGuestLoginListener();
  setupSignupBtnListener();
}

function setupLoginFormListener() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

function setupGuestLoginListener() {
  const guestLoginBtn = document.getElementById("guestLoginBtn");
  if (guestLoginBtn) {
    guestLoginBtn.addEventListener("click", handleGuestLogin);
  }
}

function setupSignupBtnListener() {
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.href = "./register.html";
    });
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
    await redirectToSummary();
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
  localStorage.setItem("isGuest", "false");
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

    const user = await signInAnonymouslyAsGuest();
    await saveUserSession(user.uid, "guest@join.com");
    localStorage.setItem("isGuest", "true");

    // Ensure guest user document exists in Firestore (guests collection)
    await createGuest(user.uid, {
      name: "Guest",
      email: "guest@join.com",
    });

    showToast("Logged in as guest!", "success");
    await redirectToSummary();
  } catch (error) {
    console.error("Guest login error:", error);
    showToast("Guest login failed. Please try again.", "error");
  } finally {
    hideLoading(guestBtn);
  }
}

/**
 * Redirects to the summary page after successful login.
 */
async function redirectToSummary() {
  await new Promise((resolve) => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        unsubscribe();
        resolve();
      }
    });
  });
  window.location.href = "/summary.html";
  // window.location.href = "/pages/summary.html";
}

document.addEventListener("DOMContentLoaded", initLogin);

export { initLogin, handleLogin, handleGuestLogin };
