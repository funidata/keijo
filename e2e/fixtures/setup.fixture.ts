import { test } from "@playwright/test";

/**
 * Reset database before every test.
 */
export const setupFixture = test.extend<{ forEachTest: void }>({
  forEachTest: [
    async ({ request }, use) => {
      await request.get("http://localhost:4001/dev/reset");
      await use();
    },
    { auto: true },
  ],
});
