import customMinifyCss from '@open-wc/building-utils/custom-minify-css';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import size from 'rollup-plugin-size';

// This is my light spin off of the open-wc building-rollup package:
// https://github.com/open-wc/open-wc/tree/master/packages/building-rollup If
// you're looking for something to use in your project, start there (I use their
// base setup with great success in other projects)
export default {
  input: [
    'src/blog-pwa.js',
  ],
  preserveEntrySignatures: false,
  treeshake: true,
  output: {
    dir: 'build/default/src',
    entryFileNames: '[name]-[hash].js',
    format: 'es',
    sourcemap: true,
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
              'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
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
          '@babel/preset-modules',
          {
            loose: true,
          },
        ],
      ],
    }),
    terser({
      compress: {
        inline: 0,
        drop_console: true,
        ecma: 2019,
      },
      output: {
        comments: false,
      },
    }),
    size({ publish: true }),
  ],
};
