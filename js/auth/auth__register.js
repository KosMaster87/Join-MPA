/**
 * @fileoverview Registration page logic
 * @description Handles user registration functionality including form validation,
 *              Firebase authentication, Firestore user creation, and privacy policy acceptance.
 * @module js/auth/auth__register
 */

import { registerWithAuth } from "../../services/auth.service.js";
import { createUser } from "../../services/data.service.js";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateName,
  validateCheckbox,
} from "../shared/validators.js";
import {
  showToast,
  showLoading,
  hideLoading,
  clearForm,
} from "../shared/ui-helpers.js";

/**
 * Initializes the registration page by setting up event listeners.
 */
function initRegister() {
  setupRegisterFormListener();
  setupBackToLoginBtnListener();
}

function setupRegisterFormListener() {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
}

function setupBackToLoginBtnListener() {
  const backBtn = document.getElementById("backToLoginBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "./login.html";
    });
  }
}

/**
 * Handles the registration form submission.
 * @param {Event} event - Form submit event
 */
async function handleRegister(event) {
  event.preventDefault();

  const formData = getFormData();
  const submitBtn = event.target.querySelector('button[type="submit"]');

  if (!validateRegisterForm(formData)) {
    return;
  }

  await attemptRegistration(formData, submitBtn, event.target);
}

/**
 * Retrieves form data from input fields.
 * @returns {Object} - Form data object
 */
function getFormData() {
  return {
    name: document.getElementById("registerName").value,
    email: document.getElementById("registerEmail").value,
    password: document.getElementById("registerPassword").value,
    confirmPassword: document.getElementById("registerConfirmPassword").value,
    privacyAccepted: document.getElementById("privacyPolicy").checked,
  };
}

/**
 * Validates the registration form inputs.
 * @param {Object} formData - Form data to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateRegisterForm(formData) {
  const nameCheck = validateName(formData.name);
  if (!nameCheck.isValid) {
    showToast(nameCheck.error, "error");
    return false;
  }

  const emailCheck = validateEmail(formData.email);
  if (!emailCheck.isValid) {
    showToast(emailCheck.error, "error");
    return false;
  }

  return validatePasswords(formData);
}

/**
 * Validates password fields.
 * @param {Object} formData - Form data
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePasswords(formData) {
  const passwordCheck = validatePassword(formData.password);
  if (!passwordCheck.isValid) {
    showToast(passwordCheck.error, "error");
    return false;
  }

  const matchCheck = validatePasswordMatch(
    formData.password,
    formData.confirmPassword,
  );
  if (!matchCheck.isValid) {
    showToast(matchCheck.error, "error");
    return false;
  }

  return validatePrivacyPolicy(formData.privacyAccepted);
}

/**
 * Validates privacy policy acceptance.
 * @param {boolean} accepted - Privacy checkbox state
 * @returns {boolean} - True if accepted, false otherwise
 */
function validatePrivacyPolicy(accepted) {
  const privacyCheck = validateCheckbox(accepted, "Privacy policy");
  if (!privacyCheck.isValid) {
    showToast(privacyCheck.error, "error");
    return false;
  }
  return true;
}

/**
 * Attempts to register a new user.
 * @param {Object} formData - Form data
 * @param {HTMLElement} submitBtn - Submit button element
 * @param {HTMLFormElement} form - Form element
 */
async function attemptRegistration(formData, submitBtn, form) {
  try {
    showLoading(submitBtn);

    const user = await registerWithAuth(formData.email, formData.password);
    await createUserInFirestore(user.uid, formData);

    localStorage.setItem("currentUserId", user.uid);
    localStorage.setItem("currentUserEmail", user.email);
    localStorage.setItem("isGuest", "false");

    showToast("Registration successful!", "success");
    clearForm(form);
    redirectToSummary();
  } catch (error) {
    handleRegistrationError(error);
  } finally {
    hideLoading(submitBtn);
  }
}

/**
 * Creates a user document in Firestore.
 * @param {string} userId - Firebase Auth UID
 * @param {Object} formData - Form data
 */
async function createUserInFirestore(userId, formData) {
  const userData = {
    name: formData.name,
    email: formData.email,
    isGuest: false,
  };

  await createUser(userId, userData);
}

/**
 * Handles registration errors and displays appropriate messages.
 * @param {Error} error - Firebase error object
 */
function handleRegistrationError(error) {
  let errorMessage = "Registration failed. Please try again.";

  if (error.code === "auth/email-already-in-use") {
    errorMessage = "This email is already registered.";
  } else if (error.code === "auth/weak-password") {
    errorMessage = "Password is too weak. Use at least 6 characters.";
  } else if (error.code === "auth/invalid-email") {
    errorMessage = "Invalid email address.";
  }

  showToast(errorMessage, "error");
}

/**
 * Redirects to the summary page after registration.
 */
function redirectToSummary() {
  setTimeout(() => {
    window.location.href = "../../summary.html";
    // window.location.href = "../../pages/summary.html";
  }, 1500);
}

document.addEventListener("DOMContentLoaded", initRegister);

export { initRegister, handleRegister };
