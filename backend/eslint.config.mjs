import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: ['dist', 'eslint.config.mjs', '**/*.js', 'eslint.config.mjs', '.vscode', 'dist', 'node_modules'],
  extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintPluginPrettierRecommended],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      projectService: true, tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    '@typescript-eslint/no-empty-object-type': 'off',
    'no-empty-pattern': 'off',
  },
});
