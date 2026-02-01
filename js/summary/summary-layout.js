/**
 * @fileoverview Summary Layout Module
 * @description Provides layout building and rendering functions for the summary dashboard.
 * @module js/summary/summary-layout
 */

import { getSummaryContentHTML } from "../../assets/templates/summary-content.js";
import { includeHTML } from "../shared/include-html.js";
import {
  updateSummaryIconsForTheme,
  getSystemTheme,
} from "../shared/theme-service.js";

/**
 * Builds layout HTML based on current window width.
 * Returns mobile layout for width ≤ 1080px, desktop layout otherwise.
 *
 * @returns {string} - HTML template string
 */
function buildSummaryLayoutHTML() {
  const contentHtml = getSummaryContentHTML();
  return window.innerWidth <= 1080
    ? buildMobileLayout(contentHtml)
    : buildDesktopLayout(contentHtml);
}

/**
 * Builds mobile layout template.
 *
 * @param {string} contentHtml - Content to include in layout
 * @returns {string} - Mobile layout HTML
 */
function buildMobileLayout(contentHtml) {
  return `
    <main class="app-layout__main">
      <div w3-include-html="../assets/templates/header.html"></div>
      <div class="summary__content-wrapper" id="summaryContentContainer">${contentHtml}</div>
      <div class="menu-container" w3-include-html="../assets/templates/menu.html"></div>
    </main>
  `;
}

/**
 * Builds desktop layout template.
 *
 * @param {string} contentHtml - Content to include in layout
 * @returns {string} - Desktop layout HTML
 */
function buildDesktopLayout(contentHtml) {
  return `
    <main class="desktop-layout__main">
      <div class="main-right">
        <div w3-include-html="../assets/templates/header.html"></div>
        <div class="summary__content-wrapper" id="summaryContentContainer">${contentHtml}</div>
      </div>
      <div class="menu-container" w3-include-html="../assets/templates/menu.html"></div>
    </main>
  `;
}

/**
 * Updates container with layout HTML and includes templates.
 * Handles DOM updates and template inclusion.
 *
 * @param {HTMLElement} container - Container element to update
 * @param {string} html - HTML content to set
 */
async function updateSummaryLayoutContent(container, html) {
  try {
    container.innerHTML = html;

    await includeHTML();
  } catch (error) {
    console.error("[updateSummaryLayoutContent] Error:", error);
  }
}

/**
 * Shows layout elements with fade-in effect.
 * Displays greeting and user initials.
 */
function showLayoutElements() {
  const greetingName = document.getElementById("greetingNameDesktop");
  const headerInitials = document.getElementById("userInitials");
  if (greetingName) greetingName.classList.remove("hide");
  if (headerInitials) headerInitials.classList.remove("hide");
}

/**
 * Updates summary layout icons based on current theme.
 * Applies theme-specific icon sources to all theme-aware images.
 */
async function updateThemeIcons() {
  try {
    const realTheme = getRealTheme();
    await updateSummaryIconsForTheme(realTheme);
  } catch (error) {
    console.error("[updateThemeIcons] Error:", error);
  }
}

/**
 * Gets current theme setting and resolves to real theme value.
 * Returns "light" or "dark" (not "device").
 *
 * @returns {string} - Real theme ("light" or "dark")
 */
function getRealTheme() {
  const theme = localStorage.getItem("joinTheme") || "device";
  return theme === "device" ? getSystemTheme() : theme;
}

export {
  buildSummaryLayoutHTML,
  updateSummaryLayoutContent,
  showLayoutElements,
  updateThemeIcons,
  getRealTheme,
};
