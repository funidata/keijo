import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Overview from "./Overview";
import { TimelineGraphVariant, TotalsGraphVariant } from "./graphTypes";

const mocks = vi.hoisted(() => ({
  useOverviewConfig: vi.fn(),
}));

vi.mock("./OverviewContext", () => ({
  useOverviewConfig: mocks.useOverviewConfig,
}));

vi.mock("./Zone", () => ({
  default: () => <div data-testid="overview-zone" />,
}));

vi.mock("../workday-browser/LoadingIndicator", () => ({
  default: () => <div data-testid="loading-indicator" />,
}));

afterEach(() => {
  cleanup();
  mocks.useOverviewConfig.mockReset();
});

describe("Overview", () => {
  it("renders one zone for each configured overview zone", () => {
    mocks.useOverviewConfig.mockReturnValue({
      overviewConfig: [
        {
          groupBy: "product",
          graphs: [{ type: "totals", variant: TotalsGraphVariant.BarVertical }],
        },
        {
          groupBy: "activity",
          graphs: [{ type: "timeline", variant: TimelineGraphVariant.Stacked }],
        },
      ],
      isLoading: false,
      workdays: [],
    });

    render(<Overview />);

    expect(screen.getAllByTestId("overview-zone")).toHaveLength(2);
  });

  it("renders a loading indicator while the overview configuration loads", () => {
    mocks.useOverviewConfig.mockReturnValue({ isLoading: true });

    render(<Overview />);

    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });
});
