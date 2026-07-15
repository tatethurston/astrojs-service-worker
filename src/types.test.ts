/**
 * Type-level tests for `astrojs-service-worker`'s public API.
 *
 * Nothing here runs at runtime -- these exist purely so that `tsc --noEmit`
 * (invoked by `npm run typecheck` / `npm run lint`) can catch accidental
 * breaking changes to the exported types. Positive cases assert that valid
 * configs are accepted; `@ts-expect-error` cases assert that invalid
 * configs are rejected (and will themselves fail to compile if the
 * surrounding line stops erroring, e.g. because a type was accidentally
 * widened).
 */
import { type ServiceWorkerConfig } from "./index.js";

/** Consumes a value for its type only */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function expectType<T>(_value: T): void {}

// ---------------------------------------------------------------------------
// Top Level API
// ---------------------------------------------------------------------------

/* enableInDevelopment */

expectType<ServiceWorkerConfig>({ enableInDevelopment: true });
expectType<ServiceWorkerConfig>({ enableInDevelopment: false });

/* registration */

expectType<ServiceWorkerConfig>({ registration: { autoRegister: true } });
expectType<ServiceWorkerConfig>({ registration: {} });

// ---------------------------------------------------------------------------
// Workbox
// ---------------------------------------------------------------------------

// omit swDest
expectType<ServiceWorkerConfig>({
  workbox: {
    globDirectory: "dist",
    globPatterns: ["**/*.{js,css,html}"],
    skipWaiting: true,
    clientsClaim: true,
  },
});

// provide swDest
expectType<ServiceWorkerConfig>({
  workbox: {
    swDest: "custom-sw.js",
    globDirectory: "dist",
  },
});
