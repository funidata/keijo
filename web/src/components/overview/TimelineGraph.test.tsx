import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TimelineGraph from "./TimelineGraph";
import OverviewContextProvider from "./OverviewContext";
import { TimelineGraphVariant } from "./graphTypes";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

afterEach(cleanup);

describe("TimelineGraph", () => {
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
