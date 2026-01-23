/**
 * @fileoverview Form validation utilities
 * @description Provides validation functions for email, password, names, and other form inputs.
 *              All validation functions return an object with isValid and error message.
 * @module js/shared/validators
 */

/**
 * Validates an email address format.
 *
 * @param {string} email - Email address to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validateEmail(email) {
  if (!email || email.trim() === "") {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true, error: "" };
}

/**
 * Validates a password.
 * Password must be at least 6 characters long (Firebase requirement).
 *
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validatePassword(password) {
  if (!password || password.trim() === "") {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }

  return { isValid: true, error: "" };
}

/**
 * Validates that two passwords match.
 *
 * @param {string} password - First password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true, error: "" };
}

/**
 * Validates a person's name.
 * Name must contain at least 2 characters.
 *
 * @param {string} name - Name to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validateName(name) {
  if (!name || name.trim() === "") {
    return { isValid: false, error: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }

  return { isValid: true, error: "" };
}

/**
 * Validates a phone number.
 * Accepts various formats, must contain at least 6 digits.
 *
 * @param {string} phone - Phone number to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validatePhone(phone) {
  if (!phone || phone.trim() === "") {
    return { isValid: false, error: "Phone number is required" };
  }

  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.length < 6) {
    return {
      isValid: false,
      error: "Phone number must contain at least 6 digits",
    };
  }

  return { isValid: true, error: "" };
}

/**
 * Validates a checkbox (e.g., privacy policy acceptance).
 *
 * @param {boolean} checked - Checkbox state
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validateCheckbox(checked, fieldName = "This field") {
  if (!checked) {
    return { isValid: false, error: `${fieldName} must be accepted` };
  }

  return { isValid: true, error: "" };
}

/**
 * Validates a required text field.
 *
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @param {number} minLength - Minimum length (default: 1)
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validateRequired(value, fieldName = "This field", minLength = 1) {
  if (!value || value.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (value.trim().length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  return { isValid: true, error: "" };
}

/**
 * Validates a date field.
 * Date must be in the future or today.
 *
 * @param {string} dateString - Date string to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validateDate(dateString) {
  if (!dateString || dateString.trim() === "") {
    return { isValid: false, error: "Date is required" };
  }

  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { isValid: false, error: "Date cannot be in the past" };
  }

  return { isValid: true, error: "" };
}

/**
 * Shows validation error message on a form field.
 *
 * @param {HTMLElement} inputElement - Input element
 * @param {string} errorMessage - Error message to display
 */
function showFieldError(inputElement, errorMessage) {
  inputElement.classList.add("input--error");

  let errorElement = inputElement.nextElementSibling;

  if (!errorElement || !errorElement.classList.contains("input__error")) {
    errorElement = document.createElement("span");
    errorElement.classList.add("input__error");
    inputElement.parentNode.insertBefore(
      errorElement,
      inputElement.nextSibling,
    );
  }

  errorElement.textContent = errorMessage;
}

/**
 * Clears validation error from a form field.
 *
 * @param {HTMLElement} inputElement - Input element
 */
function clearFieldError(inputElement) {
  inputElement.classList.remove("input--error");

  const errorElement = inputElement.nextElementSibling;
  if (errorElement && errorElement.classList.contains("input__error")) {
    errorElement.remove();
  }
}

export {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateName,
  validatePhone,
  validateCheckbox,
  validateRequired,
  validateDate,
  showFieldError,
  clearFieldError,
};
