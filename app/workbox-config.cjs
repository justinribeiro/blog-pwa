/* eslint-env node */
module.exports = {
  swDest: './build/default/service-worker.js',
  inlineWorkboxRuntime: true,
  skipWaiting: false,
  clientsClaim: true,
  offlineGoogleAnalytics: false,
  cleanupOutdatedCaches: true,
  cacheId: 'BLOG-PWA',
  globDirectory: './build/default/',
  globPatterns: ['sw-shell.html', '**/blog-*.js'],
  navigateFallback: '/sw-shell.html',
  navigateFallbackAllowlist: [/^(?!.*\.html).*/],
  navigateFallbackDenylist: [/xml/],
  ignoreURLParametersMatching: [/^utm_/],
  babelPresetEnvTargets: ['> 0.75% and last 2 versions'],
  runtimeCaching: [
    {
      urlPattern: /.*\?static=true/,
      handler: 'NetworkOnly',
    },
    {
      urlPattern: /\.(?:js|css|webmanifest)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-cache',
        expiration: {
          maxEntries: 200,
          purgeOnQuotaError: true,
          matchOptions: {
            ignoreVary: true,
          },
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
          purgeOnQuotaError: true,
          matchOptions: {
            ignoreVary: true,
          },
        },
      },
    },
    {
      urlPattern:
        /^https:\/\/us-west(?:1|2)-justinribeiro-web\.cloudfunctions\.net/,
      handler: 'NetworkFirst',
      options: {
        networkTimeoutSeconds: 3,
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 200,
          purgeOnQuotaError: true,
          matchOptions: {
            ignoreVary: true,
          },
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
          maxEntries: 500,
          maxAgeSeconds: 60 * 60 * 24 * 365,
          purgeOnQuotaError: true,
          matchOptions: {
            ignoreVary: true,
          },
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        cacheableResponse: {
          statuses: [0, 200],
        },
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
