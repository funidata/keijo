import { useQuery } from "@apollo/client";
import { Autocomplete, FormControl, Grid, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { EntryFormSchema } from "./EntryDialog";

type DimensionComboBoxProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<EntryFormSchema, any>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
};

const DimensionComboBox = ({ control, name, title }: DimensionComboBoxProps) => {
  const { data } = useQuery(FindDimensionOptionsDocument);

  if (!data) {
    return null;
  }

  const options = data.findDimensionOptions[name];

  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <Controller
          control={control}
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
