/**
 * @fileoverview UI helper functions
 * @description Provides utility functions for UI interactions like toast messages,
 *              loading states, and DOM manipulation.
 * @module js/shared/ui-helpers
 */

import {
  showSplash,
  hideSplashDelayed,
} from "../../services/splash.service.js";

/**
 * Tracks whether the viewport is currently in mobile mode.
 * Mobile: ≤1080px, Desktop: ≥1081px
 * @type {boolean}
 */
let isMobileView = window.innerWidth <= 1080;

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
 * Sets up a resize listener that triggers only on viewport mode changes.
 * Only fires callback when switching between mobile (≤1080px) and desktop (≥1081px).
 *
 * @param {Function} onViewportModeChange - Async callback to execute on mode change
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 500)
 */
function setupResizeListenerOnWidthChange(
  onViewportModeChange,
  debounceMs = 500,
) {
  let resizeTimeout;
  let isResizing = false;
  let splashShown = false;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    // Show splash only once at the start of resize sequence
    if (!isResizing) {
      const currentWidth = window.innerWidth;
      const isCurrentlyMobile = currentWidth <= 1080;

      // Only show splash if mode is about to change
      if (isCurrentlyMobile !== isMobileView) {
        showSplash();
        isResizing = true;
        splashShown = true;
      }
    }

    resizeTimeout = setTimeout(async () => {
      await handleWindowResize(onViewportModeChange);
      isResizing = false;

      // Hide splash if it was shown, even if no mode change happened
      if (splashShown) {
        hideSplashDelayed(300);
        splashShown = false;
      }
    }, debounceMs);
  });
}

/**
 * Handles window resize and executes callback only on viewport mode change.
 * Checks if viewport switched between mobile (≤1080px) and desktop (≥1081px).
 *
 * @param {Function} onViewportModeChange - Async callback on mode change
 */
async function handleWindowResize(onViewportModeChange) {
  try {
    const currentWidth = window.innerWidth;
    const isCurrentlyMobile = currentWidth <= 1080;

    if (isCurrentlyMobile !== isMobileView) {
      isMobileView = isCurrentlyMobile;
      await onViewportModeChange(currentWidth, isMobileView);
    }
  } catch (error) {
    console.error("[handleWindowResize] Error:", error);
  }
}

/**
 * Updates the tracked viewport mode.
 * Useful for manual synchronization after programmatic changes.
 *
 * @returns {boolean} Current mobile view state
 */
function updateLastWindowWidth() {
  isMobileView = window.innerWidth <= 1080;
  return isMobileView;
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
