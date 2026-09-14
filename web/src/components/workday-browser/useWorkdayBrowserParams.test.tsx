import { cleanup, renderHook, act, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import dayjs from "../../common/dayjs";
import { useWorkdayBrowserParams } from "./useWorkdayBrowserParams";

afterEach(() => {
  cleanup();
});

const routePath = "/entries/:browsingMode/:from?/:to?";

const LocationDisplay = () => {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
};

const renderParams = (initialEntry: string) =>
  renderHook(() => useWorkdayBrowserParams(), {
    wrapper: ({ children }: PropsWithChildren) => (
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route
            path={routePath}
            element={
              <>
                <LocationDisplay />
                {children}
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    ),
  });

describe("useWorkdayBrowserParams", () => {
  it("initialized with correct date parameters", () => {
    const { result } = renderParams("/entries/week/2026-06-08");

    expect(result.current.from.format("YYYY-MM-DD")).toBe("2026-06-08");
    expect(result.current.to.format("YYYY-MM-DD")).toBe("2026-06-14");
    expect(result.current.formattedFrom).toBe("2026-06-08");
    expect(result.current.formattedTo).toBe("2026-06-14");
  });
  describe("browsing mode", () => {
    it.each([
      ["week", "/entries/week/2026-06-08"],
      ["range", "/entries/range/2026-06-01/2026-06-07"],
      ["overview", "/entries/overview/2026-06-01/2026-06-07"],
    ])("returns %s browsing mode correctly", (expectedMode, initialEntry) => {
      const { result } = renderParams(initialEntry);

      expect(result.current.browsingMode).toBe(expectedMode);
    });
  });

  describe("goToWeek", () => {
    it("navigates to the week that includes the given date", () => {
      const { result } = renderParams("/entries/week/2026-06-08");

      act(() => {
        result.current.goToWeek(dayjs("2026-06-03"));
      });

      expect(screen.getByTestId("location").textContent).toBe("/entries/week/2026-06-01");
    });
  });

  describe("goToRange", () => {
    it("navigates to the specified date range", () => {
      const { result } = renderParams("/entries/range/2026-06-01/2026-06-07");

      act(() => {
        result.current.goToRange(dayjs("2026-06-10"), dayjs("2026-06-12"));
      });

      expect(screen.getByTestId("location").textContent).toBe(
        "/entries/range/2026-06-10/2026-06-12",
      );
    });
  });

  describe("goToOverview", () => {
    it("navigates to the overview page with given date range", () => {
      const { result } = renderParams("/entries/overview/2026-06-01/2026-06-07");

      act(() => {
        result.current.goToOverview(dayjs("2026-06-10"), dayjs("2026-06-12"));
      });

      expect(screen.getByTestId("location").textContent).toBe(
        "/entries/overview/2026-06-10/2026-06-12",
      );
    });
  });
});
