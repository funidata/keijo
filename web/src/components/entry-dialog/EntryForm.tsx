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
import { AcceptanceStatus, Entry } from "../../graphql/generated/graphql";
import BigDeleteEntryButton from "./BigDeleteEntryButton";
import DimensionComboBox from "./DimensionComboBox";
import DurationSlider from "./DurationSlider";
import ResponsiveDatePicker from "./ResponsiveDatePicker";
import { EntryFormSchema } from "./useEntryForm";

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
            <DimensionComboBox
              form={form}
              name="product"
              title={t("entryDialog.product")}
              rules={{ required: t("entryDialog.validation.productRequired") }}
            />
            <DimensionComboBox
              form={form}
              name="activity"
              title={t("entryDialog.activity")}
              rules={{ required: t("entryDialog.validation.activityRequired") }}
            />
            <DimensionComboBox form={form} name="issue" title={t("entryDialog.issue")} />
            <DimensionComboBox form={form} name="client" title={t("entryDialog.client")} />
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                rules={{
                  validate: (descriptionValue) => {
                    const activity = watch("activity");
                    const ticketRequired = activity === "Toteutus";

                    if (ticketRequired && !watch("issue") && !descriptionValue) {
                      return t("entryDialog.validation.ticketOrDescriptionRequired");
                    }

                    const descriptionRequired = activity === "Sisäiset palaverit ja tapahtumat";

                    if (descriptionRequired && !descriptionValue) {
                      return t("entryDialog.validation.descriptionRequired");
                    }

                    return true;
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("entryDialog.description")}
                    error={!!form.formState.errors.description}
                    helperText={form.formState.errors.description?.message}
                    fullWidth
                  />
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
        {editEntry?.acceptanceStatus === AcceptanceStatus.Open && (
          <Grid item xs={12}>
            <Alert severity="warning">{t("entryDialog.openStatusNote")}</Alert>
          </Grid>
        )}
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
