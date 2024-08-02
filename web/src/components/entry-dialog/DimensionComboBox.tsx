import { useQuery } from "@apollo/client";
import {
  Autocomplete,
  AutocompleteProps,
  FormControl,
  Grid,
  GridOwnProps,
  TextField,
} from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import useOptionsFilter from "./useOptionsFilter";
import { createFilterOptions } from "@mui/material/Autocomplete";

type DimensionComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
  rules?: ControllerProps["rules"];
  autoCompleteProps?: Partial<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AutocompleteProps<any, boolean | undefined, boolean | undefined, boolean | undefined>
  >;
  gridProps?: GridOwnProps;
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
  const { data } = useQuery(FindDimensionOptionsDocument);
  const options = data?.findDimensionOptions[name] || [];

  const extFilter = useOptionsFilter<string>((option) => option);

  return (
    <Grid item xs={12} md={6} {...gridProps}>
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
              filterOptions={(options, state) => inputFilter(extFilter(options), state)}
              {...autoCompleteProps}
            />
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default DimensionComboBox;
