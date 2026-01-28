/**
 * @fileoverview Header Authentication Module
 * @description Handles user logout process and session cleanup.
 * @module header/header-auth
 */

import { signOutUser } from "../../services/auth.service.js";
import { showSplash } from "../../services/splash.service.js";

/**
 * Handles user logout process.
 * Clears session, signs out user, and redirects to login.
 */
async function handleLogout() {
  try {
    showSplash();
    await signOutUser();
    localStorage.removeItem("joinUser");
    sessionStorage.removeItem("joinUser");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  } catch (error) {
    console.error("[handleLogout] Error:", error);
  }
}

export { handleLogout };
