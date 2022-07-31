import type { AstroIntegration } from "astro";
import { join } from "path";
import {
  generateSW,
  type GenerateSWOptions,
  type InjectManifestOptions,
} from "workbox-build";

export interface ServiceWorkerConfig {
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
      "astro:config:setup": ({ injectScript }) => {
        const autoRegister = options.registration?.autoRegister ?? true;
        if (autoRegister) {
          injectScript(
            "page",
            `\
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/${SW_NAME}');
  }`
          );
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
