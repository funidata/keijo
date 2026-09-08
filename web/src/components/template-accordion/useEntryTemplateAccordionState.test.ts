import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import useEntryTemplateAccordionState from "./useEntryTemplateAccordionState";

const storageKey = "entry-template-accordion-state";

describe("useEntryTemplateAccordionState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("is collapsed by default when no state has been stored", () => {
    const { result } = renderHook(() => useEntryTemplateAccordionState());

    expect(result.current.expanded).toBe(false);
  });

  it("opens the accordion and stores the expanded state", async () => {
    const { result } = renderHook(() => useEntryTemplateAccordionState());

    act(() => {
      result.current.setExpanded(true);
    });

    await waitFor(() => {
      expect(result.current.expanded).toBe(true);
    });

    expect(JSON.parse(localStorage.getItem(storageKey) ?? "")).toEqual({
      [storageKey]: { expanded: true },
    });
  });

  it("closes the accordion and stores the collapsed state", async () => {
    const { result } = renderHook(() => useEntryTemplateAccordionState());

    act(() => {
      result.current.setExpanded(false);
    });

    await waitFor(() => {
      expect(result.current.expanded).toBe(false);
    });

    expect(JSON.parse(localStorage.getItem(storageKey) ?? "")).toEqual({
      [storageKey]: { expanded: false },
    });
  });
});
