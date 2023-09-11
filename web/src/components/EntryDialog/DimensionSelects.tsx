import { useQuery } from "@apollo/client";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect } from "react";
import { Control, Controller, FieldArrayWithId, useFieldArray } from "react-hook-form";
import { EntryFormSchema } from ".";
import { FindDimensionsDocument } from "../../graphql/generated/graphql";

type DimensionSelectProps = {
  control: Control<EntryFormSchema, any>;
  index: number;
  field: FieldArrayWithId<EntryFormSchema>;
};

const DimensionSelect = ({ field, control, index }: DimensionSelectProps) => {
  const labelId = `add-entry-dimension-select-${field.name}`;

  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <InputLabel id={labelId}>{field.name}</InputLabel>
        <Controller
          control={control}
          name={`dimensions.${index}.value`}
          render={({ field: props }) => {
            return (
              <Select labelId={labelId} label={field.name} {...props}>
                {field.options.map((opt) => (
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

type DimensionSelectsProps = {
  control: Control<EntryFormSchema, any>;
};

const DimensionSelects = ({ control }: DimensionSelectsProps) => {
  const { data } = useQuery(FindDimensionsDocument);
  const { fields, append } = useFieldArray({ name: "dimensions", control });

  useEffect(() => {
    data?.findDimensions.forEach((dimension) =>
      append({ name: dimension.name, options: dimension.options, value: "" }),
    );
  }, [data, append]);

  return (
    <>
      {fields.map((field, index) => (
        <DimensionSelect field={field} index={index} control={control} key={field.id} />
      ))}
    </>
  );
};

export default DimensionSelects;
