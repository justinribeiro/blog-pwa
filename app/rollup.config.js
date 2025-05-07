import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import size from '@justinribeiro/rollup-plugin-asset-build-size-compare';
import minifyHTML from 'rollup-plugin-minify-html-literals';

export default {
  input: ['src/blog-pwa.js'],
  preserveEntrySignatures: false,
  treeshake: true,
  output: {
    dir: 'build/default/src',
    entryFileNames: '[name]-[hash].js',
    format: 'es',
    sourcemap: true,
    generatedCode: {
      preset: 'es2015',
    },
  },
  plugins: [
    resolve(),
    minifyHTML.default(),
    terser({
      compress: {
        inline: 0,
        drop_console: true,
        ecma: 2022,
      },
      output: {
        comments: false,
      },
    }),
    size({
      compression: 'brotli',
      filename: '.build-size-brotli.json',
    }),
    size({
      compression: 'gzip',
      filename: '.build-size-gzip.json',
    }),
  ],
};
