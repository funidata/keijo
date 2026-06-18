import {
  Autocomplete,
  AutocompleteProps,
  FormControl,
  Grid,
  GridProps,
  TextField,
} from "@mui/material";
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import useOptionsFilter from "./useOptionsFilter";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
import { useDimensionOptions } from "../../common/useDimensionOptions";

type DimensionComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
  rules?: ControllerProps["rules"];
  autoCompleteProps?: Partial<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AutocompleteProps<any, boolean | undefined, boolean | undefined, boolean | undefined>
  >;
  gridProps?: GridProps;
};

const inputFilter = createFilterOptions({
  stringify: (option: string) => option,
});

const DimensionComboBox = <T extends FieldValues>({
  form,
  name,
  title,
  rules,
  autoCompleteProps,
  gridProps,
}: DimensionComboBoxProps<T>) => {
  const dimensionOptions = useDimensionOptions();
  const options = dimensionOptions[name] || [];
  const { t } = useTranslation();

  // Validation for 'issue' field
  const validateIssue = (value: string | null) => {
    return !value || options.includes(value) ? true : t("entryDialog.validation.issueInOptions");
  };

  // Merge rules and validate
  const mergedRules = name === "issue" ? { ...(rules || {}), validate: validateIssue } : rules;

  const extFilter = useOptionsFilter<string>((option) => option);

  return (
    <Grid size={{ xs: 12, md: 6 }} {...gridProps}>
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
              filterOptions={(options, state) =>
                inputFilter(name === "issue" ? extFilter(options) : options, state)
              }
              {...autoCompleteProps}
            />
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default DimensionComboBox;
