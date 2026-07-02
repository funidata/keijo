import { ListItem, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import { Control, ControllerProps, FieldValues, UseFormReturn, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDebounceValue } from "usehooks-ts";
import { JiraIssue } from "../../jira/jira-types";
import { useJiraIssueKeySearch } from "../../jira/useJiraIssueKeySearch";
import { useJiraTextSearch } from "../../jira/useJiraTextSearch";
import { useRecentJiraIssues } from "../../jira/useRecentJiraIssues";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";

interface Option {
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

type JiraIssueComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "issue";
  title: string;
  rules?: ControllerProps["rules"];
};

const JiraIssueComboBox = <T extends FieldValues>({
  form,
  name,
  title,
  rules,
}: JiraIssueComboBoxProps<T>) => {
  const { t } = useTranslation();

  // Debounce search term to avoid firing queries on every key press.
  const [searchTerm, setSearchTerm] = useDebounceValue("", 300);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

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

  // Validation for 'issue' field
  // Make sure the selected value exists in the options and convert value to string
  const validateIssue = (value: string | null | Option) => {
    if (!value) return true;
    const exists = options.some((option) =>
      typeof option === "string" ? option === value : option.value === value,
    );
    return exists ? true : t("entryDialog.validation.issueInOptions");
  };

  const mergedRules = { ...(rules || {}), validate: validateIssue };

  return (
    <Grid
      size={{
        xs: 12,
        md: 6,
      }}
    >
      <FormControl fullWidth>
        <Controller
          control={form.control as Control<FieldValues>}
          name={name}
          rules={mergedRules}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Autocomplete
              autoHighlight
              freeSolo
              forcePopupIcon
              value={value ?? ""}
              onChange={(_, selectedOption) => {
                if (selectedOption == null || typeof selectedOption === "string") {
                  onChange(selectedOption);
                } else {
                  onChange(selectedOption.value);
                }
              }}
              onInputChange={(_, value) => {
                onChange(value);
                setSearchTerm(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={title}
                  error={!!error}
                  helperText={error?.message as string}
                />
              )}
              options={options}
              getOptionDisabled={(option) => option.disabled}
              renderOption={(props, option) => {
                const { key, ...rest } = props;
                return (
                  <ListItem key={key} {...rest} style={{ overflowWrap: "break-word" }}>
                    <ListItemText>{option.label}</ListItemText>
                  </ListItem>
                );
              }}
              groupBy={(option) => option.groupLabel}
              slotProps={
                !mobile
                  ? {
                      popper: {
                        style: {
                          width: "45vw",
                          maxWidth: "580px",
                        },
                        placement: "bottom-start",
                      },
                    }
                  : undefined
              }
              filterOptions={() => options}
            />
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default JiraIssueComboBox;
