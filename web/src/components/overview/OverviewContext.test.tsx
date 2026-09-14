import { act, cleanup, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { TotalsGraphVariant, type GraphZoneConfig } from "./graphTypes";
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

  it("restores the default configuration when the stored backup is invalid", () => {
    localStorage.setItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY, "invalid JSON");

    const { result } = renderOverviewConfig();

    expect(result.current.overviewConfig).toEqual(DEFAULT_OVERVIEW_CONFIG);
    expect(JSON.parse(localStorage.getItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY)!)).toEqual(
      DEFAULT_OVERVIEW_CONFIG,
    );
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

  it("persists replacement and functional configuration updates", () => {
    const { result } = renderOverviewConfig();
    const updatedConfig = [
      {
        groupBy: "client",
        graphs: [{ type: "totals", variant: TotalsGraphVariant.Pie }],
      },
    ] satisfies GraphZoneConfig[];

    act(() => {
      result.current.updateOverviewConfig(updatedConfig);
    });

    expect(result.current.overviewConfig).toEqual(updatedConfig);
    expect(JSON.parse(localStorage.getItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY)!)).toEqual(
      updatedConfig,
    );

    act(() => {
      result.current.updateOverviewConfig((previousConfig) => previousConfig.slice(0, 0));
    });

    expect(result.current.overviewConfig).toEqual([]);
    expect(JSON.parse(localStorage.getItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY)!)).toEqual([]);
  });

  describe("handleGraphVariantChange()", () => {
    it("updates and persists the selected graph variant", () => {
      const { result } = renderOverviewConfig();
      const originalGraph = result.current.overviewConfig[0].graphs[0];

      act(() => {
        result.current.handleGraphVariantChange(TotalsGraphVariant.Pie, 0, 0);
      });

      expect(result.current.overviewConfig[0].graphs[0]).toEqual({
        type: "totals",
        variant: TotalsGraphVariant.Pie,
      });
      expect(originalGraph).toEqual({
        type: "totals",
        variant: TotalsGraphVariant.BarVertical,
      });
      expect(JSON.parse(localStorage.getItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY)!)).toEqual(
        result.current.overviewConfig,
      );
    });
  });
});
