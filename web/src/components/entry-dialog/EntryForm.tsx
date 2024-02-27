import { Box, Button, Divider, Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { Dayjs } from "dayjs";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Entry } from "../../graphql/generated/graphql";
import BigDeleteEntryButton from "./BigDeleteEntryButton";
import DimensionSelect from "./DimensionSelect";
import DurationSlider from "./DurationSlider";
import { EntryFormSchema } from "./EntryDialog";
import ResponsiveDatePicker from "./ResponsiveDatePicker";

type EntryFormProps = {
  control: Control<EntryFormSchema>;
  onSubmit: () => void;
  reset: () => void;
  editEntry?: Entry;
  originalDate?: Dayjs;
};

const EntryForm = ({ control, reset, onSubmit, editEntry, originalDate }: EntryFormProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <form onSubmit={onSubmit} onReset={reset}>
      <Grid container spacing={2} item>
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
          {mobile && <Divider sx={{ width: "100%", mt: 3, mb: 1 }} />}
        </Grid>
        <DimensionSelect control={control} name="product" title={t("entryDialog.product")} />
        <DimensionSelect control={control} name="activity" title={t("entryDialog.activity")} />
        <DimensionSelect control={control} name="issue" title={t("entryDialog.issue")} />
        <DimensionSelect control={control} name="client" title={t("entryDialog.client")} />
        {mobile ? (
          <>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                {t("entryDialog.submit")}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button type="reset" variant="outlined" size="large" onClick={reset} fullWidth>
                {editEntry ? t("entryDialog.reset") : t("entryDialog.clear")}
              </Button>
            </Grid>
            <Grid item xs={12}>
              {editEntry && originalDate && (
                <BigDeleteEntryButton entryKey={editEntry.key} date={originalDate} />
              )}
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
              <Button type="reset" variant="outlined" size="large" onClick={reset}>
                {editEntry ? t("entryDialog.reset") : t("entryDialog.clear")}
              </Button>
              <Button type="submit" variant="contained" size="large">
                {t("entryDialog.submit")}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default EntryForm;
