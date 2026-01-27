import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const config = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  {
    name: "keijo-web",
    linterOptions: { reportUnusedDisableDirectives: "error" },
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2020 },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
  },
  {
    // `ignores` must be in its own object without other config options.
    ignores: ["dist", "src/graphql/generated"],
  },
);

export default config;
