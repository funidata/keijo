import test from "@playwright/test";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import "dayjs/locale/fi";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

export const dayjsFixture = test.extend<{ dayjs: typeof dayjs }>({
  dayjs: async ({ locale }, use) => {
    dayjs.extend(weekOfYear);
    dayjs.extend(localizedFormat);
    dayjs.extend(weekday);
    dayjs.locale(locale);
    await use(dayjs);
  },
});
