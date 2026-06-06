// eslint.config.js
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import vueTsConfig from "@vue/eslint-config-typescript";
import prettierConfig from "@vue/eslint-config-prettier";

export default [
  // 1. ESLint-Standardregeln
  js.configs.recommended,

  // 2. Vue 3 Standardregeln
  ...pluginVue.configs["flat/essential"],

  // 3. TypeScript fÃŒr Vue (Der korrekte ESM-Aufruf)
  ...vueTsConfig(),

  // 4. Prettier-Konfiguration
  prettierConfig,

  // 5. Deine eigenen Anpassungen und die Arrow-Regel
  {
    files: ["**/*.js", "**/*.ts", "**/*.vue"],
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      // Endlich am Ziel: Deine gewÃŒnschte Regel!
      "arrow-body-style": ["error", "as-needed"],
    },
  },
];
