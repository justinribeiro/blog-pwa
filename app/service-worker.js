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
    "revision": "33333333333"
  },
  {
    "url": "manifest.json",
    "revision": "7d1137bead433e3266de95382dba723c"
  },
  {
    "url": "src/blog-pwa.js",
    "revision": "c8ed0ee2b33b13a0737a85021b3a0934"
  },
  {
    "url": "src/blog-static.js",
    "revision": "5037efbbc73492befb783ce5e3dd3a85"
  },
  {
    "url": "src/blog-entry.js",
    "revision": "d7037b5d207ecfc55d3f3e8b4b043ef3"
  },
  {
    "url": "images/manifest/me-2018-150.jpg",
    "revision": "5b540737a9f5bc9294645c0939b36327"
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
