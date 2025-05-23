// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { configs as wcConfig } from 'eslint-plugin-wc';
import { configs as litConfig } from 'eslint-plugin-lit';
import html from '@html-eslint/eslint-plugin';

export default [
  {
    ignores: ['build/**/*', 'data/**/*'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      html,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      html,
    },
    language: 'html/html',
    languageOptions: {
      templateEngineSyntax: {
        '{{': '}}',
      },
    },
    rules: {
      'html/require-img-alt': 'error',
    },
  },
  wcConfig['flat/recommended'],
  litConfig['flat/recommended'],
  eslintPluginPrettierRecommended,
];
