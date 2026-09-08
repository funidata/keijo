import { act, cleanup, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { TotalsGraphVariant } from "./graphTypes";
import { DEFAULT_OVERVIEW_CONFIG, OVERVIEW_CONFIG_LOCALSTORAGE_KEY } from "./constants";
import OverviewContextProvider, { useOverviewConfig } from "./OverviewContext";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const renderOverviewConfig = (workdays: never[] = []) =>
  renderHook(() => useOverviewConfig(), {
    wrapper: ({ children }: PropsWithChildren) => (
      <OverviewContextProvider workdays={workdays}>{children}</OverviewContextProvider>
    ),
  });

describe("OverviewContextProvider", () => {
  it("uses the default overview configuration when local storage is empty", () => {
    localStorage.clear();
    const { result } = renderOverviewConfig();

    expect(result.current.overviewConfig).toEqual(DEFAULT_OVERVIEW_CONFIG);
  });

  it("uses the overview configuration stored in local storage", () => {
    const storedConfig = [
      {
        groupBy: "client",
        graphs: [{ type: "totals", variant: "pie" }],
      },
    ];
    localStorage.setItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY, JSON.stringify(storedConfig));

    const { result } = renderOverviewConfig();

    expect(result.current.overviewConfig).toEqual(storedConfig);
  });

  it("provides the supplied workdays", () => {
    const workdays = [{ date: "2026-06-01", entries: [] }] as never[];

    const { result } = renderOverviewConfig(workdays);

    expect(result.current.workdays).toBe(workdays);
  });

  it("throws when used outside the provider", () => {
    expect(() => renderHook(() => useOverviewConfig())).toThrow(
      "useOverviewConfig must be used within an OverviewContextProvider",
    );
  });

  describe("handleGraphVariantChange()", () => {
    it("updates and persists the selected graph variant", () => {
      const { result } = renderOverviewConfig();

      act(() => {
        result.current.handleGraphVariantChange(TotalsGraphVariant.Pie, 0, 0);
      });

      expect(result.current.overviewConfig[0].graphs[0]).toEqual({
        type: "totals",
        variant: TotalsGraphVariant.Pie,
      });
      expect(JSON.parse(localStorage.getItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY)!)).toEqual(
        result.current.overviewConfig,
      );
    });
  });
});
