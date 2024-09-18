import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from 'eslint-plugin-prettier';


export default /** @type {Linter.Config} */[
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: globals.browser
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin, // Prettier as an ESLint plugin
    },
    rules: {
      // TypeScript-specific rules can go here
      "@typescript-eslint/no-explicit-any": "warn", // Warn on 'any' type usage
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];