/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/* eslint-env node */

module.exports = {
  cacheId: 'BLOG-PWA',
  staticFileGlobs: [
    '/index.html',
    '/manifest.json',
    '/node_modules/@webcomponents/webcomponentsjs/**',
    '/node_modules/web-animations-js/web-animations-next-lite.min.js',
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!.*\.html|.\/data\/).*/],
  ignoreUrlParametersMatching: [/^utm_/],
  runtimeCaching: [
    {
      urlPattern: /.*\?static\=true/,
      handler: 'networkOnly',
      options: { },
    },
    {
      urlPattern: /\/images\/.*/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 200,
          name: 'image-cache',
        },
      },
    },
    {
      urlPattern: /https:\/\/storage.googleapis\.com\/.*/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 200,
          name: 'cdn-cache',
        },
      },
    },
    {
      urlPattern: /\/data\/.*/,
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 200,
          name: 'data-cache',
        },
      },
    },
  ],
};
