import { useQuery } from "@apollo/client";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { EntryFormSchema } from "./EntryDialog";

type DimensionSelectProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<EntryFormSchema, any>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
};

const DimensionSelect = ({ control, name, title }: DimensionSelectProps) => {
  const labelId = `add-entry-dimension-select-${name}`;
  const { data } = useQuery(FindDimensionOptionsDocument);

  if (!data) {
    return null;
  }

  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <InputLabel id={labelId}>{title}</InputLabel>
        <Controller
          control={control}
          name={name}
          render={({ field: props }) => {
            return (
              <Select labelId={labelId} label={name} {...props}>
                {data.findDimensionOptions[name].map((opt: string) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            );
          }}
        />
      </FormControl>
    </Grid>
  );
};

export default DimensionSelect;
