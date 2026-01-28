/**
 * @fileoverview Summary Dashboard Module
 * @description Displays an overview of all tasks with statistics including task counts by status,
 *              urgent task deadline tracking, personalized greetings based on time of day,
 *              and task priority visualization.
 * @module summary/summary__init
 */

import { onAuthChange } from "../../services/auth.service.js";
import { loadCurrentUserData } from "../../services/user-data.service.js";
import { checkAuthentication } from "../shared/include-html.js";
import { initHeader } from "../header/header__init.js";
import { initMenu } from "../layout/menu__navigation.js";
import { fadeTransition } from "../shared/fade-service.js";
import { loadTaskStats } from "./summary-tasks.js";
import { setupResizeListenerOnWidthChange } from "../shared/ui-helpers.js";
import {
  buildSummaryLayoutHTML,
  updateSummaryLayoutContent,
  showLayoutElements,
  updateThemeIcons,
} from "./summary-layout.js";
import {
  displayGreeting,
  initGreeting,
  hideGreetingElements,
  showGreetingElements,
} from "./summary-greeting.js";
import {
  showSplash,
  hideSplashDelayed,
} from "../../services/splash.service.js";

let earliestUrgentTaskIndex = -1;
let currentUserData = null;

/**
 * Initializes the Summary Dashboard module.
 * Orchestrates layout setup, authentication, and event listeners.
 * Prepares the user greeting, depending on the device.
 */
async function initSummary() {
  try {
    showSplash();
    checkAuthentication();
    await setupInitialLayout();
    const greetingElements = hideGreetingElements();

    initMenu();
    await initGreeting();
    setupAuthChangeHandler(greetingElements);
    setupResizeListener();
  } catch (error) {
    console.error("[initSummary] Error:", error);
  }
}

/**
 * Sets up the initial dashboard layout.
 * Renders the layout based on screen size and includes HTML templates.
 */
async function setupInitialLayout() {
  await renderSummaryLayout();
  await updateThemeIcons();
}

/**
 * Handles user authentication state changes.
 * Loads user data and updates UI on login/logout.
 *
 * @param {Object} greetingElements - Element references for greeting display
 */
function setupAuthChangeHandler(greetingElements) {
  onAuthChange(async (user) => {
    try {
      if (user) {
        await handleAuthUserChange(greetingElements);
      } else {
        showSplash();
      }
    } catch (error) {
      console.error("[setupAuthChangeHandler] Error:", error);
    }
  });
}

/**
 * Processes authenticated user changes.
 * Loads and displays user data, updates header, and loads task stats.
 *
 * @param {Object} greetingElements - Element references for greeting display
 */
async function handleAuthUserChange(greetingElements) {
  await updateCurrentUserData();
  await displayGreeting(currentUserData);
  initHeader(currentUserData);
  await loadTaskStats();
  showGreetingElements(greetingElements);
  hideSplashDelayed(800);
}

/**
 * Updates current user data and window reference.
 * Fetches from imported loadCurrentUserData service.
 */
async function updateCurrentUserData() {
  try {
    const userData = await loadCurrentUserData();
    currentUserData = userData;
  } catch (error) {
    console.error("[updateCurrentUserData] Error:", error);
    currentUserData = null;
  }
}

/**
 * Sets up window resize listener for responsive layout.
 * Re-renders layout when window width changes (ignores height).
 */
function setupResizeListener() {
  const onWidthChange = async () => {
    await renderSummaryLayout();
    await updateThemeIcons();
  };

  setupResizeListenerOnWidthChange(onWidthChange, 500);
}

/**
 * Renders summary layout with smooth fade transition.
 * Adjusts layout based on window width (mobile vs desktop).
 */
async function renderSummaryLayout() {
  try {
    const container = document.getElementById("summaryMainContainer");
    if (!container) return;

    const updateCallback = createLayoutUpdateCallback(container);

    await fadeTransition(container, updateCallback, 200);
  } catch (error) {
    console.error("[renderSummaryLayout] Error:", error);
  }
}

/**
 * Creates update callback for layout rendering.
 * Builds HTML, updates DOM, and initializes header/greeting.
 *
 * @param {HTMLElement} container - Container element to update
 * @returns {Function} - Async callback function
 */
function createLayoutUpdateCallback(container) {
  return async () => {
    const html = buildSummaryLayoutHTML();

    await updateSummaryLayoutContent(container, html);

    if (currentUserData) {
      initHeader(currentUserData);
      await displayGreeting(currentUserData);
      showLayoutElements();
    }
  };
}

/**
 * Navigates to the board page.
 */
window.navigateToBoard = function () {
  window.location.href = "../board.html";
};

/**
 * Navigates to the board and opens the earliest urgent task.
 * Stores task index in session for board page to use.
 */
window.openUrgentTask = function () {
  if (earliestUrgentTaskIndex !== -1) {
    sessionStorage.setItem("openTaskIndex", earliestUrgentTaskIndex);
  }
  window.location.href = "../board.html";
};

/**
 * Initializes the Summary Dashboard on page load.
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSummary);
} else {
  initSummary();
}

export { initSummary };
