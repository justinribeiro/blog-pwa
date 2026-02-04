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
        networkTimeoutSeconds: 2,
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
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        networkTimeoutSeconds: 2,
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 20,
          purgeOnQuotaError: true,
        },
        cacheableResponse: {
          statuses: [0, 200], // cache successful + opaque responses
        },
      },
    },
    // bit of hack; you can't run workbox-range-requests plugin with the
    // cacheAble response (it falls apart), but we can divide and conquer
    // against media types where 206's occur
    // ideal = no (terrible regex) but hey, it works
    {
      urlPattern:
        /^https:\/\/storage\.googleapis\.com\/.*\.(mp4|mp3|webm)(?:\?|$)/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'media-cache',
        rangeRequests: true,
      },
    },
    {
      urlPattern:
        /^https:\/\/storage\.googleapis\.com(?!.*\.(mp4|mp3|webm)(?:\?|$))/,
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
      urlPattern: /^https:\/\/.*\.ytimg\.com\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'youtube-thumbnails',
        cacheableResponse: {
          statuses: [0, 200],
        },
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          purgeOnQuotaError: true,
        },
        matchOptions: {
          ignoreVary: true,
        },
      },
    },
  ],
};
