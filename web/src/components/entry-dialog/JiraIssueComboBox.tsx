import { ListItem, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import { ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { JiraIssue } from "../../jira/jira-types";
import { useRecentJiraIssues } from "../../jira/useRecentJiraIssues";
import FormComboBox from "./FormComboBox";

const issueToOption = (issueType: "all" | "recent") => (issue: JiraIssue) => ({
  label: issue.key,
  text: `${issue.key}: ${issue.fields.summary}`,
  type: issueType,
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
  // FIXME: Change this group to "search results" or smth.
  const allGroupLabel = t("jira.issueGroups.all");

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const recent = useRecentJiraIssues();

  const options = recent.map(issueToOption("recent"));

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
        groupBy: (option) => (option.type === "recent" ? recentGroupLabel : allGroupLabel),
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
      }}
    />
  );
};

export default JiraIssueComboBox;
