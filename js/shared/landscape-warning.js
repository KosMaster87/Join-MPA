/**
 * @fileoverview Landscape Warning Service
 * @description Shows a warning overlay in browser (not PWA) when device is in landscape mode
 * @module shared/landscape-warning
 */

/**
 * Check if app is running in standalone mode (PWA)
 * @returns {boolean} True if running as PWA
 */
function isPWA() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    document.referrer.includes("android-app://")
  );
}

/**
 * Create landscape warning overlay HTML
 * @returns {string} HTML string for the overlay
 */
function createLandscapeWarningHTML() {
  return `
    <div class="landscape-warning" id="landscapeWarning">
      <h2 class="landscape-warning__title">Only Portrait Mode Supported</h2>

      <p class="landscape-warning__text">
        For the best user experience, please rotate your device to portrait mode.
      </p>

      <p class="landscape-warning__text">
        It is also recommended to install the app for additional features.
      </p>

      <div class="landscape-warning__actions">
        <button id="installPWABtn" class="landscape-warning__btn landscape-warning__btn--primary">
          Install App
        </button>
      </div>
    </div>
  `;
}

/**
 * Insert landscape warning into DOM
 * Check if already exists before inserting
 * @return {void}
 */
function insertLandscapeWarning() {
  if (document.getElementById("landscapeWarning")) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = createLandscapeWarningHTML();
  document.body.appendChild(wrapper.firstElementChild);

  setupInstallButton();
}

/**
 * Setup PWA install button functionality
 */
function setupInstallButton() {
  const installBtn = document.getElementById("installPWABtn");
  if (!installBtn) return;

  // Check if install prompt is available
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    installBtn.style.display = "inline-block";
  });

  installBtn.addEventListener("click", async () => {
    if (!window.deferredPrompt) {
      alert("Installation has already been completed or is not available.");
      return;
    }

    window.deferredPrompt.prompt();
    const { outcome } = await window.deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("[Landscape Warning] PWA installation accepted");
    }

    window.deferredPrompt = null;
  });
}

/**
 * Check if device is currently in landscape orientation
 * @returns {boolean} True if landscape
 */
function isLandscape() {
  return window.innerWidth > window.innerHeight && window.innerWidth <= 1080;
}

/**
 * Lock body scrolling when landscape warning is visible
 */
function lockBodyScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.top = `-${window.scrollY}px`;
}

/**
 * Unlock body scrolling
 */
function unlockBodyScroll() {
  const scrollY = document.body.style.top;
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.style.top = "";
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }
}

/**
 * Show or hide landscape warning based on PWA status and orientation
 */
function updateLandscapeWarningVisibility() {
  const warning = document.getElementById("landscapeWarning");
  if (!warning) return;

  const shouldShow = !isPWA() && isLandscape();

  if (shouldShow) {
    warning.classList.remove("landscape-warning--hidden");
    lockBodyScroll();
  } else {
    warning.classList.add("landscape-warning--hidden");
    unlockBodyScroll();
  }
}

/**
 * Initialize landscape warning service
 */
function initLandscapeWarning() {
  // Only initialize on mobile devices
  const isMobile = window.innerWidth <= 1080;
  if (!isMobile) return;

  // Insert warning overlay
  insertLandscapeWarning();

  // Update visibility based on PWA status
  updateLandscapeWarningVisibility();

  // Listen for orientation changes
  window.addEventListener("orientationchange", () => {
    setTimeout(updateLandscapeWarningVisibility, 100);
  });

  // Listen for resize (catches rotation on some devices)
  window.addEventListener("resize", () => {
    updateLandscapeWarningVisibility();
  });

  // Listen for display mode changes (PWA installation)
  window
    .matchMedia("(display-mode: standalone)")
    .addEventListener("change", (e) => {
      if (e.matches) {
        updateLandscapeWarningVisibility();
      }
    });
}

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLandscapeWarning);
} else {
  initLandscapeWarning();
}

export { isPWA, initLandscapeWarning, updateLandscapeWarningVisibility };
