import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const config = defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  reactRefresh.configs.vite(),
  prettierConfig,
  {
    // `ignores` must be in its own object without other config options.
    ignores: ["dist", "src/graphql/generated"],
  },
]);

export default config;
