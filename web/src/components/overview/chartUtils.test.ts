import { describe, it, expect } from "vitest";
import { formatAccumulatedChartData, formatAreaChartData } from "./chartUtils";
import { AcceptanceStatus, Workday } from "../../graphql/generated/graphql";

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
  describe("formatAreaChartData", () => {
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

      expect(formatAreaChartData(workdays, "activity", "stacked")).toEqual(expectation);
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
      expect(formatAreaChartData(workdays, "activity", "default")).toEqual(expectations);
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

      expect(formatAreaChartData(sparseWorkdays, "activity", "stacked")).toEqual({
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
      });
    });
    it("uses week-number labels for stacked chart data when the range exceeds seven days", () => {
      expect(
        formatAreaChartData(
          multiWeekWorkdays,
          "activity",
          "stacked",
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
        formatAreaChartData(
          multiWeekWorkdays,
          "activity",
          "default",
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

      expect(formatAreaChartData(oneWeekWorkdays, "activity", "default")).toEqual({
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

  describe("formatChartData", () => {
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
  });
});
