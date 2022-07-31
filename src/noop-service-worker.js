self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

console.info(
  "[astrojs-service-worker] This is a noop service worker for local development. This ensures that a previously installed service worker is ejected. The configured service worker will be generated in production builds. You can opt into service worker generation in local development by setting `serviceWorker.enableInDevelopment: true` in your astro.config.mjs. See https://github.com/tatethurston/astrojs-service-worker for configuration options."
);
