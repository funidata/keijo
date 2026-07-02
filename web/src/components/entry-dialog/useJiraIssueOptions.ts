import { useJiraIssueKeySearch } from "../../jira/useJiraIssueKeySearch";
import { useJiraTextSearch } from "../../jira/useJiraTextSearch";
import { useRecentJiraIssues } from "../../jira/useRecentJiraIssues";
import { useTranslation } from "react-i18next";
import { JiraIssue } from "../../jira/jira-types";

export interface Option {
  value: string;
  label: string;
  groupLabel: string;
  disabled: boolean;
}

const issueToOption =
  (groupLabel: string) =>
  (issue: JiraIssue): Option => ({
    value: issue.key,
    label: `${issue.key}: ${issue.fields.summary}`,
    groupLabel,
    disabled: false,
  });

export default function useJiraIssueOptions(searchTerm: string) {
  const { t } = useTranslation();
  const recentGroupLabel = t("jira.issueGroups.recent");
  const keySearchResultGroupLabel = t("jira.issueGroups.keySearchResults");
  const textSearchResultGroupLabel = t("jira.issueGroups.textSearchResults");

  const recent = useRecentJiraIssues();
  const { issues: textSearchIssues, loading: textSearchLoading } = useJiraTextSearch(searchTerm);
  const { issues: keySearchIssues, loading: keySearchLoading } = useJiraIssueKeySearch(searchTerm);

  const keySearchOptions = keySearchIssues.map(issueToOption(keySearchResultGroupLabel));
  const textSearchOptions = textSearchIssues.map(issueToOption(textSearchResultGroupLabel));
  const recentOptions = recent.map(issueToOption(recentGroupLabel));

  const searchResultsGroupLabel = t("jira.issueGroups.searchResults");
  const noSearchResultsLabel = t("jira.issueGroups.noSearchResults");
  const typeToSearchLabel = t("jira.issueGroups.typeToSearch");

  const noSearchResults =
    keySearchIssues.length === 0 && textSearchIssues.length === 0
      ? [
          {
            value: "",
            label: searchTerm ? noSearchResultsLabel : typeToSearchLabel,
            groupLabel: searchResultsGroupLabel,
            disabled: true,
          },
        ]
      : [];

  const loadingLabel = t("jira.issueGroups.loading");

  const loadingIndicator =
    noSearchResults.length === 0 && (textSearchLoading || keySearchLoading)
      ? [
          {
            value: "",
            label: loadingLabel,
            groupLabel: searchResultsGroupLabel,
            disabled: true,
          },
        ]
      : [];

  const options = keySearchOptions.concat(
    textSearchOptions,
    noSearchResults,
    loadingIndicator,
    recentOptions,
  );

  return { options };
}
