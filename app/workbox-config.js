/* eslint-env node */
module.exports = {
  swDest: './build/default/service-worker.js',
  inlineWorkboxRuntime: true,
  skipWaiting: true,
  clientsClaim: true,
  offlineGoogleAnalytics: true,
  cleanupOutdatedCaches: true,
  cacheId: 'BLOG-PWA',
  globDirectory: './build/default/',
  globPatterns: ['index.html', '**/blog-*.js'],
  navigateFallback: '/index.html',
  navigateFallbackAllowlist: [/^(?!.*\.html).*/],
  navigateFallbackDenylist: [/xml/],
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
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'img-cache',
        expiration: {
          maxEntries: 250,
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
      urlPattern: /^https:\/\/us-west2-justinribeiro-web\.cloudfunctions\.net/,
      handler: 'NetworkFirst',
      options: {
        networkTimeoutSeconds: 3,
        cacheName: 'link-cache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
    {
      urlPattern: /^https:\/\/storage\.googleapis\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-cache',
        cacheableResponse: {
          statuses: [0, 200],
        },
        expiration: {
          maxEntries: 250,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        cacheableResponse: {
          statuses: [0, 200],
        },
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
  ],
};
