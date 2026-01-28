import { Autocomplete, FormControl, TextField, Grid } from "@mui/material";
import { Controller, ControllerProps, FieldValues, Control, UseFormReturn, Path } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDimensionOptions } from "../../common/useDimensionOptions";

type DimensionComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
  rules?: ControllerProps["rules"];
};

const DimensionComboBox = <T extends FieldValues>({ form, name, title, rules }: DimensionComboBoxProps<T>) => {
  const dimensionOptions = useDimensionOptions();
  const options = dimensionOptions[name] || [];
  const { t } = useTranslation();

  // Validation for 'issue' field
  const validateIssue = (value: string | null) => {
    return !value || options.includes(value) ? true : t("entryDialog.validation.issueInOptions");
  };

  // Merge rules and validate
  const mergedRules = name === "issue"
    ? { ...(rules || {}), validate: validateIssue }
    : rules;

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <FormControl fullWidth>
        <Controller
          control={form.control as Control<FieldValues>}
          name={name as Path<T>}
          rules={mergedRules}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              value={value ?? ""}
              onChange={(_, newValue) => onChange(newValue)}
							onInputChange={(_, newInputValue) => {
									onChange(newInputValue);
							}}
              options={options}
              autoHighlight
              freeSolo={name === "issue"}
              forcePopupIcon
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={title}
                  error={!!form.formState.errors[name]}
                  helperText={form.formState.errors[name]?.message as string}
                />
              )}
            />
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default DimensionComboBox;
