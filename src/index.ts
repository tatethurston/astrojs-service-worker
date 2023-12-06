import type { AstroIntegration } from "astro";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateSW,
  type GenerateSWOptions,
  type InjectManifestOptions,
} from "workbox-build";

export interface ServiceWorkerConfig {
  /**
   * Enable the service worker in local development.
   *
   * The service worker's precaching of static files will prevent hot module reloading during development.
   *
   * If `false` then the service worker will not be registered and any previously installed service workers will be cleared.
   *
   * Defaults to `false`. Recommended: `false` for general development, `true` when testing or debugging your application's service worker.
   */
  enableInDevelopment?: boolean;
  registration?: {
    /**
     * Autoregister the service worker.
     *
     * If `false`, then the application must initialize the service worker by invoking `register`. Set this to `false` if you'd like to take control over when you service worker is initialized. You'll then need to add something like the following to your application:
     *
     * ```javascript
     * import { Workbox } from 'workbox-window';
     *
     * if ('serviceWorker' in navigator) {
     *   navigator.serviceWorker.register('/service-worker.js')
     * }
     * ```
     *
     * Defaults to `true`. Recommended: `true`.
     */
    autoRegister?: boolean;
  };
  /**
   * Options passed to `worbox-build`. See all available configuration options [here](https://developer.chrome.com/docs/workbox/modules/workbox-build/)
   *
   * Defaults to `GenerateSW` which will generate a service worker.
   */
  workbox?: InjectManifestOptions | GenerateSWOptions;
}

function isInjectManifest(
  workboxConfig: InjectManifestOptions | GenerateSWOptions | undefined,
): workboxConfig is InjectManifestOptions {
  return !!workboxConfig && "swSrc" in workboxConfig;
}

const PKG_NAME = "astrojs-service-worker";

const createPlugin = (options: ServiceWorkerConfig = {}): AstroIntegration => {
  const SW_NAME = "service-worker.js";

  return {
    name: PKG_NAME,
    hooks: {
      "astro:config:setup": ({
        command,
        injectRoute,
        injectScript,
        config,
      }) => {
        const swPath = join(config.base, SW_NAME);
        const autoRegister = options.registration?.autoRegister ?? true;
        if (autoRegister) {
          injectScript(
            "head-inline",
            `\
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('${swPath}');
}`,
          );
        }
        const enableInDevelopment = options.enableInDevelopment ?? false;
        const isDevelopment = command === "dev";
        if (!enableInDevelopment && isDevelopment) {
          injectRoute({
            pattern: swPath,
            entrypoint: fileURLToPath(
              new URL("./service-worker.js.js", import.meta.url),
            ),
          });
        }
      },
      "astro:build:done": async ({ dir }) => {
        if (isInjectManifest(options.workbox)) {
          console.error(
            "[astrojs-service-worker] injectManifest is not supported at this time. If you would like it to be supported, please open an issue at https://github.com/tatethurston/astrojs-service-worker/issues/new",
          );
          return;
        }
        const out = fileURLToPath(dir);

        const defaults = {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          globDirectory: out,
          globPatterns: ["**/*"],
          skipWaiting: true,
          sourcemap: false,
          swDest: join(out, SW_NAME),
        };

        try {
          await generateSW({
            ...defaults,
            ...options.workbox,
          });
        } catch (e) {
          console.error(e);
        }
      },
    },
  };
};

export default createPlugin;
