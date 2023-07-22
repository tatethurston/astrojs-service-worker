# Astro Service Worker

<blockquote>An Astro integration that generates a Service Worker. Powered by Workbox.</blockquote>

<br />

<a href="https://www.npmjs.com/package/astrojs-service-worker">
  <img src="https://img.shields.io/npm/v/astrojs-service-worker.svg">
</a>
<a href="https://github.com/tatethurston/astrojs-service-worker/blob/main/LICENSE">
  <img src="https://img.shields.io/npm/l/astrojs-service-worker.svg">
</a>
<a href="https://bundlephobia.com/result?p=astrojs-service-worker">
  <img src="https://img.shields.io/bundlephobia/minzip/astrojs-service-worker">
</a>
<a href="https://www.npmjs.com/package/astrojs-service-worker">
  <img src="https://img.shields.io/npm/dy/astrojs-service-worker.svg">
</a>
<a href="https://github.com/tatethurston/astrojs-service-worker/actions/workflows/ci.yml">
  <img src="https://github.com/tatethurston/astrojs-service-worker/actions/workflows/ci.yml/badge.svg">
</a>
<a href="https://codecov.io/gh/tatethurston/astrojs-service-worker">
  <img src="https://img.shields.io/codecov/c/github/tatethurston/astrojs-service-worker/main.svg?style=flat-square">
</a>

## What is this? 🧐

A minimal wrapper around [Workbox](https://developers.google.com/web/tools/workbox) to quickly add a [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) to your [Astro](https://astro.build/) static site. Get precached pages and offline support out of the box.

## Installation & Usage 📦

1. Add this package to your project:
   - `npm install astrojs-service-worker` or `yarn add astrojs-service-worker`
2. Add `astrojs-service-worker` to your [astro.config.mjs](https://docs.astro.build/en/reference/configuration-reference/) integrations:

   ```diff
   import { defineConfig } from "astro/config";
   + import serviceWorker from "astrojs-service-worker";

   export default defineConfig({
   +  integrations: [serviceWorker()],
   });
   ```

3. That's it! A service worker that precaches all of your build's static assets will be generated. Page navigations will be served from the service worker's cache instead of making network calls, speeding up your page views and enabling offline viewing 🙌.

_Note that when running `astro dev` a no-op service worker is generated. Service workers interfere with hot module reloading (because they intercept the request for the updated asset), so this no-op service worker clears any existing workers for the page so hot module reloading works as expected._

## Verification 🤔

1. To view the production service worker, run `astro build && astro preview`.
2. The service worker must first install before it intercepts any traffic. You can view the status of the service worker in Chrome by opening the dev console, clicking the `Application` tab and then clicking the `Service Workers` tab.
3. Disable your internet connection and click around your site. Your pages will be served by the service worker. This is most obvious when you are disconnected from the internet, but even when users have an internet connection your pages will be served from the service worker and not from the network -- markedly speeding up page requests.

## API Overview 🛠

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>

<tr>
  <td>registration.autoRegister</td>
<td>

Autoregister the service worker.

If `false`, then the application must initialize the service worker by invoking `register`. Set this to `false` if you'd like to take control over when you service worker is initialized. You'll then need to add something like the following to your application:

```javascript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}
```

Defaults to `true`. Recommended: `true`.

</td>
</td>
  <td>boolean | undefined</td>
</tr>

<tr>
  <td>workbox</td>
<td>
Options passed to `worbox-build`. See all available configuration options [here](https://developer.chrome.com/docs/workbox/modules/workbox-build/)

Defaults to `GenerateSW` which will generate a service worker.

Note: `injectManifest` is not supported at this time. If you would like it to be supported, please [open an issue](https://github.com/tatethurston/astrojs-service-worker/issues/new")

</td>
  <td>InjectManifestOptions | GenerateSWOptions</td>
</tr>
  </tbody>
</table>

Example:

```diff
   import { defineConfig } from "astro/config";
   import serviceWorker from "astrojs-service-worker";

   export default defineConfig({
     integrations: [
       serviceWorker({
+        workbox: { inlineWorkboxRuntime: true }
       })
     ],
   });
```

## Common Service Worker Pitfalls ⚠️

You must serve your application over HTTPS in production environments. [Service Workers must be served from the site's origin over HTTPS](https://developers.google.com/web/fundamentals/primers/service-workers).

Some browsers special case `localhost`, so this may not be necessary during local development. HTTPS is _not_ handled by this library. You can use a reverse proxy like [Nginx](https://www.nginx.com/) or [Caddy](https://caddyserver.com/) if you want to setup HTTPS for local development.

The service worker origin constraint means that service workers can not control pages on a different subdomain. Eg `mysite.com` can not be controlled by a service worker if that was served from a subdomain such as `mycdn.mysite.com`. To learn more about how service workers work in general, read [MDN's documentation](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

## Production Sites Using astrojs-service-woker

My blog, [tatethurston.com](https://www.tatethurston.com/). You can use this site to get a sense of the capabilities enabled by this package. If you have any questions, feel free to [open an issue](https://github.com/tatethurston/astrojs-service-worker/issues/new).

## Contributing 👫

PR's and issues welcomed! For more guidance check out [CONTRIBUTING.md](https://github.com/tatethurston/astrojs-service-worker/blob/main/CONTRIBUTING.md)

## Licensing 📃

See the project's [MIT License](https://github.com/tatethurston/astrojs-service-worker/blob/main/LICENSE).
