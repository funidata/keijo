import { FormControl, Grid } from "@mui/material";
import { Controller, ControllerProps } from "react-hook-form";

const DimensionController = ({ ...params }: ControllerProps) => {
  return (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth>
        <Controller {...params} />
      </FormControl>
    </Grid>
  );
};

export default DimensionController;
