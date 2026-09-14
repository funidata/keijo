import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TimelineGraph from "./TimelineGraph";
import OverviewContextProvider from "./OverviewContext";
import { TimelineGraphVariant } from "./graphTypes";

vi.mock("./charts/LineChart", () => ({
  default: ({ variant }: { variant: TimelineGraphVariant }) => (
    <div data-testid={`line-chart-${variant}`} />
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

afterEach(cleanup);

describe("TimelineGraph", () => {
  it.each([TimelineGraphVariant.Stacked, TimelineGraphVariant.Unstacked])(
    "renders the %s line chart",
    (variant) => {
      render(
        <OverviewContextProvider workdays={[]}>
          <TimelineGraph
            config={{ type: "timeline", variant }}
            graphIndex={0}
            groupBy="product"
            onChangeVariant={vi.fn()}
            zoneIndex={0}
          />
        </OverviewContextProvider>,
      );

      expect(screen.getByTestId(`line-chart-${variant}`)).toBeTruthy();
    },
  );

  it("offers timeline variants and reports the selected variant", () => {
    const onChangeVariant = vi.fn();
    render(
      <OverviewContextProvider workdays={[]}>
        <TimelineGraph
          config={{ type: "timeline", variant: TimelineGraphVariant.Stacked }}
          graphIndex={0}
          groupBy="product"
          onChangeVariant={onChangeVariant}
          zoneIndex={0}
        />
      </OverviewContextProvider>,
    );

    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "overview.timelineVariant.unstacked" }));

    expect(onChangeVariant).toHaveBeenCalledWith(TimelineGraphVariant.Unstacked);
  });
});
