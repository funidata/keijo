import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import JiraIssueComboBox from "./JiraIssueComboBox";

const { mockRecentIssues, mockTextIssues, mockKeyIssues, useDebounceValueMock } = vi.hoisted(
  () => ({
    mockRecentIssues: vi.fn(),
    mockTextIssues: vi.fn(),
    mockKeyIssues: vi.fn(),
    useDebounceValueMock: vi.fn(),
  }),
);

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("usehooks-ts", () => ({
  useDebounceValue: useDebounceValueMock,
}));

vi.mock("@mui/material", async () => {
  const actual = await vi.importActual<typeof import("@mui/material")>("@mui/material");
  return {
    ...actual,
    useMediaQuery: () => false,
    useTheme: () => ({ breakpoints: { down: () => "" } }),
  };
});

vi.mock("../../jira/useRecentJiraIssues", () => ({
  useRecentJiraIssues: () => mockRecentIssues(),
}));

vi.mock("../../jira/useJiraTextSearch", () => ({
  useJiraTextSearch: () => ({ issues: mockTextIssues(), loading: false }),
}));

vi.mock("../../jira/useJiraIssueKeySearch", () => ({
  useJiraIssueKeySearch: () => ({ issues: mockKeyIssues(), loading: false }),
}));

type TestFormValues = {
  issue: string;
};

const issue = {
  key: "ABC-1",
  fields: { summary: "Test issue" },
};

const TestForm = ({ onSubmit }: { onSubmit: (values: TestFormValues) => void }) => {
  const form = useForm<TestFormValues>({ defaultValues: { issue: "" } });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <JiraIssueComboBox form={form} name="issue" title="Issue" />
      <button type="submit">Save</button>
    </form>
  );
};

describe("JiraIssueComboBox", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    useDebounceValueMock.mockReturnValue(["", vi.fn()]);
    mockRecentIssues.mockReturnValue([]);
    mockTextIssues.mockReturnValue([]);
    mockKeyIssues.mockReturnValue([issue]);
  });

  it("submits the selected Jira issue key", async () => {
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Issue") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ABC-1" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });

    const option = await screen.findByRole("option", { name: "ABC-1: Test issue" });
    fireEvent.click(option);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
    expect(onSubmit.mock.calls[0][0]).toEqual({ issue: "ABC-1" });
  });

  it("submits the typed issue key when no option is selected", async () => {
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Issue") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ABC-1" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
    expect(onSubmit.mock.calls[0][0]).toEqual({ issue: "ABC-1" });
  });

  it("shows a validation error when the typed issue is unknown", async () => {
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Issue") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "UNKNOWN-1" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByText("entryDialog.validation.issueInOptions")).toBeTruthy();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
