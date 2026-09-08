import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TotalsGraph from "./TotalsGraph";
import OverviewContextProvider from "./OverviewContext";
import { TotalsGraphVariant } from "./graphTypes";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

afterEach(cleanup);

describe("TotalsGraph", () => {
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
