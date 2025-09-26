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
  label: issue.key,
  text: `${issue.key}: ${issue.fields.summary}`,
  groupLabel,
});

type JiraIssueComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "issue";
  title: string;
  rules?: ControllerProps["rules"];
};

const JiraIssueComboBox = <T extends FieldValues>(props: JiraIssueComboBoxProps<T>) => {
  const { t } = useTranslation();
  const recentGroupLabel = t("jira.issueGroups.recent");
  const keySearchResultGroupLabel = t("jira.issueGroups.keySearchResults");
  const textSearchResultGroupLabel = t("jira.issueGroups.textSearchResults");

  // Debounce search term to avoid firing queries on every key press.
  const [searchTerm, setSearchTerm] = useDebounceValue("", 300);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const recent = useRecentJiraIssues();
  // FIXME: These are not filtered by NV issues.
  const textSearch = useJiraTextSearch(searchTerm);
  const keySearch = useJiraIssueKeySearch(searchTerm);

  const keySearchOptions = keySearch.map(issueToOption(keySearchResultGroupLabel));
  const textSearchOptions = textSearch.map(issueToOption(textSearchResultGroupLabel));
  const recentOptions = recent.map(issueToOption(recentGroupLabel));

  const options = keySearchOptions.concat(textSearchOptions, recentOptions);

  return (
    <FormComboBox
      {...props}
      getFormValue={(option) => option.label}
      autoCompleteProps={{
        options: options,
        renderOption: (props, option) => (
          <ListItem {...props} style={{ overflowWrap: "break-word" }}>
            <ListItemText>{option.text}</ListItemText>
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
      }}
    />
  );
};

export default JiraIssueComboBox;
