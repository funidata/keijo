import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Overview from "./Overview";
import { DEFAULT_OVERVIEW_CONFIG } from "./constants";

const mocks = vi.hoisted(() => ({
  useOverviewConfig: vi.fn(),
}));

vi.mock("./OverviewContext", () => ({
  useOverviewConfig: mocks.useOverviewConfig,
}));

vi.mock("./Zone", () => ({
  default: () => <div data-testid="overview-zone" />,
}));

afterEach(() => {
  cleanup();
  mocks.useOverviewConfig.mockReset();
});

describe("Overview", () => {
  it("renders one zone for each configured overview zone", () => {
    mocks.useOverviewConfig.mockReturnValue({
      overviewConfig: DEFAULT_OVERVIEW_CONFIG,
      workdays: [],
    });

    render(<Overview />);

    expect(screen.getAllByTestId("overview-zone")).toHaveLength(2);
  });
});
