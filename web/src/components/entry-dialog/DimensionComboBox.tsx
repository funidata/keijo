import { useQuery } from "@apollo/client";
import { Autocomplete, FormControl, Grid, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { EntryFormSchema } from "./useEntryForm";

type DimensionComboBoxProps = {
  form: UseFormReturn<EntryFormSchema>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
};

const DimensionComboBox = ({ form, name, title }: DimensionComboBoxProps) => {
  const { data } = useQuery(FindDimensionOptionsDocument);

  const options = data?.findDimensionOptions[name] || [];

  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <Controller
          control={form.control}
          name={name}
          render={({ field: { value, onChange } }) => {
            return (
              <Autocomplete
                value={value}
                onChange={(_, value) => onChange(value)}
                options={options}
                autoHighlight
                autoSelect
                renderInput={(params) => (
                  <TextField {...params} label={title} onChange={onChange} />
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
