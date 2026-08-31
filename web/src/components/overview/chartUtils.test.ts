import { describe, it, expect } from "vitest";
import { formatAreaChartData } from "./chartUtils";
import { AcceptanceStatus, Workday } from "../../graphql/generated/graphql";

const defaults = {
  acceptanceStatus: AcceptanceStatus.Open,
  description: "",
  key: "",
  typeName: "",
  product: "Sisu"
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

describe("chartUtils", () => {
  describe("formatAreaChartData", () => {
    it("formats area chart data correctly for stacked variant", () => {
      const expectation = {
        labels: ["2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21"],
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
        labels: ["2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21"],
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
  });
});
