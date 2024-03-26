import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Grid,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useDayjs from "../../common/useDayjs";
import { Entry } from "../../graphql/generated/graphql";
import BigDeleteEntryButton from "./BigDeleteEntryButton";
import DimensionComboBox from "./DimensionComboBox";
import DurationSlider from "./DurationSlider";
import { EntryFormSchema } from "./EntryDialog";
import ResponsiveDatePicker from "./ResponsiveDatePicker";

type EntryFormProps = {
  form: UseFormReturn<EntryFormSchema>;
  onSubmit: () => void;
  reset: () => void;
  editEntry?: Entry;
  originalDate?: Dayjs;
};

const EntryForm = ({ reset, onSubmit, editEntry, originalDate, form }: EntryFormProps) => {
  const dayjs = useDayjs();
  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { control, watch } = form;
  const date = watch("date");

  return (
    <form onSubmit={onSubmit} onReset={reset}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <DimensionComboBox control={control} name="product" title={t("entryDialog.product")} />
            <DimensionComboBox
              control={control}
              name="activity"
              title={t("entryDialog.activity")}
            />
            <DimensionComboBox control={control} name="issue" title={t("entryDialog.issue")} />
            <DimensionComboBox control={control} name="client" title={t("entryDialog.client")} />
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label={t("entryDialog.description")} fullWidth />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller name="duration" control={control} render={DurationSlider} />
          {mobile ? (
            <Controller name="date" control={control} render={ResponsiveDatePicker} />
          ) : (
            <Box>
              <Accordion sx={{ border: 0 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ textTransform: "capitalize" }}
                >
                  {dayjs(date).format("dddd L")}
                </AccordionSummary>
                <AccordionDetails>
                  <Controller name="date" control={control} render={ResponsiveDatePicker} />
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Grid>
        {editEntry && (
          <Grid item xs={12}>
            <Alert severity="info">{t("entryDialog.editingNote")}</Alert>
          </Grid>
        )}
        {mobile ? (
          <>
            <Grid item xs={12} sx={{ mt: 2 }}>
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
          <Grid item xs={12} sx={{ mt: 2 }}>
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
