import { describe, expect, it } from "vitest";
import { AcceptanceStatus, type FindWorkdaysQuery } from "../graphql/generated/graphql";
import dayjs from "./dayjs";
import { compileWorkdayRange } from "./workdayUtils";

const emptyWorkdays: FindWorkdaysQuery = { findWorkdays: [] };

const entry = {
  key: "entry-1",
  duration: 480,
  durationInHours: false,
  description: "Implementation",
  acceptanceStatus: AcceptanceStatus.Accepted,
  typeName: "Work",
  ratioNumber: 1,
  product: "Keijo",
  activity: "Development",
  issue: null,
  client: null,
};

describe("workdayUtils", () => {
  describe("compileWorkdayRange", () => {
    it("creates a workday for every day in range", () => {
      const result = compileWorkdayRange(emptyWorkdays, {
        from: dayjs("2024-05-06T14:30:00"),
        to: dayjs("2024-05-08T09:00:00"),
      });

      expect(result).toEqual([
        { date: "2024-05-06", entries: [] },
        { date: "2024-05-07", entries: [] },
        { date: "2024-05-08", entries: [] },
      ]);
    });

    it("returns an empty array for an invalid range", () => {
      const result = compileWorkdayRange(emptyWorkdays, {
        from: dayjs("2024-05-08"),
        to: dayjs("2024-05-06"),
      });

      expect(result).toEqual([]);
    });

    it("handles a single day range", () => {
      const result = compileWorkdayRange(emptyWorkdays, {
        from: dayjs("2024-05-06"),
        to: dayjs("2024-05-06"),
      });

      expect(result).toEqual([{ date: "2024-05-06", entries: [] }]);
    });

    it("handles a range with weekends", () => {
      const result = compileWorkdayRange(emptyWorkdays, {
        from: dayjs("2024-05-03"),
        to: dayjs("2024-05-05"),
      });

      expect(result.map((workday) => workday.date)).toEqual([
        "2024-05-03",
        "2024-05-04",
        "2024-05-05",
      ]);
    });

    it("includes entries for the days in the range", () => {
      const result = compileWorkdayRange(
        {
          findWorkdays: [
            { date: "2024-05-06", entries: [entry] },
            { date: "2024-05-08", entries: [{ ...entry, key: "entry-2" }, { ...entry, key: "entry-3" }] },
          ],
        },
        {
          from: dayjs("2024-05-06"),
          to: dayjs("2024-05-08"),
        },
      );

      expect(result).toEqual([
        { date: "2024-05-06", entries: [entry] },
        { date: "2024-05-07", entries: [] },
        { date: "2024-05-08", entries: [{ ...entry, key: "entry-2" }, { ...entry, key: "entry-3" }] },
      ]);
    });
  });
});
