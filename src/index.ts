import type { AstroIntegration } from "astro";
import { join } from "node:path";
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
  workboxConfig: InjectManifestOptions | GenerateSWOptions | undefined
): workboxConfig is InjectManifestOptions {
  return !!workboxConfig && "swSrc" in workboxConfig;
}

const PKG_NAME = "astrojs-service-worker";

const createPlugin = (options: ServiceWorkerConfig = {}): AstroIntegration => {
  const SW_NAME = "service-worker.js";

  return {
    name: PKG_NAME,
    hooks: {
      "astro:config:setup": ({ injectRoute, injectScript }) => {
        const autoRegister = options.registration?.autoRegister ?? true;
        if (autoRegister) {
          injectScript(
            "head-inline",
            `\
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/${SW_NAME}').then((sw) => {
    console.log('here');
  });
}`
          );
        }
        const enableInDevelopment = options.enableInDevelopment ?? false;
        const isDevelopment =
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === undefined;

        if (!enableInDevelopment && isDevelopment) {
          injectRoute({
            pattern: `/${SW_NAME}`,
            entryPoint: new URL("./service-worker.js.js", import.meta.url)
              .pathname,
          });
        }
      },
      "astro:build:done": async ({ dir }) => {
        if (isInjectManifest(options.workbox)) {
          console.error(
            "[astrojs-service-worker] injectManifest is not supported at this time. If you would like it to be supported, please open an issue at https://github.com/tatethurston/astrojs-service-worker/issues/new"
          );
          return;
        }
        const out = dir.pathname;

        const defaults = {
          swDest: join(out, SW_NAME),
          globDirectory: out,
          clientsClaim: true,
          skipWaiting: true,
          sourcemap: false,
          cleanupOutdatedCaches: true,
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
