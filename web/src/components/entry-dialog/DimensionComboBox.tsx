import { useQuery } from "@apollo/client";
import { Autocomplete, FormControl, Grid, TextField } from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { EntryFormSchema } from "./useEntryForm";

type DimensionComboBoxProps = {
  form: UseFormReturn<EntryFormSchema>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
  rules?: ControllerProps["rules"];
};

const DimensionComboBox = ({ form, name, title, rules }: DimensionComboBoxProps) => {
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
                    helperText={form.formState.errors[name]?.message}
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
