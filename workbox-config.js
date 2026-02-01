/**
 * @fileoverview Workbox Configuration for Join MPA PWA
 * @description Uses injectManifest to preserve custom SW logic while getting Workbox benefits
 * @module workbox-config
 */

module.exports = {
  // Root directory containing all files
  globDirectory: './',

  // Patterns to precache
  globPatterns: [
    'css/**/*.css',
    'js/**/*.js',
    'assets/img/**/*.{png,jpg,jpeg,svg,webp}',
    'assets/fonts/**/*.{woff,woff2}',
    'assets/theme-light/*.png',
    'assets/theme-dark/*.png',
    'config/**/*.js',
    'services/**/*.js',
  ],

  // Ignore patterns
  globIgnores: [
    'node_modules/**/*',
    'old-join-project/**/*',
    'other-projects/**/*',
    '.git/**/*',
    '.github/**/*',
    'workbox-config.js',
    'service-worker-template.js',
    'package*.json',
    '.htaccess',
    '*.md',
    'docs/**/*',
    'assets/manifest-*.webmanifest',
  ],

  // Use template for injectManifest
  swSrc: 'service-worker-template.js',
  swDest: 'service-worker.js',

  // Max file size
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

  // Don't precache manifest files
  manifestTransforms: [
    (manifestEntries) => {
      const manifest = manifestEntries.filter(entry => {
        return !entry.url.includes('manifest') &&
               !entry.url.endsWith('.webmanifest') &&
               entry.size < 2 * 1024 * 1024;
      });
      console.log(`[Workbox] Precaching ${manifest.length} files`);
      return { manifest };
    },
  ],
};
