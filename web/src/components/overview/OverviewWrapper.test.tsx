import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import OverviewWrapper from "./OverviewWrapper";

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  useWorkdayBrowserParams: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: mocks.useQuery,
}));

vi.mock("../workday-browser/useWorkdayBrowserParams", () => ({
  useWorkdayBrowserParams: mocks.useWorkdayBrowserParams,
}));

vi.mock("../workday-browser/LoadingIndicator", () => ({
  default: () => <div data-testid="loading-indicator" />,
}));

afterEach(() => {
  cleanup();
  mocks.useQuery.mockReset();
  mocks.useWorkdayBrowserParams.mockReset();
});

describe("OverviewWrapper", () => {
  it("renders a loading indicator while workday data is unavailable", () => {
    mocks.useWorkdayBrowserParams.mockReturnValue({
      from: "from",
      to: "to",
      formattedFrom: "2026-06-01",
      formattedTo: "2026-06-07",
    });
    mocks.useQuery.mockReturnValue({ data: undefined });

    render(<OverviewWrapper />);

    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    expect(screen.queryByTestId("overview")).toBeNull();
  });
});
