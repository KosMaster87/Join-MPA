// Register the service worker for PWA support
// (function () {
//   if ("serviceWorker" in navigator) {
//     window.addEventListener("load", function () {
//       navigator.serviceWorker
//         .register("/service-worker.js")
//         .then(function (reg) {
//           console.log("Service Worker registered!", reg);
//         })
//         .catch(function (err) {
//           console.warn("Service Worker registration failed:", err);
//         });
//     });
//   }
// })();

// Register the service worker for PWA support
// (function () {
//   if ("serviceWorker" in navigator) {
//     window.addEventListener("load", async function () {
//       try {
//         const reg =
//           await navigator.serviceWorker.register("/service-worker.js");
//         console.log("Service Worker registered!", reg);
//       } catch (err) {
//         console.warn("Service Worker registration failed:", err);
//       }
//     });
//   }
// })();

// Register the service worker for PWA support (ES6 module version)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async function () {
    try {
      const reg = await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service Worker registered!", reg);
    } catch (err) {
      console.warn("Service Worker registration failed:", err);
    }
  });
}
