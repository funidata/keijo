import { act, cleanup, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OverviewGraphType, OverviewGroupBy, TotalsGraphVariant } from "./graphTypes";
import OverviewContextProvider, { useOverviewConfig } from "./OverviewContext";

const mocks = vi.hoisted(() => ({
  updateOverviewConfig: vi.fn(),
  useQuery: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: mocks.useQuery,
  useMutation: () => [mocks.updateOverviewConfig],
}));

afterEach(() => {
  cleanup();
  mocks.updateOverviewConfig.mockReset();
  mocks.useQuery.mockReset();
});

const renderOverviewConfig = (workdays: never[] = []) =>
  renderHook(() => useOverviewConfig(), {
    wrapper: ({ children }: PropsWithChildren) => (
      <OverviewContextProvider workdays={workdays}>{children}</OverviewContextProvider>
    ),
  });

describe("OverviewContextProvider", () => {
  it("exposes a loading state until the overview configuration loads", () => {
    mocks.useQuery.mockReturnValue({ data: undefined, loading: true });
    const { result } = renderOverviewConfig();

    expect(result.current).toMatchObject({ overviewConfig: [], isLoading: true });
  });

  it("uses the overview configuration returned by the server", () => {
    const config = [
      {
        groupBy: OverviewGroupBy.Client,
        graphs: [{ type: OverviewGraphType.Totals, variant: TotalsGraphVariant.Pie }],
      },
    ];
    mocks.useQuery.mockReturnValue({ data: { getMyOverviewConfig: config }, loading: false });

    const { result } = renderOverviewConfig();

    expect(result.current).toMatchObject({ overviewConfig: config, isLoading: false });
  });

  it("provides the supplied workdays", () => {
    const workdays = [{ date: "2026-06-01", entries: [] }] as never[];
    mocks.useQuery.mockReturnValue({ data: { getMyOverviewConfig: [] }, loading: false });

    const { result } = renderOverviewConfig(workdays);

    expect(result.current.workdays).toBe(workdays);
  });

  it("throws when used outside the provider", () => {
    expect(() => renderHook(() => useOverviewConfig())).toThrow(
      "useOverviewConfig must be used within an OverviewContextProvider",
    );
  });

  describe("handleGraphVariantChange()", () => {
    it("updates the selected graph variant", () => {
      mocks.useQuery.mockReturnValue({
        data: {
          getMyOverviewConfig: [
            {
              groupBy: OverviewGroupBy.Product,
              graphs: [
                { type: OverviewGraphType.Totals, variant: TotalsGraphVariant.BarVertical },
              ],
            },
          ],
        },
        loading: false,
      });
      const { result } = renderOverviewConfig();

      act(() => {
        result.current.handleGraphVariantChange(TotalsGraphVariant.Pie, 0, 0);
      });

      expect(result.current.overviewConfig[0].graphs[0]).toEqual({
        type: OverviewGraphType.Totals,
        variant: TotalsGraphVariant.Pie,
      });
      expect(mocks.updateOverviewConfig).toHaveBeenCalledOnce();
    });
  });
});
