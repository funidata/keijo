import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DefaultsForm from "./DefaultsForm";

const mocks = vi.hoisted(() => ({
  isJiraAuth: true,
  settingsData: {
    getMySettings: {
      activityPreset: "Development",
      productPreset: "Keijo",
      showJiraIssueStatus: false,
    },
  } as
    | {
        getMySettings: {
          activityPreset: string;
          productPreset: string;
          showJiraIssueStatus: boolean;
        };
      }
    | undefined,
  updateSettings: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useMutation: () => [mocks.updateSettings],
  useQuery: () => ({ data: mocks.settingsData }),
}));

vi.mock("../../common/useDimensionOptions", () => ({
  useDimensionOptions: () => ({
    activity: ["Development", "Design"],
    product: ["Keijo", "Other"],
  }),
}));

vi.mock("../../jira/jira-api", () => ({
  useIsJiraAuthenticated: () => ({ isJiraAuth: mocks.isJiraAuth }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

afterEach(() => {
  cleanup();
  mocks.isJiraAuth = true;
  mocks.settingsData = {
    getMySettings: {
      activityPreset: "Development",
      productPreset: "Keijo",
      showJiraIssueStatus: false,
    },
  };
  mocks.updateSettings.mockReset();
});

describe("DefaultsForm", () => {
  it("renders nothing while settings are unavailable", () => {
    mocks.settingsData = undefined;

    const { container } = render(<DefaultsForm />);

    expect(container.innerHTML).toBe("");
  });

  it("renders the preset fields and Jira issue status switch for authenticated Jira users", () => {
    render(<DefaultsForm />);

    expect((screen.getByLabelText("entryDialog.product") as HTMLInputElement).value).toBe("Keijo");
    expect((screen.getByLabelText("entryDialog.activity") as HTMLInputElement).value).toBe(
      "Development",
    );
    expect(
      (screen.getByLabelText("entryDialog.showJiraIssueStatus") as HTMLInputElement).checked,
    ).toBe(false);
  });

  it("does not render the Jira issue status switch for unauthenticated Jira users", () => {
    mocks.isJiraAuth = false;

    render(<DefaultsForm />);

    expect((screen.getByLabelText("entryDialog.product") as HTMLInputElement).value).toBe("Keijo");
    expect((screen.getByLabelText("entryDialog.activity") as HTMLInputElement).value).toBe(
      "Development",
    );
    expect(screen.queryByLabelText("entryDialog.showJiraIssueStatus")).toBeNull();
  });

  it("updates the Jira issue status setting when the switch changes", () => {
    render(<DefaultsForm />);

    fireEvent.click(screen.getByLabelText("entryDialog.showJiraIssueStatus"));

    expect(mocks.updateSettings).toHaveBeenCalledWith({
      variables: { settings: { showJiraIssueStatus: true } },
    });
  });
});
