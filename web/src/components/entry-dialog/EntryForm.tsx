import { Box, Button, Grid, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DimensionSelect from "./DimensionSelect";
import DurationSlider from "./DurationSlider";
import { EntryFormSchema } from "./EntryDialog";
import ResponsiveDatePicker from "./ResponsiveDatePicker";

type EntryFormProps = {
  control: Control<EntryFormSchema>;
  onSubmit: () => void;
  reset: () => void;
};

const EntryForm = ({ control, reset, onSubmit }: EntryFormProps) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} onReset={reset}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Controller name="date" control={control} render={ResponsiveDatePicker} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller name="duration" control={control} render={DurationSlider} />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField {...field} label={t("entryDialog.description")} fullWidth />
            )}
          />
        </Grid>
        <DimensionSelect control={control} name="product" title={t("entryDialog.product")} />
        <DimensionSelect control={control} name="activity" title={t("entryDialog.activity")} />
        <DimensionSelect control={control} name="issue" title={t("entryDialog.issue")} />
        <DimensionSelect control={control} name="client" title={t("entryDialog.client")} />
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
            <Button type="reset" variant="outlined" size="large" onClick={reset}>
              {t("entryDialog.reset")}
            </Button>
            <Button type="submit" variant="contained" size="large">
              {t("entryDialog.submit")}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default EntryForm;
