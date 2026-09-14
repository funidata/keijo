import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Zone from "./Zone";
import {
  OverviewGraphType,
  OverviewGroupBy,
  TimelineGraphVariant,
  TotalsGraphVariant,
} from "./graphTypes";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("./Graph", () => ({
  default: () => <div data-testid="zone-graph" />,
}));

afterEach(() => {
  cleanup();
});

describe("Zone", () => {
  it("renders the translated group heading", () => {
    render(<Zone zone={{ groupBy: OverviewGroupBy.Product, graphs: [] }} index={0} />);

    expect(screen.getByRole("heading", { name: "overview.hoursBy.product" })).toBeTruthy();
  });

  it("renders one graph for each configured graph", () => {
    render(
      <Zone
        zone={{
          groupBy: OverviewGroupBy.Product,
          graphs: [
            { type: OverviewGraphType.Totals, variant: TotalsGraphVariant.Pie },
            { type: OverviewGraphType.Timeline, variant: TimelineGraphVariant.Stacked },
          ],
        }}
        index={0}
      />,
    );

    expect(screen.getAllByTestId("zone-graph")).toHaveLength(2);
  });
});
