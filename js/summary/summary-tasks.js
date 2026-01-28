/**
 * @fileoverview Summary Task Statistics Module
 * @description Handles loading, calculating, and displaying task statistics for the dashboard.
 *              Manages task counts by status, deadline tracking, and UI updates.
 * @module summary/summary-tasks
 */

import { getCurrentAuthUser } from "../../services/auth.service.js";
import { getUserTasks } from "../../services/data.service.js";

/**
 * Loads current user's tasks and displays statistics.
 * Shows empty stats if user not authenticated or load fails.
 */
async function loadTaskStats() {
  try {
    const user = getCurrentAuthUser();
    if (!user) {
      displayTaskStats(null);
      return;
    }

    const tasks = await getUserTasks(user.uid);
    displayTaskStats(tasks);
  } catch (error) {
    console.error("[loadTaskStats] Error:", error);
    displayTaskStats(null);
  }
}

/**
 * Displays task statistics or empty state.
 *
 * @param {Array|null} tasks - User tasks
 */
function displayTaskStats(tasks) {
  const stats = calculateStats(tasks);
  updateTaskStatsUI(stats);
}

/**
 * Calculates comprehensive task statistics.
 * Returns empty stats if no tasks provided.
 *
 * @param {Array|null} tasks - User tasks
 * @returns {Object} - Statistics object with counts and deadline
 */
function calculateStats(tasks) {
  if (!tasks || tasks.length === 0) return getEmptyStats();

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
 * Gets default empty statistics object.
 *
 * @returns {Object} - Empty stats with all values at zero
 */
function getEmptyStats() {
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

/**
 * Updates all task stat elements in UI.
 *
 * @param {Object} stats - Statistics object
 */
function updateTaskStatsUI(stats) {
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
 * Updates DOM element text content by ID.
 *
 * @param {string} id - Element ID
 * @param {string|number} value - New text value
 */
function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

/**
 * Gets next urgent task deadline (earliest date).
 * Filters for urgent tasks with valid dueDate that aren't done.
 *
 * @param {Array} tasks - User tasks array
 * @returns {string|null} - ISO date string or null
 */
function getNextUrgentDeadline(tasks) {
  const urgentTasks = tasks.filter(
    (t) =>
      (t.priority === "urgent" || t.prio === "Urgent") &&
      t.dueDate &&
      t.status !== "done",
  );

  if (urgentTasks.length === 0) return null;

  const sorted = urgentTasks.sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  );

  return sorted[0].dueDate;
}

/**
 * Formats date and updates deadline element.
 *
 * @param {string} date - ISO date string
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

export {
  loadTaskStats,
  displayTaskStats,
  calculateStats,
  getNextUrgentDeadline,
  updateTaskStatsUI,
  getEmptyStats,
};
