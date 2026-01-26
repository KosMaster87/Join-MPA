/**
 * @fileoverview Development server with LiveReload support.
 * @description This module sets up a local development server with LiveReload support.
 * @module dev-server
 */

import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectLivereload from "connect-livereload";
import { createServer } from "net";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const DEFAULT_PORT = 3000;
const rootPages = ["login", "register", "summary"];

// LiveReload middleware only in development
if (process.env.NODE_ENV !== "production") {
  app.use(
    connectLivereload({
      port: 35729,
    }),
  );
}

// Block direct access to /pages/* (like .htaccess)
app.use("/pages", (req, res, next) => {
  res.status(403).send("Forbidden");
});

// Serve static files for main folders
// (Alle anderen Ordner wie assets, css, js, ...)
app.use("/assets", express.static(join(__dirname, "assets")));
app.use("/css", express.static(join(__dirname, "css")));
app.use("/js", express.static(join(__dirname, "js")));
app.use("/services", express.static(join(__dirname, "services")));
app.use("/config", express.static(join(__dirname, "config")));
app.use(express.static(__dirname)); // fallback for root files like index.html

// Redirect root html files to /pages
rootPages.forEach((page) => {
  app.get(`/${page}.html`, (req, res) => {
    res.sendFile(join(__dirname, "pages", `${page}.html`));
  });
});

/**
 * Checks if a port is available.
 * @param {number} port - The port number to check.
 * @returns {Promise<boolean>} Resolves true if the port is available, false otherwise.
 */
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
};

/**
 * Finds an available port starting from the given port.
 * @param {number} startPort - The port number to start searching from.
 * @returns {Promise<number>} Resolves with the first available port found.
 * @throws {Error} If no available port is found within the next 10 ports.
 */
const findAvailablePort = async (startPort) => {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
    if (port > startPort + 10) {
      throw new Error("No available port found");
    }
  }
  return port;
};

/**
 * Starts the Express server on an available port.
 * Logs the server status and port information.
 * Exits the process if unable to start.
 * @async
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    const port = await findAvailablePort(DEFAULT_PORT);

    app.listen(port, () => {
      console.log(`🚀 Join MPA is running at http://localhost:${port}`);
      if (port !== DEFAULT_PORT) {
        console.log(`⚠️  Port ${DEFAULT_PORT} was busy, using port ${port}`);
      }
      console.log(`📝 Open Chrome and navigate to these URLs:`);
      console.log(`   - http://localhost:${port}/`);
      console.log(`✨ F5/Reload works on all pages!`);

      if (process.env.NODE_ENV !== "production") {
        console.log(`🔄 LiveReload running on port 35729`);
        console.log(`💡 Browser will auto-reload on file changes!`);
      }
    });
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();
