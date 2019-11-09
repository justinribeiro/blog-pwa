/* eslint-env node */
module.exports = {
  swDest: './build/default/service-worker.js',
  importWorkboxFrom: 'cdn',
  skipWaiting: false,
  clientsClaim: true,
  offlineGoogleAnalytics: true,
  cleanupOutdatedCaches: true,
  cacheId: 'BLOG-PWA',
  globDirectory: './build/default/',
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
          maxAgeSeconds: 365 * 24 * 60 * 60,
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
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 200,
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
  ],
};
