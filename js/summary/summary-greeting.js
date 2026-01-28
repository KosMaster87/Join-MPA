/**
 * @fileoverview Summary Greeting Module
 * @description Handles personalized greetings based on time of day and user name,
 *              with mobile-specific greeting animations.
 * @module summary/summary-greeting
 */

/**
 * Gets greeting text based on hour of day.
 *
 * @param {number} hour - Hour of day (0-23)
 * @returns {string} - Greeting message
 */
function getGreetingByTime(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Extracts display name from user data.
 * Falls back to "Guest" if no user data or name available.
 *
 * @param {Object|null} userData - User data from Firestore
 * @returns {string} - Display name
 */
function getDisplayNameFromUserData(userData) {
  if (!userData) return "Guest";
  if (userData.isGuest) return "Guest";
  if (userData.name?.trim().length > 0) return userData.name;
  return "User";
}

/**
 * Checks if greeting was already shown in this session.
 *
 * @returns {boolean} - True if greeting was shown
 */
function hasGreetingBeenShown() {
  return sessionStorage.getItem("showedLoginGreeting") === "true";
}

/**
 * Marks greeting as shown in session storage.
 */
function markGreetingAsShown() {
  sessionStorage.setItem("showedLoginGreeting", "true");
}

/**
 * Shows mobile greeting screen with animation.
 * Fades in then fades out after 2.5 seconds.
 */
async function displayGreetScreen() {
  const greetingsMobile = document.getElementById("greetingsMobile");
  if (!greetingsMobile) return;

  greetingsMobile.classList.remove("hide");
  greetingsMobile.classList.add("show");

  setTimeout(() => {
    greetingsMobile.classList.remove("show");
    greetingsMobile.classList.add("hide");
  }, 2500);
}

/**
 * Updates greeting elements with time and user name.
 *
 * @param {string} greeting - Greeting message (e.g., "Good morning")
 * @param {string} displayName - User display name
 */
function updateGreetingElements(greeting, displayName) {
  const timeElement = document.getElementById("greetingsDesktop");
  const RefGreetingNameDesktop = document.getElementById("greetingNameDesktop");
  const mobileElement = document.getElementById("greetingMobile");

  if (timeElement) timeElement.textContent = greeting + ",";
  if (RefGreetingNameDesktop) RefGreetingNameDesktop.textContent = displayName;
  if (mobileElement) {
    mobileElement.textContent = greeting + ", " + displayName;
  }
}

/**
 * Displays personalized greeting based on time and user data.
 *
 * @param {Object|null} userData - User data from Firestore
 */
async function displayGreeting(userData) {
  try {
    const hour = new Date().getHours();
    const greeting = getGreetingByTime(hour);
    const displayName = getDisplayNameFromUserData(userData);
    updateGreetingElements(greeting, displayName);
  } catch (error) {
    console.error("[displayGreeting] Error:", error);
  }
}

/**
 * Initializes greeting display on mobile after login.
 * Shows animated greeting once per session on mobile.
 */
async function initGreeting() {
  try {
    if (hasGreetingBeenShown() || window.innerWidth > 720) return;

    await displayGreetScreen();
    markGreetingAsShown();

    const summaryToDos = document.getElementById("summaryToDos");
    if (summaryToDos) summaryToDos.style.display = "flex";
  } catch (error) {
    console.error("[initGreeting] Error:", error);
  }
}

/**
 * Shows todo section container.
 */
function showSummaryToDos() {
  const summaryToDos = document.getElementById("summaryToDos");
  if (summaryToDos) summaryToDos.style.display = "flex";
}

/**
 * Hides greeting and header initials until user data loads.
 *
 * @returns {Object} Object containing greeting element references
 */
function hideGreetingElements() {
  const greetingName = document.getElementById("greetingNameDesktop");
  const headerInitials = document.getElementById("userInitials");

  if (greetingName) greetingName.classList.add("hide");
  if (headerInitials) headerInitials.classList.add("hide");

  return { greetingName, headerInitials };
}

/**
 * Shows greeting and header initials.
 *
 * @param {Object} elements - Object with greetingName and headerInitials elements
 */
function showGreetingElements(elements) {
  const { greetingName, headerInitials } = elements;

  if (greetingName) greetingName.classList.remove("hide");
  if (headerInitials) headerInitials.classList.remove("hide");
}

export {
  getGreetingByTime,
  getDisplayNameFromUserData,
  hideGreetingElements,
  showGreetingElements,
  hasGreetingBeenShown,
  markGreetingAsShown,
  displayGreeting,
  displayGreetScreen,
  initGreeting,
  showSummaryToDos,
  updateGreetingElements,
};
