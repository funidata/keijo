import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import useDayjs from "../../common/useDayjs";
import { AcceptanceStatus, Entry } from "../../graphql/generated/graphql";
import usePreferSetRemainingHours from "../user-preferences/usePreferSetRemainingHours";
import BigDeleteEntryButton from "./BigDeleteEntryButton";
import DimensionComboBox from "./DimensionComboBox";
import DurationSlider from "./DurationSlider";
import ResponsiveDatePicker from "./ResponsiveDatePicker";
import WorkdayHours from "./WorkdayHours";
import useEntryForm, { EntryFormSchema } from "./useEntryForm";

export type EntryFormProps = {
  form: UseFormReturn<EntryFormSchema>;
  onSubmit: () => void;
  reset: () => void;
  editEntry?: Entry;
  originalDate?: Dayjs;
  loading?: boolean;
};

type LocationState = {
  date?: string;
  editEntry?: Entry;
};

const EntryForm = () => {
  const { state } = useLocation();
  const dayjs = useDayjs();
  // state is possibly null
  const { date: originalDate, editEntry }: LocationState = state || {};
  const { form, onSubmit, loading } = useEntryForm({ editEntry, date: dayjs(originalDate) });
  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      navigate("..");
    }
  }, [isSubmitSuccessful, navigate, reset]);

  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { userPrefersSetRemainingHours, toggleRemainingHours } = usePreferSetRemainingHours();
  const { control, watch } = form;
  const dateWatch = dayjs(watch("date")).locale(dayjs.locale());

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                    value={field.value || ""}
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
          <Box sx={{ mt: 2, mb: 3 }}>
            <WorkdayHours date={dateWatch} />
          </Box>
          {mobile ? (
            <Controller name="date" control={control} render={ResponsiveDatePicker} />
          ) : (
            <Box>
              <Accordion sx={{ border: 0 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ textTransform: "capitalize" }}
                >
                  {dateWatch.format("dddd L")}
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
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                {t("entryDialog.submit")}
              </LoadingButton>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="reset"
                variant="outlined"
                size="large"
                onClick={() => reset()}
                fullWidth
              >
                {editEntry ? t("entryDialog.reset") : t("entryDialog.clear")}
              </Button>
            </Grid>
            <Grid item xs={12}>
              {editEntry && originalDate && (
                <BigDeleteEntryButton entryKey={editEntry.key} date={dayjs(originalDate)} />
              )}
            </Grid>
            <Grid item xs={12}>
              {!editEntry && (
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        aria-label={t("entryDialog.setRemainingHours")}
                        checked={userPrefersSetRemainingHours}
                        onChange={toggleRemainingHours}
                      />
                    }
                    label={t("entryDialog.setRemainingHours")}
                  />
                </FormGroup>
              )}
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={4} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "start", gap: 2 }}>
                {!editEntry && (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          aria-label={t("entryDialog.setRemainingHours")}
                          checked={userPrefersSetRemainingHours}
                          onChange={toggleRemainingHours}
                        />
                      }
                      label={t("entryDialog.setRemainingHours")}
                    />
                  </FormGroup>
                )}
              </Box>
            </Grid>
            <Grid item xs={8} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
                <Button type="reset" variant="outlined" size="large" onClick={() => reset()}>
                  {editEntry ? t("entryDialog.reset") : t("entryDialog.clear")}
                </Button>
                <LoadingButton loading={loading} type="submit" variant="contained" size="large">
                  {t("entryDialog.submit")}
                </LoadingButton>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </form>
  );
};

export default EntryForm;
