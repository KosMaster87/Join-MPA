/**
 * @fileoverview UI helper functions
 * @description Provides utility functions for UI interactions like toast messages,
 *              loading states, and DOM manipulation.
 * @module js/shared/ui-helpers
 */

/**
 * Shows a toast notification message.
 *
 * @param {string} message - Message to display
 * @param {string} type - Type of toast: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showToast(message, type = "info", duration = 3000) {
  const toast = createToastElement(message, type);
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("toast--visible"), 10);

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Creates a toast DOM element.
 *
 * @param {string} message - Toast message
 * @param {string} type - Toast type
 * @returns {HTMLElement} - Toast element
 */
function createToastElement(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  return toast;
}

/**
 * Shows a loading spinner on an element.
 *
 * @param {HTMLElement} element - Element to show spinner on
 */
function showLoading(element) {
  element.disabled = true;
  element.classList.add("loading");
  element.dataset.originalText = element.textContent;
  element.textContent = "Loading...";
}

/**
 * Hides loading spinner from an element.
 *
 * @param {HTMLElement} element - Element to remove spinner from
 */
function hideLoading(element) {
  element.disabled = false;
  element.classList.remove("loading");
  element.textContent = element.dataset.originalText || element.textContent;
  delete element.dataset.originalText;
}

/**
 * Toggles visibility of an element.
 *
 * @param {HTMLElement} element - Element to toggle
 * @param {boolean} show - Optional: explicitly show (true) or hide (false)
 */
function toggleVisibility(element, show = null) {
  if (show === null) {
    element.hidden = !element.hidden;
  } else {
    element.hidden = !show;
  }
}

/**
 * Shows a modal/dialog element.
 *
 * @param {HTMLElement} modal - Modal element to show
 */
function showModal(modal) {
  modal.classList.add("modal--visible");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

/**
 * Hides a modal/dialog element.
 *
 * @param {HTMLElement} modal - Modal element to hide
 */
function hideModal(modal) {
  modal.classList.remove("modal--visible");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/**
 * Clears all input fields in a form.
 *
 * @param {HTMLFormElement} form - Form element
 */
function clearForm(form) {
  form.reset();

  const errorElements = form.querySelectorAll(".input__error");
  errorElements.forEach((error) => error.remove());

  const errorInputs = form.querySelectorAll(".input--error");
  errorInputs.forEach((input) => input.classList.remove("input--error"));
}

/**
 * Escapes HTML to prevent XSS attacks.
 *
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Formats a date string to localized format.
 *
 * @param {string} dateString - ISO date string
 * @param {string} locale - Locale (default: 'en-US')
 * @returns {string} - Formatted date
 */
function formatDate(dateString, locale = "en-US") {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a date to short format (MM/DD/YYYY).
 *
 * @param {string} dateString - ISO date string
 * @returns {string} - Short formatted date
 */
function formatDateShort(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US");
}

/**
 * Debounces a function call.
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Scrolls to an element smoothly.
 *
 * @param {HTMLElement} element - Element to scroll to
 */
function scrollToElement(element) {
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Copies text to clipboard.
 *
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard", "success");
  } catch (error) {
    console.error("Failed to copy:", error);
    showToast("Failed to copy", "error");
  }
}

/**
 * Tracks the last window width for resize detection.
 * @type {number}
 */
let lastWindowWidth = window.innerWidth;

/**
 * Sets up a resize listener that only triggers on width changes.
 * Ignores height-only changes (e.g., mobile keyboard).
 *
 * @param {Function} onWidthChange - Async callback to execute on width change
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 500)
 */
function setupResizeListenerOnWidthChange(onWidthChange, debounceMs = 500) {
  let resizeTimeout;
  
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      handleWindowResize(onWidthChange);
    }, debounceMs);
  });
}

/**
 * Handles window resize and executes callback if width changed.
 *
 * @param {Function} onWidthChange - Async callback on width change
 */
async function handleWindowResize(onWidthChange) {
  try {
    const currentWidth = window.innerWidth;
    if (currentWidth !== lastWindowWidth) {
      lastWindowWidth = currentWidth;
      await onWidthChange(currentWidth);
    }
  } catch (error) {
    console.error("[handleWindowResize] Error:", error);
  }
}

/**
 * Updates the tracked last window width.
 * Useful for manual width synchronization.
 *
 * @returns {number} Current window width
 */
function updateLastWindowWidth() {
  lastWindowWidth = window.innerWidth;
  return lastWindowWidth;
}

export {
  showToast,
  showLoading,
  hideLoading,
  toggleVisibility,
  showModal,
  hideModal,
  clearForm,
  escapeHtml,
  formatDate,
  formatDateShort,
  debounce,
  scrollToElement,
  copyToClipboard,
  setupResizeListenerOnWidthChange,
  updateLastWindowWidth,
};
