import { expect, test } from "@playwright/test";

export const authFixture = test.extend({
  page: async ({ page }, use, testInfo) => {
    const workerIndex = testInfo.workerIndex.toString();

    // Reset database for this worker.
    const apiUrl = process.env.API_URL || "http://localhost:4001";
    const response = await page.goto(`${apiUrl}/dev/reset?id=${workerIndex}`);
    expect(response?.ok()).toBe(true);

    // Use worker index as employee ID to separate test runners.
    await page.route("**/graphql", (route, request) => {
      const headers = request.headers();
      headers["x-shib-employeeid"] = workerIndex;
      route.continue({ headers });
    });

    await use(page);
  },
});
