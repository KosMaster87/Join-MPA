/**
 * @fileoverview Summary Content HTML Template
 * @description Provides the HTML structure for the Summary Dashboard, including sections for task statistics,
 *              urgent task deadlines, and personalized greetings.
 * @module templates/summary-content
 */

/**
 * Generates the HTML content for the Summary Dashboard.
 *
 * @returns {string} HTML string representing the Summary Dashboard layout.
 */
export function getSummaryContentHTML() {
  return `
    <!-- Mobile Greeting (shows on login) -->
    <div class="summary__greeting-mobile hide" id="greetingsMobile">
      <p class="summary__greeting-mobile-text" id="greetingMobile"></p>
    </div>

    <div class="summary__content" id="summaryToDos">
      <div class="summary__stats-wrapper">
        <div class="summary__header">
          <h1 class="summary__headline">Join 360</h1>
          <p class="summary__subheadline">Key Metrics at a Glance</p>
          <div class="summary__divider"></div>
        </div>

        <!-- Row 1: To-Do and Done -->
        <div class="summary__row summary__row--1">
          <div
            class="summary__card summary__card--todo"
            onclick="navigateToBoard()"
          >
            <img
              src="../assets/img/summary/pencil-blue.svg"
              alt="Edit"
              class="summary__card-icon summary__card-icon--pencil"
              data-icon="pencil"
              data-theme-light="../assets/img/summary/pencil-blue.svg"
              data-theme-dark="../assets/img/summary/pencil-white.svg"
            />
            <div class="summary__card-content">
              <p class="summary__card-number" id="summaryTodoTodos">0</p>
              <p class="summary__card-label">To-do</p>
            </div>
          </div>

          <div
            class="summary__card summary__card--done"
            onclick="navigateToBoard()"
          >
            <img
              src="../assets/img/summary/check-blue.svg"
              alt="Check"
              class="summary__card-icon summary__card-icon--check"
              data-icon="check"
              data-theme-light="../assets/img/summary/check-blue.svg"
              data-theme-dark="../assets/img/summary/check-white.svg"
            />
            <div class="summary__card-content">
              <p class="summary__card-number" id="summaryDoneTodos">0</p>
              <p class="summary__card-label">Done</p>
            </div>
          </div>
        </div>

        <!-- Row 2: Urgent with Deadline -->
        <div
          class="summary__card summary__card--urgent"
          onclick="navigateToBoard()"
        >
          <div class="summary__urgent-left">
            <img
              src="../assets/img/summary/urgency-default.svg"
              alt="Urgent"
              class="summary__card-icon"
            />
            <div class="summary__card-content">
              <p class="summary__card-number" id="summaryUpcomingTasks">0</p>
              <p class="summary__card-label">Urgent</p>
            </div>
          </div>
          <div class="summary__urgent-right">
            <div class="summary__urgent-divider"></div>
            <div class="summary__deadline">
              <p class="summary__deadline-date" id="summaryUrgentDate">-</p>
              <p class="summary__deadline-label">Upcoming Deadline</p>
            </div>
          </div>
        </div>

        <!-- Row 3: Board, Progress, Feedback -->
        <div class="summary__row summary__row--3">
          <div
            class="summary__card summary__card--small"
            onclick="navigateToBoard()"
          >
            <div class="summary__card-content">
              <p class="summary__card-number" id="dataTodos">0</p>
              <p class="summary__card-label">Tasks in<br />Board</p>
            </div>
          </div>

          <div
            class="summary__card summary__card--small"
            onclick="navigateToBoard()"
          >
            <div class="summary__card-content">
              <p class="summary__card-number" id="summaryProcessTasks">0</p>
              <p class="summary__card-label">Tasks in<br />Progress</p>
            </div>
          </div>

          <div
            class="summary__card summary__card--small"
            onclick="navigateToBoard()"
          >
            <div class="summary__card-content">
              <p class="summary__card-number" id="summaryAwaitingTask">0</p>
              <p class="summary__card-label">Awaiting<br />Feedback</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Greeting Section (Desktop) -->
      <div class="summary__greeting-desktop">
        <h1 class="summary__greeting-time" id="greetingsDesktop">
          Good morning,
        </h1>
        <p class="summary__greeting-name" id="greetingNameDesktop">Guest</p>
      </div>
    </div>
`;
}
