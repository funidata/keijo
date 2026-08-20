import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import EntryFiltersSection from "./EntryFiltersSection";

const entryFormFiltersMock = vi.hoisted(() => ({
  useEntryFormFilters: vi.fn(),
}));

vi.mock("./useEntryFormFilters", () => ({
  default: entryFormFiltersMock.useEntryFormFilters,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./ProjectFilter", () => ({
  default: () => <div data-testid="project-filter-stub">ProjectFilter</div>,
}));

vi.mock("@mui/material/Collapse", () => ({
  default: ({ in: isOpen, children }: { in: boolean; children: ReactNode }) =>
    isOpen ? <>{children}</> : null,
}));

const mockUseEntryFormFilters = (activeFilters: string[] = [], selectedProjects: string[] = []) => {
  entryFormFiltersMock.useEntryFormFilters.mockReturnValue({
    filters: { projects: selectedProjects },
    updateSelectedProjects: vi.fn(),
    activeFilters,
  });
};

describe("EntryFiltersSection", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseEntryFormFilters();
  });

  it("toggles the filtering section when the button is clicked", () => {
    render(<EntryFiltersSection />);

    expect(screen.getByRole("button", { name: /controls\.showFilters/ })).toBeTruthy();
    expect(screen.queryByTestId("project-filter-stub")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /controls\.showFilters/ }));

    expect(screen.getByRole("button", { name: /controls\.hideFilters/ })).toBeTruthy();
    expect(screen.getByTestId("project-filter-stub")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /controls\.hideFilters/ }));

    expect(screen.getByRole("button", { name: /controls\.showFilters/ })).toBeTruthy();
    expect(screen.queryByTestId("project-filter-stub")).toBeNull();
  });

  it("shows the active filter count badge when filters are active", () => {
    mockUseEntryFormFilters(["projects"], ["project-1", "project-2"]);

    render(<EntryFiltersSection />);

    expect(screen.getByText("2")).toBeTruthy();
  });
});
