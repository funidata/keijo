/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import packageJson from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(packageJson.version),
  },
  test: {
    environment: "jsdom",
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/i18n", "src/common/dayjs.ts", "src/**/*.enum.ts", "src/**/*.d.ts"],
      reporter: ["text", "html"],
    },
  },
});
