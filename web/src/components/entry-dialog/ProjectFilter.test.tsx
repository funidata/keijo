import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProjectFilter from "./ProjectFilter";

const apolloMocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: apolloMocks.useQuery,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockUseQuery = (issueKeys: string[]) => {
  apolloMocks.useQuery.mockReturnValue({
    data: {
      findDimensionOptions: {
        issue: issueKeys,
      },
    },
  });
};

describe("ProjectFilter", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows thelabel and helper text", () => {
    mockUseQuery([]);

    render(<ProjectFilter selectedProjects={[]} />);

    expect(screen.getByLabelText("entryDialog.filterProjects")).toBeTruthy();
    expect(screen.getByText("entryDialog.filterProjectsHelperText")).toBeTruthy();
  });

  it("shows available project keys correctly as options", () => {
    mockUseQuery(["ABC-1", "ABC-2", "bad-key", "DEF-7", "DEF-7", "GHI-10"]);

    render(<ProjectFilter selectedProjects={[]} />);

    const input = screen.getByLabelText("entryDialog.filterProjects");
    fireEvent.keyDown(input, { key: "ArrowDown" });

    expect(screen.getByRole("option", { name: "ABC" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "DEF" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "GHI" })).toBeTruthy();
  });

  it("renders the selected projects as tags and shows the overflow count", () => {
    mockUseQuery([]);

    render(<ProjectFilter selectedProjects={["OPS", "FIN"]} />);

    expect(screen.getByText("OPS")).toBeTruthy();
    expect(screen.getByText("+1")).toBeTruthy();
  });

  it("calls onProjectsChange when the selection changes", () => {
    mockUseQuery(["OPS-1", "FIN-2"]);
    const onProjectsChange = vi.fn();

    render(<ProjectFilter selectedProjects={[]} onProjectsChange={onProjectsChange} />);

    const input = screen.getByLabelText("entryDialog.filterProjects");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.click(screen.getByRole("option", { name: "OPS" }));

    expect(onProjectsChange).toHaveBeenCalledWith(["OPS"]);
  });
});
