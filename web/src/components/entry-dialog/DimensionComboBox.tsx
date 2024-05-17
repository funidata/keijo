import { useQuery } from "@apollo/client";
import { Autocomplete, FormControl, Grid, TextField } from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";

type DimensionComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
  rules?: ControllerProps["rules"];
};

const DimensionComboBox = <T extends FieldValues>({
  form,
  name,
  title,
  rules,
}: DimensionComboBoxProps<T>) => {
  const { data } = useQuery(FindDimensionOptionsDocument);

  const options = data?.findDimensionOptions[name] || [];

  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <Controller
          control={form.control as unknown as Control<FieldValues>}
          name={name}
          rules={rules}
          render={({ field: { value, onChange } }) => {
            return (
              <Autocomplete
                value={value}
                onChange={(_, value) => onChange(value)}
                options={options}
                autoHighlight
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={title}
                    onChange={onChange}
                    error={!!form.formState.errors[name]}
                    helperText={form.formState.errors[name]?.message as string}
                  />
                )}
              />
            );
          }}
        />
      </FormControl>
    </Grid>
  );
};

export default DimensionComboBox;
