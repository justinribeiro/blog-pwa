/* eslint-env node */
module.exports = {
  swDest: 'service-worker.js',
  importWorkboxFrom: 'cdn',
  skipWaiting: false,
  clientsClaim: true,
  offlineGoogleAnalytics: true,
  cleanupOutdatedCaches: true,
  cacheId: 'BLOG-PWA',
  globDirectory: '.',
  globPatterns: [
    'index.html',
    'src/app.js',
    'src/blog-pwa.js',
    'src/blog-static.js',
    'src/blog-entry.js',
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!.*\.html).*/],
  navigateFallbackBlacklist: [/xml/],
  ignoreURLParametersMatching: [/^utm_/],
  runtimeCaching: [
    {
      urlPattern: /.*\?static=true/,
      handler: 'NetworkOnly',
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-cache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
    {
      urlPattern: /\.(?:png|gif|jpg|jpeg|svg|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'img-cache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
    {
      urlPattern: /\.(?:json)$/,
      handler: 'NetworkFirst',
      options: {
        networkTimeoutSeconds: 3,
        cacheName: 'data-cache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
    {
      urlPattern: /^https:\/\/storage.googleapis\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-cache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
};
