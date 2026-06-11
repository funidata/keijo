import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => cleanup());
import "../../i18n/i18n-config";
import { AcceptanceStatus } from "../../graphql/generated/graphql";
import { EntryType } from "../../common/entryType.enum";
import WorkdaySummary from "./WorkdaySummary";

const baseEntry = {
  key: "1",
  duration: 8,
  durationInHours: true,
  description: "",
  typeName: "Normal Work",
  acceptanceStatus: AcceptanceStatus.Open,
};

const renderWorkday = (workday: Parameters<typeof WorkdaySummary>[0]["workday"]) =>
  render(
    <MemoryRouter>
      <WorkdaySummary workday={workday} />
    </MemoryRouter>,
  );

describe("WorkdaySummary", () => {
  it("shows total hours for a normal workday with entries", () => {
    renderWorkday({
      date: "2026-06-10", // Wednesday
      entries: [{ ...baseEntry, ratioNumber: EntryType.NormalWork }],
    });

    expect(screen.getByText("8:00 h")).toBeTruthy();
  });

  it("shows 'No entries' chip for a weekday with no entries", () => {
    renderWorkday({ date: "2026-06-10", entries: [] });

    expect(screen.getByText("No entries")).toBeTruthy();
  });

  it("shows 'Vacation' chip and hides hours for a vacation day", () => {
    renderWorkday({
      date: "2026-06-10",
      entries: [{ ...baseEntry, ratioNumber: EntryType.Vacation }],
    });

    expect(screen.getByText("Vacation")).toBeTruthy();
    // Hours chip is hidden for special single-entry days like vacation
    expect(screen.queryByText(/\d+:\d+ h/)).toBeNull();
  });

  it("shows 'Weekend' chip for a Saturday", () => {
    renderWorkday({ date: "2026-06-13", entries: [] }); // Saturday

    expect(screen.getByText("Weekend")).toBeTruthy();
  });
});
