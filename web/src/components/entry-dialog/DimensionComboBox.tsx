import { useQuery } from "@apollo/client";
import { Autocomplete, AutocompleteProps, FormControl, Grid, TextField } from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useTranslation } from "react-i18next";
import { useDimensionOptions } from "../../common/useDimensionOptions";
import FormComboBox from "./FormComboBox";


type DimensionComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
  rules?: ControllerProps["rules"];
};

const DimensionComboBox = <T extends FieldValues>({ ...props }: DimensionComboBoxProps<T>) => {
  const dimensionOptions = useDimensionOptions();
  const options = dimensionOptions[props.name];

  const { t } = useTranslation();
  const validateIssue = (value: string | null) => {
    return !value || options.includes(value) || t("entryDialog.validation.issueInOptions");
  };

  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <Controller
          control={form.control as unknown as Control<FieldValues>}
          name={name}
          rules={{ validate: name === "issue" ? validateIssue : undefined, ...rules }}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              value={value || null}
              onChange={(_, value) => onChange(value?.label || value)}
              options={options}
              autoHighlight
              freeSolo={name === "issue"}
              forcePopupIcon
              clearOnBlur
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={title}
                  onChange={onChange}
                  error={!!form.formState.errors[name]}
                  helperText={form.formState.errors[name]?.message as string}
                />
              )}
              {...autoCompleteProps}
            />
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default DimensionComboBox;
