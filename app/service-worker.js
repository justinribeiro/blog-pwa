/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js");

workbox.core.setCacheNameDetails({prefix: "BLOG-PWA"});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "2141b80585e607643aa079e7ac2810c9"
  },
  {
    "url": "manifest.json",
    "revision": "7d1137bead433e3266de95382dba723c"
  },
  {
    "url": "src/blog-pwa.js",
    "revision": "9a493cd3244fb134dc1445a55241305d"
  },
  {
    "url": "src/blog-static.js",
    "revision": "38f016a4d5f935eefea0607380a0cb14"
  },
  {
    "url": "src/blog-entry.js",
    "revision": "194b3991862c980927502c3e1c451b83"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  "ignoreURLParametersMatching": [/^utm_/]
});

workbox.precaching.cleanupOutdatedCaches();
workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"), {
  whitelist: [/^(?!.*\.html).*/],
  blacklist: [/xml/],
});

workbox.routing.registerRoute(/.*\?static\=true/, new workbox.strategies.NetworkOnly(), 'GET');
workbox.routing.registerRoute(/\.(?:js|css)$/, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"static-cache", plugins: [new workbox.expiration.Plugin({ maxEntries: 200, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/\.(?:png|gif|jpg|jpeg|svg)$/, new workbox.strategies.CacheFirst({ "cacheName":"img-cache", plugins: [new workbox.expiration.Plugin({ maxEntries: 200, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/\.(?:json)$/, new workbox.strategies.NetworkFirst({ "cacheName":"data-cache","networkTimeoutSeconds":3, plugins: [new workbox.expiration.Plugin({ maxEntries: 200, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/storage.googleapis\.com/, new workbox.strategies.CacheFirst({ "cacheName":"cdn-cache", plugins: [new workbox.expiration.Plugin({ maxEntries: 200, purgeOnQuotaError: false })] }), 'GET');

workbox.googleAnalytics.initialize({});
