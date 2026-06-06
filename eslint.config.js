import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import vueTsConfig from "@vue/eslint-config-typescript";
import prettierConfig from "@vue/eslint-config-prettier";

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  ...vueTsConfig(),
  prettierConfig,
  {
    files: ["**/*.js", "**/*.ts", "**/*.vue"],
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      "arrow-body-style": ["error", "as-needed"],
    },
  },
];
