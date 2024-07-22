import { useQuery } from "@apollo/client";
import { Autocomplete, AutocompleteProps, FormControl, Grid, TextField } from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import {
  FindDimensionOptionsDocument,
  GetMySettingsDocument,
} from "../../graphql/generated/graphql";
import { useCallback } from "react";

type DimensionComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
  rules?: ControllerProps["rules"];
  autoCompleteProps?: Partial<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AutocompleteProps<any, boolean | undefined, boolean | undefined, boolean | undefined>
  >;
};

const DimensionComboBox = <T extends FieldValues>({
  form,
  name,
  title,
  rules,
  autoCompleteProps,
}: DimensionComboBoxProps<T>) => {
  const { data } = useQuery(FindDimensionOptionsDocument);
  const options = data?.findDimensionOptions[name] || [];

  const { data: settingsData } = useQuery(GetMySettingsDocument);

  const filterOptions = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (options: any[]) => {
      const projectsFilter = settingsData?.getMySettings.projectsPreset;
      if (projectsFilter) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return options.filter((option: { label: any }) =>
          projectsFilter.some((project) => ((option?.label || option) as string).includes(project)),
        );
      }
      return options;
    },
    [settingsData?.getMySettings.projectsPreset],
  );

  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <Controller
          control={form.control as unknown as Control<FieldValues>}
          name={name}
          rules={rules}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              value={value || null}
              onChange={(_, value) => onChange(value?.label || value)}
              options={options}
              autoHighlight
              freeSolo
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
              filterOptions={filterOptions}
            />
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default DimensionComboBox;
