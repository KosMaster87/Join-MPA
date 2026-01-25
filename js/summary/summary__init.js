/**
 * @fileoverview Summary Dashboard Module
 * @description Displays an overview of all tasks with statistics including task counts by status,
 *              urgent task deadline tracking, personalized greetings based on time of day,
 *              and task priority visualization.
 * @module summary/summary__init
 */

import {
  getCurrentAuthUser,
  onAuthChange,
} from "../../services/auth.service.js";
import { getUserTasks, getItem } from "../../services/data.service.js";
import { checkAuthentication, includeHTML } from "../shared/include-html.js";
import { showSplash, hideSplash } from "../../services/splash.service.js";
import { initHeader } from "../layout/header__init.js";
import { initMenu } from "../layout/menu__navigation.js";

let showedLoginGreeting = false;
let earliestUrgentTaskIndex = -1;
let currentUserData = null;

/**
 * Initializes summary page.
 */
async function initSummary() {
  showSplash();
  checkAuthentication();
  await includeHTML();

  // Hide greeting and header initials until user data is loaded
  const greetingName = document.getElementById("greetingNameDesktop");
  const headerInitials = document.getElementById("userInitials");
  if (greetingName) greetingName.classList.add("hide");
  if (headerInitials) headerInitials.classList.add("hide");

  initMenu();
  await initGreeting();

  onAuthChange(async (user) => {
    if (user) {
      await loadCurrentUserData();
      displayGreeting();
      initHeader(currentUserData);
      loadTaskStats();

      // Hide splash and show greeting/header initials
      hideSplash();
      if (greetingName) greetingName.classList.remove("hide");
      if (headerInitials) headerInitials.classList.remove("hide");
    } else {
      showSplash();
    }
  });
}

/**
 * Loads current user data from Firestore and stores in currentUserData.
 */
async function loadCurrentUserData() {
  const user = getCurrentAuthUser();
  if (!user) {
    currentUserData = null;
    return;
  }
  try {
    const isGuest = localStorage.getItem("isGuest") === "true";
    const collection = isGuest ? "guests" : "users";
    const userData = await getItem(collection, user.uid);
    currentUserData = userData || null;
    window.currentUserData = currentUserData;
  } catch (e) {
    console.error("[loadCurrentUserData] Error: ", e);
    currentUserData = null;
  }
}

/**
 * Displays a greeting after login if not already shown (mobile only).
 */
async function initGreeting() {
  showedLoginGreeting =
    sessionStorage.getItem("showedLoginGreeting") === "true";

  if (!showedLoginGreeting && window.innerWidth <= 720) {
    await showGreetScreen();
    showedLoginGreeting = true;
    sessionStorage.setItem("showedLoginGreeting", "true");
  }

  const summaryToDos = document.getElementById("summaryToDos");
  if (summaryToDos) {
    summaryToDos.style.display = "flex";
  }
}

/**
 * Displays a greeting message for mobile users.
 */
async function showGreetScreen() {
  const greetingsMobile = document.getElementById("greetingsMobile");
  if (greetingsMobile) {
    greetingsMobile.classList.remove("hide");
    greetingsMobile.classList.add("show");
    setTimeout(() => {
      greetingsMobile.classList.remove("show");
      greetingsMobile.classList.add("hide");
    }, 2500);
  }
}

/**
 * Displays personalized greeting based on time of day.
 */
function displayGreeting() {
  // console.log("currentUserData", currentUserData);
  const timeElement = document.getElementById("greetingsDesktop");
  const nameElement = document.getElementById("greetingNameDesktop");
  const mobileElement = document.getElementById("greetingMobile");

  const hour = new Date().getHours();
  const greeting = getGreetingByTime(hour);
  const displayName = getDisplayNameFromUserData(currentUserData);

  if (timeElement) timeElement.textContent = greeting + ",";
  if (nameElement) nameElement.textContent = displayName;
  if (mobileElement) mobileElement.textContent = greeting + ", " + displayName;
}

/**
 * Gets display name from Firestore user data.
 * @param {Object|null} userData - Firestore user data
 * @returns {string}
 */
function getDisplayNameFromUserData(userData) {
  if (!userData) return "Guest";
  if (userData.isGuest) return "Guest";
  if (userData.name && userData.name.trim().length > 0) return userData.name;
  if (userData.email) return userData.email.split("@")[0];
  return "User";
}

/**
 * Gets greeting text based on hour.
 *
 * @param {number} hour - Hour of day (0-23)
 * @returns {string} - Greeting text
 */
function getGreetingByTime(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Gets display name from user object.
 *
 * @param {Object} user - Firebase user
 * @returns {string} - Display name
 */

/**
 * Loads and displays task statistics.
 */
async function loadTaskStats() {
  try {
    const user = getCurrentAuthUser();
    if (!user) {
      displayEmptyStats();
      return;
    }

    const tasks = await getUserTasks(user.uid);
    displayStats(tasks);
  } catch (error) {
    console.error("Failed to load stats:", error);
    displayEmptyStats();
  }
}

/**
 * Displays empty stats when no data available.
 */
function displayEmptyStats() {
  updateElement("summaryTodoTodos", 0);
  updateElement("summaryDoneTodos", 0);
  updateElement("summaryUpcomingTasks", 0);
  updateElement("dataTodos", 0);
  updateElement("summaryProcessTasks", 0);
  updateElement("summaryAwaitingTask", 0);
  updateElement("summaryUrgentDate", "-");
}

/**
 * Displays task statistics in cards.
 *
 * @param {Array} tasks - User tasks
 */
function displayStats(tasks) {
  const stats = calculateStats(tasks);

  updateElement("summaryTodoTodos", stats.todo);
  updateElement("summaryDoneTodos", stats.done);
  updateElement("summaryUpcomingTasks", stats.urgent);
  updateElement("dataTodos", stats.total);
  updateElement("summaryProcessTasks", stats.inProgress);
  updateElement("summaryAwaitingTask", stats.feedback);

  if (stats.urgentDeadline) {
    updateUrgentDeadline(stats.urgentDeadline);
  } else {
    updateElement("summaryUrgentDate", "-");
  }
}

/**
 * Calculates task statistics.
 *
 * @param {Array} tasks - User tasks
 * @returns {Object} - Statistics object
 */
function calculateStats(tasks) {
  if (!tasks || tasks.length === 0) {
    return {
      total: 0,
      todo: 0,
      done: 0,
      inProgress: 0,
      feedback: 0,
      urgent: 0,
      urgentDeadline: null,
    };
  }

  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo" || t.status === "to-do")
      .length,
    done: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter(
      (t) => t.status === "in-progress" || t.status === "progress",
    ).length,
    feedback: tasks.filter(
      (t) => t.status === "awaiting-feedback" || t.status === "await",
    ).length,
    urgent: tasks.filter((t) => t.priority === "urgent" || t.prio === "Urgent")
      .length,
    urgentDeadline: getNextUrgentDeadline(tasks),
  };
}

/**
 * Gets next urgent task deadline.
 *
 * @param {Array} tasks - User tasks
 * @returns {string|null} - Deadline date or null
 */
function getNextUrgentDeadline(tasks) {
  const urgentTasks = tasks.filter(
    (t) =>
      (t.priority === "urgent" || t.prio === "Urgent") &&
      t.dueDate &&
      t.status !== "done",
  );

  if (urgentTasks.length === 0) return null;

  const sortedTasks = urgentTasks.sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  );

  earliestUrgentTaskIndex = tasks.indexOf(sortedTasks[0]);
  return sortedTasks[0].dueDate;
}

/**
 * Updates element text content.
 *
 * @param {string} id - Element ID
 * @param {string|number} value - New value
 */
function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

/**
 * Updates urgent deadline display.
 *
 * @param {string} date - Deadline date
 */
function updateUrgentDeadline(date) {
  const deadlineElement = document.getElementById("summaryUrgentDate");
  if (!deadlineElement) return;

  const formatted = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  deadlineElement.textContent = formatted;
}

/**
 * Navigates to the board page.
 */
window.navigateToBoard = function () {
  window.location.href = "../pages/board.html";
};

/**
 * Navigates to the board and opens the earliest urgent task.
 */
window.openUrgentTask = function () {
  if (earliestUrgentTaskIndex !== -1) {
    sessionStorage.setItem("openTaskIndex", earliestUrgentTaskIndex);
  }
  window.location.href = "../pages/board.html";
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSummary);
} else {
  initSummary();
}

export { initSummary };
