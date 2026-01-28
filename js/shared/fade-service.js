/**
 * @fileoverview Fade Service for smooth element transitions.
 * @description Provides functions for fading elements in and out smoothly.
 * @module shared/fade-service
 */

/**
 * Fades out an element.
 *
 * @param {HTMLElement} element - Element to fade out
 * @param {number} duration - Fade duration in milliseconds (default: 300)
 * @returns {Promise<void>}
 */
async function fadeOut(element, duration = 300) {
  return new Promise((resolve) => {
    element.style.transition = `opacity ${duration}ms ease-out`;
    element.style.opacity = "0";
    setTimeout(resolve, duration);
  });
}

/**
 * Fades in an element.
 *
 * @param {HTMLElement} element - Element to fade in
 * @param {number} duration - Fade duration in milliseconds (default: 300)
 * @returns {Promise<void>}
 */
async function fadeIn(element, duration = 300) {
  return new Promise((resolve) => {
    element.style.opacity = "0";
    element.style.transition = `opacity ${duration}ms ease-in`;
    // Trigger reflow to ensure transition works
    element.offsetHeight;
    element.style.opacity = "1";
    setTimeout(resolve, duration);
  });
}

/**
 * Fades out, executes a callback, then fades in.
 * Useful for content updates.
 *
 * @param {HTMLElement} element - Element to fade
 * @param {Function} callback - Function to execute while faded out
 * @param {number} duration - Fade duration in milliseconds (default: 300)
 * @returns {Promise<void>}
 */
async function fadeTransition(element, callback, duration = 300) {
  await fadeOut(element, duration);
  await callback();
  await fadeIn(element, duration);
}

export { fadeOut, fadeIn, fadeTransition };
