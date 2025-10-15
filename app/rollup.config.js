/* eslint-disable no-useless-escape */
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import size from '@justinribeiro/rollup-plugin-asset-build-size-compare';
import minifyHTML from 'rollup-plugin-minify-html-literals-v3';
import css from 'rollup-plugin-import-css';

export default {
  input: ['build/temp/src/js/blog/blog-pwa.js'],
  preserveEntrySignatures: false,
  treeshake: true,
  output: {
    dir: 'build/default/src',
    entryFileNames: '[name]-[hash].js',
    format: 'es',
    sourcemap: true,
    importAttributesKey: 'with',
    generatedCode: {
      preset: 'es2015',
    },
  },
  plugins: [
    resolve(),
    css(),
    minifyHTML(),
    terser({
      compress: {
        drop_console: true,
        // @ts-ignore
        ecma: 2022,
        passes: 5,
      },
      output: {
        comments: false,
      },
    }),
    // @ts-ignore
    size({
      compression: 'brotli',
      filename: '.build-size-brotli.json',
      hashPattern: '^(.*)(.{10})(\.[^.]+)$',
    }),
    // @ts-ignore
    size({
      compression: 'gzip',
      filename: '.build-size-gzip.json',
      hashPattern: '^(.*)(.{10})(\.[^.]+)$',
    }),
  ],
};
