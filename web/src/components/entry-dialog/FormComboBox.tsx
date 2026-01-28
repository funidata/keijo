import { Autocomplete, AutocompleteProps, FormControl, Grid, TextField } from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type FormComboBoxProps<T extends FieldValues, E> = {
  form: UseFormReturn<T>;
  name: string;
  title: string;
  rules?: ControllerProps["rules"];
  autoCompleteProps: Omit<
    AutocompleteProps<E, false, boolean | undefined, true>,
    "renderInput" | "value"
  >;
};

const FormComboBox = <T extends FieldValues, E>({
  form,
  name,
  title,
  rules,
  autoCompleteProps,
}: FormComboBoxProps<T, E>) => {
  const { t } = useTranslation();

  // Validation for 'issue' field
  // Make sure the selected value exists in the options and convert value to string
  const validateIssue = (value: string | E | null) => {
    if (!value) return true;
    const exists = autoCompleteProps.options.some((option) =>
      typeof option === "string"
        ? option === value
        : (option as E & { value: string }).value === value,
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
              {...autoCompleteProps}
              value={value ?? ""}
              onChange={(_, value) => {
                onChange(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={title}
                  onChange={onChange}
                  error={!!error}
                  helperText={error?.message as string}
                />
              )}
            />
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default FormComboBox;
