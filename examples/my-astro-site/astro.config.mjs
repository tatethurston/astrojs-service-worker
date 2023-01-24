import { defineConfig } from "astro/config";
import serviceWorker from "astrojs-service-worker";

export default defineConfig({
  integrations: [serviceWorker()],
});
