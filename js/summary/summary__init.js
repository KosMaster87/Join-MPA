/**
 * @fileoverview Initializes summary page functionality, including greeting and task statistics.
 * @description Sets up personalized greeting based on time of day and user name,
 *              and loads task statistics to display in summary cards.
 * @module summary/summary__init
 */

import { getCurrentAuthUser } from "../../services/auth.service.js";
import { getUserTasks } from "../../services/data.service.js";
import { checkAuthentication, includeHTML } from "../shared/include-html.js";
import { initHeader } from "../layout/header__init.js";
import { initMenu } from "../layout/menu__navigation.js";

/**
 * Initializes summary page.
 */
async function initSummary() {
  checkAuthentication();
  await includeHTML();
  initHeader();
  initMenu();
  displayGreeting();
  loadTaskStats();
}

/**
 * Displays personalized greeting based on time of day.
 */
function displayGreeting() {
  const user = getCurrentAuthUser();
  const timeElement = document.getElementById("greetingTime");
  const nameElement = document.getElementById("greetingName");

  if (!timeElement || !nameElement) return;

  const hour = new Date().getHours();
  const greeting = getGreetingByTime(hour);
  timeElement.textContent = greeting;

  const displayName = getDisplayName(user);
  nameElement.textContent = displayName;
}

/**
 * Gets greeting text based on hour.
 *
 * @param {number} hour - Hour of day (0-23)
 * @returns {string} - Greeting text
 */
function getGreetingByTime(hour) {
  if (hour < 12) return "Good morning,";
  if (hour < 18) return "Good afternoon,";
  return "Good evening,";
}

/**
 * Gets display name from user object.
 *
 * @param {Object} user - Firebase user
 * @returns {string} - Display name
 */
function getDisplayName(user) {
  if (!user) return "Guest";
  if (user.email === "guest@join.com") return "Guest";
  return user.displayName || user.email.split("@")[0];
}

/**
 * Loads and displays task statistics.
 */
async function loadTaskStats() {
  try {
    const user = getCurrentAuthUser();
    if (!user) return;

    const tasks = await getUserTasks(user.uid);
    displayStats(tasks);
  } catch (error) {
    console.error("Failed to load stats:", error);
  }
}

/**
 * Displays task statistics in cards.
 *
 * @param {Array} tasks - User tasks
 */
function displayStats(tasks) {
  const stats = calculateStats(tasks);

  updateElement("todoCount", stats.todo);
  updateElement("doneCount", stats.done);
  updateElement("urgentCount", stats.urgent);
  updateElement("boardCount", stats.total);
  updateElement("progressCount", stats.inProgress);
  updateElement("feedbackCount", stats.feedback);

  if (stats.urgentDeadline) {
    updateUrgentDeadline(stats.urgentDeadline);
  }
}

/**
 * Calculates task statistics.
 *
 * @param {Array} tasks - User tasks
 * @returns {Object} - Statistics object
 */
function calculateStats(tasks) {
  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    done: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    feedback: tasks.filter((t) => t.status === "awaiting-feedback").length,
    urgent: tasks.filter((t) => t.priority === "urgent").length,
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
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.dueDate);
  if (urgentTasks.length === 0) return null;

  const sortedTasks = urgentTasks.sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  );
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
  const deadlineElement = document.querySelector(".summary__deadline-date");
  if (!deadlineElement) return;

  const formatted = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  deadlineElement.textContent = formatted;
}

// Initialize on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSummary);
} else {
  initSummary();
}

export { initSummary };
