import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";
import { configs as nestjsSecurityConfigs } from "eslint-plugin-nestjs-security";
import { configs as nodeSecurityConfigs } from "eslint-plugin-node-security";
import { configs as secureCodingConfigs } from "eslint-plugin-secure-coding";

const config = defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  nestjsSecurityConfigs.recommended,
  nodeSecurityConfigs.recommended,
  secureCodingConfigs.recommended,
  prettierConfig,
  { languageOptions: { globals: globals.node } },
  {
    // `ignores` must be in its own object without other config options.
    ignores: ["dist"],
  },
]);

export default config;
