import { Box, Button, Grid, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import DimensionSelect from "./DimensionSelect";
import { EntryFormSchema } from "./EntryDialog";
import ResponsiveDatePicker from "./ResponsiveDatePicker";

type EntryFormProps = {
  control: Control<EntryFormSchema>;
  onSubmit: () => void;
  reset: () => void;
};

const EntryForm = ({ control, reset, onSubmit }: EntryFormProps) => {
  return (
    <form onSubmit={onSubmit} onReset={reset}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller name="date" control={control} render={ResponsiveDatePicker} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="duration"
            control={control}
            render={({ field }) => <TextField {...field} />}
          />
        </Grid>
        <DimensionSelect control={control} name="product" title="Tuote" />
        <DimensionSelect control={control} name="activity" title="Toiminto" />
        <DimensionSelect control={control} name="issue" title="Tiketti" />
        <DimensionSelect control={control} name="client" title="Asiakas" />
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
            <Button type="reset" variant="outlined" size="large">
              Clear
            </Button>
            <Button type="submit" variant="contained" size="large">
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default EntryForm;
