const {findSupportedBrowsers} = require('@open-wc/building-utils');
const customMinifyCss = require('@open-wc/building-utils/custom-minify-css');
const resolve = require('rollup-plugin-node-resolve');
const {terser} = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const filesize = require('rollup-plugin-filesize');

// This is my light spin off of the open-wc building-rollup package:
// https://github.com/open-wc/open-wc/tree/master/packages/building-rollup If
// you're looking for something to use in your project, start there (I use their
// base setup with great success in other projects)
export default {
  input: [
    'src/app.js',
    'src/blog-pwa.js',
    'src/blog-static.js',
    'src/blog-entry.js',
    'src/lazy-resources.js',
    'src/analytics.js',
    'src/3d-utils.js',
    'src/code-block.js',
  ],
  treeshake: true,
  output: {
    dir: 'build/default/src',
    format: 'es',
    sourcemap: true,
    dynamicImportFunction: '__import',
  },
  plugins: [
    resolve(),
    babel({
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        // rollup rewrites import.meta.url, but makes them point to the file
        // location after bundling we want the location before bundling
        'bundled-import-meta',
        [
          'template-html-minifier',
          {
            modules: {
              'lit-html': ['html'],
              'lit-element': ['html', {name: 'css', encapsulation: 'style'}],
            },
            htmlMinifier: {
              collapseWhitespace: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: customMinifyCss,
            },
          },
        ],
      ],

      presets: [
        [
          '@babel/preset-env',
          {
            targets: findSupportedBrowsers(),
            // preset-env compiles template literals for safari 12 due to a
            // small bug which doesn't affect most use cases. for example
            // lit-html handles it:
            // (https://github.com/Polymer/lit-html/issues/575)
            exclude: ['@babel/plugin-transform-template-literals'],
            useBuiltIns: false,
            modules: false,
          },
        ],
      ],
    }),
    terser({
      compress: {
        inline: 0,
        drop_console: true,
        ecma: 8,
      },
      mangle: {
        reserved: ['__import'],
      },
    }),
    filesize({
      render: function(options, bundle, {fileName, gzipSize}) {
        return `${fileName}: ${gzipSize}`;
      },
    }),
  ],
};
