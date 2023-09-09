import { useQuery } from "@apollo/client";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { Dimension, FindDimensionsDocument } from "../../graphql/generated/graphql";

type DimensionSelectProps = {
  dimension: Dimension;
};

const DimensionSelect = ({ dimension }: DimensionSelectProps) => {
  const labelId = `add-entry-dimension-select-${dimension.name}`;

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{dimension.name}</InputLabel>
      <Select labelId={labelId} label={dimension.name}>
        {dimension.options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const DimensionSelects = () => {
  const { data } = useQuery(FindDimensionsDocument);

  return (
    <>
      {data?.findDimensions.map((dimension) => (
        <Grid item xs={12} md={6} key={`add-entry-dimension-${dimension.name}`}>
          <DimensionSelect dimension={dimension} />
        </Grid>
      ))}
    </>
  );
};

export default DimensionSelects;
