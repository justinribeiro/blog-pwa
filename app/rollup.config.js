import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';

export default {
  input: [
    'src/app.js',
    'src/blog-pwa.js',
    'src/blog-static.js',
    'src/blog-entry.js',
    'src/blog-chronicle.js',
    'src/lazy-resources.js',
    'src/3d-utils.js',
    'src/code-block.js',
  ],
  output: {
    dir: 'build/default/src',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    minify({
      mangle: {
        exclude: {__import: true},
      },
      comments: false,
      plugins: ['transform-remove-console'],
    }),
  ],
};
