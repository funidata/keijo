import { test } from "@playwright/test";

/**
 * Reset database before every test.
 */
export const setupFixture = test.extend<{ forEachTest: void }>({
  forEachTest: [
    async ({ request }, use) => {
      const port = process.env.CI === "true" ? 4000 : 4001;
      await request.get(`http://localhost:${port}/dev/reset`);
      await use();
    },
    { auto: true },
  ],
});
