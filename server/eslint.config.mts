import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

const config = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  { languageOptions: { globals: globals.node } },
  {
    // `ignores` must be in its own object without other config options.
    ignores: ["dist"],
  },
);

export default config;
