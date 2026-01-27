// @module shared/theme-service
// ThemeService: Handles theme switching (light, dark, device) and applies theme to the app.

const THEMES = ["device", "light", "dark"];
const THEME_ICONS = {
  device: "../assets/img/theme/device.svg",
  light: "../assets/img/theme/light-mode.svg",
  dark: "../assets/img/theme/dark-mode.svg",
};

function getNextTheme(current) {
  const idx = THEMES.indexOf(current);
  return THEMES[(idx + 1) % THEMES.length];
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  let realTheme = theme;
  if (theme === "device") realTheme = getSystemTheme();
  document.body.style.setProperty(
    "background-color",
    realTheme === "dark" ? "var(--color-gray-400)" : "var(--color-gray-50)",
  );
  // Update icon if present
  const icon = document.getElementById("headerThemeIcon");
  if (icon) icon.src = THEME_ICONS[theme];
}

function setTheme(theme) {
  localStorage.setItem("joinTheme", theme);
  applyTheme(theme);
}

function initTheme() {
  const theme = localStorage.getItem("joinTheme") || "device";
  applyTheme(theme);
}

export {
  THEMES,
  THEME_ICONS,
  getNextTheme,
  getSystemTheme,
  applyTheme,
  setTheme,
  initTheme,
};
