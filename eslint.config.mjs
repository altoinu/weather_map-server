import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginJest from "eslint-plugin-jest";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    files: ["**/*.{js,cjs,mjs}"],
    ignores: ["node_modules", "build", "*.css"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      jest: eslintPluginJest,
    },
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];

export default eslintConfig;
