import { ListItem, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
  Control,
  ControllerProps,
  FieldValues,
  UseFormReturn,
  Controller,
  Path,
} from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete, { type AutocompleteInputChangeReason } from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import useJiraIssueOptions, { type Option } from "./useJiraIssueOptions";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GetMySettingsDocument } from "../../graphql/generated/graphql";

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
  const [inputValue, setInputValue] = useState("");

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const { options } = useJiraIssueOptions(searchTerm);
  const { data: settingsData } = useQuery(GetMySettingsDocument);
  const showJiraIssueStatus = !!settingsData?.getMySettings.showJiraIssueStatus;

  useEffect(() => {
    const currentIssue = form.getValues(name as Path<T>) as string | null;

    if (!currentIssue) {
      setInputValue("");
      return;
    }

    const matched = options.find((option) => option.value === currentIssue);
    setInputValue(matched ? matched.label : currentIssue);
  }, [form, name, options]);

  const validateIssue = (value: string | null | Option) => {
    if (!value) return true;
    const normalizedValue = typeof value === "string" ? value : value.value;
    const exists = options.some((option) => option.value === normalizedValue);
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
              inputValue={inputValue}
              onChange={(_, selectedOption) => {
                if (selectedOption == null) {
                  onChange(null);
                  setInputValue("");
                } else if (typeof selectedOption === "string") {
                  onChange(selectedOption);
                  setInputValue(selectedOption);
                } else {
                  onChange(selectedOption.value);
                  setInputValue(selectedOption.label);
                }
              }}
              onInputChange={(_, value, reason: AutocompleteInputChangeReason) => {
                if (reason === "input") {
                  setSearchTerm(value);
                  setInputValue(value);
                  onChange(value);
                } else if (reason === "clear") {
                  setSearchTerm("");
                  setInputValue("");
                  onChange(null);
                }
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
              getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
              getOptionDisabled={(option) => option.disabled}
              renderOption={(props, option) => {
                const { key, ...rest } = props;
                return (
                  <ListItem key={key} {...rest} style={{ overflowWrap: "break-word" }}>
                    <ListItemText primary={option.label} sx={{ flex: 1, minWidth: 0, mr: 2 }} />
                    {showJiraIssueStatus && option.status && (
                      <ListItemText
                        secondary={
                          <Typography sx={{ color: theme.palette.secondary.dark }} noWrap>
                            {option.status}
                          </Typography>
                        }
                        sx={{ flex: "none" }}
                      />
                    )}
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
              clearText={t("entryDialog.input.clear")}
              filterOptions={() => options}
            />
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default JiraIssueComboBox;
