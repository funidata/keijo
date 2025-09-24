import { ListItem, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormComboBox from "../../components/entry-dialog/FormComboBox";
import useIssues from "../../components/entry-dialog/useIssues";

type JiraIssueComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "issue";
  title: string;
  rules?: ControllerProps["rules"];
};

const JiraIssueComboBox = <T extends FieldValues>({ ...props }: JiraIssueComboBoxProps<T>) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { recent, rest } = useIssues();
  const options = recent
    .map((issue) => ({
      label: issue.key,
      text: `${issue.key}: ${issue.fields.summary}`,
      type: "recent",
    }))
    .concat(
      ...rest.map((issue) => ({
        label: issue.key,
        text: `${issue.key}: ${issue.fields.summary}`,
        type: "all",
      })),
    );

  return (
    <FormComboBox
      {...props}
      getFormValue={(option) => option.label}
      autoCompleteProps={{
        options: options,
        renderOption: (props, option, state) => {
          if (option.type === "loader") {
            return (
              <ListItem {...props}>
                <Typography color="GrayText">{option.text}</Typography>
              </ListItem>
            );
          }
          return (
            <ListItem {...props} style={{ overflowWrap: "break-word" }}>
              <ListItemText>{option.text}</ListItemText>
            </ListItem>
          );
        },
        groupBy: (option) => {
          if (option.type === "recent") {
            return t("jira.issueGroups.recent");
          }
          return t("jira.issueGroups.all");
        },
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
