// Dynamically load the correct manifest and favicon based on user's color scheme
(function () {
  const head = document.head;

  // Remove existing manifest/favicons
  function removeOldLinks() {
    document
      .querySelectorAll('link[rel="manifest"], link[rel*="icon"]')
      .forEach((el) => el.remove());
  }

  // Add manifest and favicon for the theme
  function addThemeLinks(theme) {
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href =
      theme === "dark"
        ? "./assets/manifest-dark.webmanifest"
        : "./assets/manifest-light.webmanifest";
    head.appendChild(manifest);

    // Favicon
    const favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href =
      theme === "dark"
        ? "./assets/theme-dark/favicon.png"
        : "./assets/theme-light/favicon.png";
    head.appendChild(favicon);
  }

  // Detect theme
  function getTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  // Initial load
  removeOldLinks();
  addThemeLinks(getTheme());

  // Listen for changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      removeOldLinks();
      addThemeLinks(e.matches ? "dark" : "light");
    });
})();
