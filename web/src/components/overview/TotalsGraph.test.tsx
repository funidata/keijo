import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TotalsGraph from "./TotalsGraph";
import OverviewContextProvider from "./OverviewContext";
import { TotalsGraphVariant } from "./graphTypes";

vi.mock("./charts/BarChart", () => ({
  default: ({ orientation }: { orientation: "vertical" | "horizontal" }) => (
    <div data-testid={`bar-chart-${orientation}`} />
  ),
}));

vi.mock("./charts/PieChart", () => ({
  default: () => <div data-testid="pie-chart" />,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

afterEach(cleanup);

describe("TotalsGraph", () => {
  function renderTotalsGraph(variant: TotalsGraphVariant) {
    return render(
      <OverviewContextProvider workdays={[]}>
        <TotalsGraph
          config={{ type: "totals", variant }}
          graphIndex={0}
          groupBy="product"
          onChangeVariant={vi.fn()}
          zoneIndex={0}
        />
      </OverviewContextProvider>,
    );
  }

  it.each([
    [TotalsGraphVariant.BarVertical, "bar-chart-vertical"],
    [TotalsGraphVariant.BarHorizontal, "bar-chart-horizontal"],
    [TotalsGraphVariant.Pie, "pie-chart"],
  ])("renders the %s chart", (variant, testId) => {
    renderTotalsGraph(variant);

    expect(screen.getByTestId(testId)).toBeTruthy();
  });

  it("offers totals variants and reports the selected variant", () => {
    const onChangeVariant = vi.fn();
    render(
      <OverviewContextProvider workdays={[]}>
        <TotalsGraph
          config={{ type: "totals", variant: TotalsGraphVariant.BarVertical }}
          graphIndex={0}
          groupBy="product"
          onChangeVariant={onChangeVariant}
          zoneIndex={0}
        />
      </OverviewContextProvider>,
    );

    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "overview.totalsVariant.pie" }));

    expect(onChangeVariant).toHaveBeenCalledWith(TotalsGraphVariant.Pie);
  });
});
