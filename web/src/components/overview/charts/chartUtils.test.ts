import { describe, it, expect, vi } from "vitest";
import {
  formatAccumulatedChartData,
  formatChartDataForPieChart,
  formatLineChartData,
  formatDateRange,
  formatDuration,
  tooltipLabelFormatter,
} from "./chartUtils";
import { AcceptanceStatus, Workday } from "../../../graphql/generated/graphql";
import { TimelineGraphVariant } from "../graphTypes";

const defaults = {
  acceptanceStatus: AcceptanceStatus.Open,
  description: "",
  key: "",
  typeName: "",
  product: "Sisu",
};

const workdays: Workday[] = [
  {
    date: "2026-08-18",
    entries: [
      {
        activity: "Sisäiset tapahtumat ja palaverit",
        duration: 6,
        durationInHours: true,
        ...defaults,
      },
      { activity: "Toteutus", duration: 2, durationInHours: true, ...defaults },
      { activity: "Tuotekehityksen palaverit", duration: 1, durationInHours: true, ...defaults },
    ],
  },
  {
    date: "2026-08-19",
    entries: [
      {
        activity: "Sisäiset tapahtumat ja palaverit",
        duration: 3,
        durationInHours: true,
        ...defaults,
      },
      { activity: "Toteutus", duration: 3, durationInHours: true, ...defaults },
      { activity: "Tuotekehityksen palaverit", duration: 1, durationInHours: true, ...defaults },
      { activity: "tunkkaus", duration: 0, durationInHours: true, ...defaults },
    ],
  },
];

const multiWeekWorkdays: Workday[] = [
  {
    date: "2026-08-17",
    entries: [{ activity: "Toteutus", duration: 2, durationInHours: true, ...defaults }],
  },
  {
    date: "2026-08-21",
    entries: [{ activity: "Toteutus", duration: 3, durationInHours: true, ...defaults }],
  },
  {
    date: "2026-08-24",
    entries: [{ activity: "Toteutus", duration: 5, durationInHours: true, ...defaults }],
  },
];

describe("chartUtils", () => {
  describe("formatLineChartData", () => {
    it("formats area chart data correctly for stacked variant", () => {
      const expectation = {
        labels: ["2026-08-18", "2026-08-19"],
        datasets: [
          {
            label: "Sisäiset tapahtumat ja palaverit",
            fill: "stack",
            data: [
              { date: "2026-08-19", hours: 3 },
              { date: "2026-08-18", hours: 6 },
            ],
          },
          {
            label: "Toteutus",
            fill: "stack",
            data: [
              { date: "2026-08-19", hours: 3 },
              { date: "2026-08-18", hours: 2 },
            ],
          },
          {
            label: "Tuotekehityksen palaverit",
            fill: "stack",
            data: [
              { date: "2026-08-19", hours: 1 },
              { date: "2026-08-18", hours: 1 },
            ],
          },
        ],
      };

      expect(formatLineChartData(workdays, "activity", TimelineGraphVariant.Stacked)).toEqual(
        expectation,
      );
    });
    it("formats area chart data correctly for unstacked variant", () => {
      const expectations = {
        labels: ["2026-08-18", "2026-08-19"],
        datasets: [
          {
            label: "Sisäiset tapahtumat ja palaverit",
            data: [
              { date: "2026-08-19", hours: 3 },
              { date: "2026-08-18", hours: 6 },
            ],
          },
          {
            label: "Toteutus",
            data: [
              { date: "2026-08-19", hours: 3 },
              { date: "2026-08-18", hours: 2 },
            ],
          },
          {
            label: "Tuotekehityksen palaverit",
            data: [
              { date: "2026-08-19", hours: 1 },
              { date: "2026-08-18", hours: 1 },
            ],
          },
        ],
      };
      expect(formatLineChartData(workdays, "activity", TimelineGraphVariant.Unstacked)).toEqual(
        expectations,
      );
    });
    it("zero-fills dates without hours in stacked datasets", () => {
      const sparseWorkdays: Workday[] = [
        {
          date: "2026-08-18",
          entries: [{ activity: "Toteutus", duration: 2, durationInHours: true, ...defaults }],
        },
        {
          date: "2026-08-19",
          entries: [{ activity: "Palaveri", duration: 1, durationInHours: true, ...defaults }],
        },
      ];

      expect(formatLineChartData(sparseWorkdays, "activity", TimelineGraphVariant.Stacked)).toEqual(
        {
          labels: ["2026-08-18", "2026-08-19"],
          datasets: [
            {
              label: "Toteutus",
              fill: "stack",
              data: [
                { date: "2026-08-19", hours: 0 },
                { date: "2026-08-18", hours: 2 },
              ],
            },
            {
              label: "Palaveri",
              fill: "stack",
              data: [
                { date: "2026-08-19", hours: 1 },
                { date: "2026-08-18", hours: 0 },
              ],
            },
          ],
        },
      );
    });
    it("uses week-number labels for stacked chart data when the range exceeds seven days", () => {
      expect(
        formatLineChartData(
          multiWeekWorkdays,
          "activity",
          TimelineGraphVariant.Stacked,
          (weekNumber) => `Week ${weekNumber}`,
        ),
      ).toEqual({
        labels: ["Week 34", "Week 35"],
        datasets: [
          {
            label: "Toteutus",
            fill: "stack",
            data: [
              { date: "Week 35", hours: 5 },
              { date: "Week 34", hours: 5 },
            ],
          },
        ],
      });
    });
    it("uses week-number labels for default chart data when the range exceeds seven days", () => {
      expect(
        formatLineChartData(
          multiWeekWorkdays,
          "activity",
          TimelineGraphVariant.Unstacked,
          (weekNumber) => `vk ${weekNumber}`,
        ),
      ).toEqual({
        labels: ["vk 34", "vk 35"],
        datasets: [
          {
            label: "Toteutus",
            data: [
              { date: "vk 35", hours: 5 },
              { date: "vk 34", hours: 5 },
            ],
          },
        ],
      });
    });
    it("keeps daily chart data when the date range is exactly seven days", () => {
      const oneWeekWorkdays: Workday[] = [
        {
          date: "2026-08-17",
          entries: [{ activity: "Toteutus", duration: 2, durationInHours: true, ...defaults }],
        },
        {
          date: "2026-08-23",
          entries: [{ activity: "Toteutus", duration: 5, durationInHours: true, ...defaults }],
        },
      ];

      expect(
        formatLineChartData(oneWeekWorkdays, "activity", TimelineGraphVariant.Unstacked),
      ).toEqual({
        labels: ["2026-08-17", "2026-08-23"],
        datasets: [
          {
            label: "Toteutus",
            data: [
              { date: "2026-08-23", hours: 5 },
              { date: "2026-08-17", hours: 2 },
            ],
          },
        ],
      });
    });
  });

  describe("formatAccumulatedChartData", () => {
    it("formats chart data correctly", () => {
      const expected = {
        labels: ["2026-08-18"],
        datasets: [
          {
            label: "Sisäiset tapahtumat ja palaverit",
            data: [9],
          },
          {
            label: "Toteutus",
            data: [5],
          },
          {
            label: "Tuotekehityksen palaverit",
            data: [2],
          },
        ],
      };
      expect(formatAccumulatedChartData(workdays, "activity")).toEqual(expected);
    });

    it("groups missing values under unknown and ignores non-hour entries", () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
      const workdaysWithMissingValues: Workday[] = [
        {
          date: "2026-08-18",
          entries: [
            { activity: "Toteutus", duration: 2, durationInHours: true, ...defaults },
            { activity: "", duration: 1, durationInHours: true, ...defaults },
            { activity: "Minuutit", duration: 3, durationInHours: false, ...defaults },
          ],
        },
      ];

      expect(formatAccumulatedChartData(workdaysWithMissingValues, "activity")).toEqual({
        labels: ["2026-08-18"],
        datasets: [
          { label: "Toteutus", data: [2] },
          { label: "unknown", data: [1] },
        ],
      });
      expect(consoleError).toHaveBeenCalledOnce();
      consoleError.mockRestore();
    });
  });

  describe("formatChartDataForPieChart", () => {
    it("converts accumulated datasets into pie labels and values", () => {
      expect(
        formatChartDataForPieChart({
          labels: ["2026-08-18"],
          datasets: [
            { label: "Toteutus", data: [5] },
            { label: "Palaveri", data: [2] },
          ],
        }),
      ).toEqual({
        labels: ["Toteutus", "Palaveri"],
        datasets: [{ data: [5, 2] }],
      });
    });
  });

  describe("tooltipLabelFormatter", () => {
    it("formats the tooltip label correctly", () => {
      const label = "Toteutus";
      const value = "5";
      expect(tooltipLabelFormatter(label, value)).toBe(" Toteutus: 5h");
    });
  });

  describe("formatDuration", () => {
    it("formats whole hours without minutes", () => {
      expect(formatDuration(2)).toBe("2h");
    });

    it("formats fractional hours as hours and minutes", () => {
      expect(formatDuration(2.5)).toBe("2h 30m");
    });

    it("formats zero hours", () => {
      expect(formatDuration(0)).toBe("0h");
    });

    it("formats a fractional hour", () => {
      expect(formatDuration(0.75)).toBe("0h 45m");
    });
  });

  describe("formatDateRange", () => {
    it("formats the date range correctly", () => {
      const dateRange = { startDate: "2026-08-17", endDate: "2026-08-23" };
      expect(formatDateRange(dateRange)).toBe("17.08.2026 - 23.08.2026");
    });
  });
});
