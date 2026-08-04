import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EntryType } from "../../../common/entryType.enum";
import { AcceptanceStatus } from "../../../graphql/generated/graphql";
import MobileEntryRow from "./MobileEntryRow";

dayjs.extend(duration);

const { mockUseJiraIssueSummary } = vi.hoisted(() => ({
  mockUseJiraIssueSummary: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../../jira/useJiraIssueSummary", () => ({
  useJiraIssueSummary: () => mockUseJiraIssueSummary(),
}));

vi.mock("../../../theme/useDarkMode", () => ({
  default: () => ({ darkMode: false }),
}));

const baseEntry = {
  key: "1",
  duration: 8,
  durationInHours: false,
  description: "",
  typeName: "Normal Work",
  ratioNumber: EntryType.NormalWork,
  // Use Accepted to avoid rendering EditEntryButton and its dependencies.
  acceptanceStatus: AcceptanceStatus.Accepted,
  product: null,
  activity: null,
  issue: null,
  client: null,
};

const date = dayjs();

describe("MobileEntryRow issue tooltip", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    mockUseJiraIssueSummary.mockReturnValue({ summary: undefined, isJiraAuth: false });
  });

  it("renders the issue chip when an issue is set", () => {
    render(<MobileEntryRow entry={{ ...baseEntry, issue: "PROJ-1" }} date={date} />);

    expect(screen.getByText("PROJ-1")).toBeTruthy();
  });

  it("does not show a tooltip when Jira is not authenticated", () => {
    render(<MobileEntryRow entry={{ ...baseEntry, issue: "PROJ-1" }} date={date} />);

    fireEvent.mouseOver(screen.getByText("PROJ-1"));

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows a tooltip when Jira is authenticated", async () => {
    mockUseJiraIssueSummary.mockReturnValue({ summary: "Fix login bug", isJiraAuth: true });
    render(<MobileEntryRow entry={{ ...baseEntry, issue: "PROJ-1" }} date={date} />);

    fireEvent.mouseOver(screen.getByText("PROJ-1"));

    expect(await screen.findByRole("tooltip")).toBeTruthy();
  });
});
