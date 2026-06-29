import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type GetMySettingsQuery } from "../../graphql/generated/graphql";
import useEntryFormFilters from "./useEntryFormFilters";

const apolloMocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useApolloClient: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: apolloMocks.useQuery,
  useMutation: apolloMocks.useMutation,
  useApolloClient: apolloMocks.useApolloClient,
}));

const buildSettings = (projectsPreset: string[] | null): GetMySettingsQuery => ({
  getMySettings: {
    employeeNumber: 1,
    productPreset: null,
    activityPreset: null,
    projectsPreset,
    jiraNotificationIgnore: null,
    showWeekend: null,
    setRemainingHours: null,
  },
});

describe("useEntryFormFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exposes the projects preset from settings", async () => {
    const updateSettings = vi.fn();
    const client = {
      readQuery: vi.fn(),
      writeQuery: vi.fn(),
    };

    apolloMocks.useQuery.mockReturnValue({ data: buildSettings(["PROJ-1", "PROJ-2"]) });
    apolloMocks.useMutation.mockReturnValue([updateSettings]);
    apolloMocks.useApolloClient.mockReturnValue(client);

    const { result } = renderHook(() => useEntryFormFilters());

    await waitFor(() => {
      expect(result.current.filters.projects).toEqual(["PROJ-1", "PROJ-2"]);
    });

    expect(result.current.activeFilters).toEqual(["projects"]);
  });

  it("returns no active filters when there is no preset", async () => {
    const updateSettings = vi.fn();
    const client = {
      readQuery: vi.fn(),
      writeQuery: vi.fn(),
    };

    apolloMocks.useQuery.mockReturnValue({ data: buildSettings(null) });
    apolloMocks.useMutation.mockReturnValue([updateSettings]);
    apolloMocks.useApolloClient.mockReturnValue(client);

    const { result } = renderHook(() => useEntryFormFilters());

    await waitFor(() => {
      expect(result.current.filters.projects).toEqual([]);
    });

    expect(result.current.activeFilters).toEqual([]);
  });

  it("updates the selected projects through the returned action", async () => {
    const updateSettings = vi.fn();
    const client = {
      readQuery: vi.fn(),
      writeQuery: vi.fn(),
    };

    apolloMocks.useQuery.mockReturnValue({ data: buildSettings(["PROJ-1"]) });
    apolloMocks.useMutation.mockReturnValue([updateSettings]);
    apolloMocks.useApolloClient.mockReturnValue(client);

    const { result } = renderHook(() => useEntryFormFilters());

    await waitFor(() => {
      expect(result.current.filters.projects).toEqual(["PROJ-1"]);
    });

    act(() => {
      result.current.updateSelectedProjects(["PROJ-3"]);
    });

    await waitFor(() => {
      expect(result.current.filters.projects).toEqual(["PROJ-3"]);
    });

    expect(result.current.activeFilters).toEqual(["projects"]);
  });
});
