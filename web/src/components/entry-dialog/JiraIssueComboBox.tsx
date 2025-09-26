import { ListItem, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import { ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDebounceValue } from "usehooks-ts";
import { JiraIssue } from "../../jira/jira-types";
import { useJiraIssueKeySearch } from "../../jira/useJiraIssueKeySearch";
import { useJiraTextSearch } from "../../jira/useJiraTextSearch";
import { useRecentJiraIssues } from "../../jira/useRecentJiraIssues";
import FormComboBox from "./FormComboBox";

const issueToOption = (groupLabel: string) => (issue: JiraIssue) => ({
  value: issue.key,
  label: `${issue.key}: ${issue.fields.summary}`,
  groupLabel,
  disabled: false,
});

type JiraIssueComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "issue";
  title: string;
  rules?: ControllerProps["rules"];
};

const JiraIssueComboBox = <T extends FieldValues>(props: JiraIssueComboBoxProps<T>) => {
  const { t } = useTranslation();

  // Debounce search term to avoid firing queries on every key press.
  const [searchTerm, setSearchTerm] = useDebounceValue("", 300);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const recentGroupLabel = t("jira.issueGroups.recent");
  const keySearchResultGroupLabel = t("jira.issueGroups.keySearchResults");
  const textSearchResultGroupLabel = t("jira.issueGroups.textSearchResults");

  const recent = useRecentJiraIssues();
  const textSearch = useJiraTextSearch(searchTerm);
  const keySearch = useJiraIssueKeySearch(searchTerm);

  const keySearchOptions = keySearch.map(issueToOption(keySearchResultGroupLabel));
  const textSearchOptions = textSearch.map(issueToOption(textSearchResultGroupLabel));
  const recentOptions = recent.map(issueToOption(recentGroupLabel));

  const searchResultsGroupLabel = t("jira.issueGroups.searchResults");
  const noSearchResultsLabel = t("jira.issueGroups.noSearchResults");
  const typeToSearchLabel = t("jira.issueGroups.typeToSearch");

  const noSearchResults =
    keySearch.length === 0 && textSearch.length === 0
      ? [
          {
            value: "",
            label: searchTerm ? noSearchResultsLabel : typeToSearchLabel,
            groupLabel: searchResultsGroupLabel,
            disabled: true,
          },
        ]
      : [];

  const options = keySearchOptions.concat(textSearchOptions, noSearchResults, recentOptions);

  return (
    <FormComboBox
      {...props}
      getFormValue={(option) => option.value}
      autoCompleteProps={{
        options: options,
        getOptionDisabled: (option) => option.disabled,
        renderOption: (props, option) => (
          <ListItem {...props} style={{ overflowWrap: "break-word" }}>
            <ListItemText>{option.label}</ListItemText>
          </ListItem>
        ),
        groupBy: (option) => option.groupLabel,
        componentsProps: !mobile
          ? {
              popper: {
                style: {
                  width: "45vw",
                  maxWidth: "580px",
                },
                placement: "bottom-start",
              },
            }
          : undefined,
        onInputChange: (_, value) => {
          setSearchTerm(value);
        },
        filterOptions: () => options,
      }}
    />
  );
};

export default JiraIssueComboBox;
