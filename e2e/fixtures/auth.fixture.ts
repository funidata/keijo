import { test } from "@playwright/test";

export const authFixture = test.extend({
  page: async ({ page }, use, testInfo) => {
    // TODO: Reset database for given `workerIndex` first.

    // Use worker index as employee ID to separate test runners.
    await page.route("**/graphql", (route, request) => {
      const headers = request.headers();
      headers["x-shib-employeeid"] = testInfo.workerIndex.toString();
      route.continue({ headers });
    });

    await use(page);
  },
});
