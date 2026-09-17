import { useMutation, useQuery } from "@apollo/client/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import useDayjs from "../../common/useDayjs";
import {
  AcceptanceStatus,
  Entry,
  GetMySettingsDocument,
  UpdateSettingsDocument,
} from "../../graphql/generated/graphql";
import { useIsJiraAuthenticated } from "../../jira/jira-api";
import usePreferSetRemainingHours from "../user-preferences/usePreferSetRemainingHours";
import BigDeleteEntryButton from "../entry-dialog/BigDeleteEntryButton";
import DimensionComboBox from "../entry-dialog/DimensionComboBox";
import DurationSlider from "../entry-dialog/DurationSlider";
import { JiraIntegrationAlert } from "../entry-dialog/JiraIntegrationAlert";
import JiraIssueComboBox from "../entry-dialog/JiraIssueComboBox";
import ResponsiveDatePicker from "../entry-dialog/ResponsiveDatePicker";
import WorkdayHours from "../entry-dialog/WorkdayHours";
import useEntryForm from "./useEntryForm";
import EntryFiltersSection from "../entry-dialog/EntryFiltersSection";

type LocationState = {
  date?: string;
  editEntry?: Entry;
  template?: Entry;
  templateEntries?: Entry[];
};

enum SubmitTypes {
  addMore = "addMore",
  submit = "submit",
}
type SubmitType = SubmitTypes | null;

const EntryForm = () => {
  const { state } = useLocation();
  const dayjs = useDayjs();
  // state is possibly null
  const { date: originalDate, editEntry, templateEntries }: LocationState = state || {};

  const { form, onSubmit, loading } = useEntryForm({
    editEntry,
    date: dayjs(originalDate),
    template: templateEntries && templateEntries[0],
  });
  const navigate = useNavigate();
  const submitter = useRef<SubmitType>(null);

  const {
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      const remainingEntries = templateEntries && templateEntries.slice(1);
      if (remainingEntries && remainingEntries.length > 0) {
        const nextEntry = remainingEntries[0];
        reset({
          date: dayjs(originalDate),
          duration: nextEntry.duration.toString(),
          description: nextEntry.description || "",
          product: nextEntry.product || "",
          activity: nextEntry.activity || "",
          issue: nextEntry.issue || null,
          client: nextEntry.client || "",
        });
        navigate(".", { state: { date: originalDate, templateEntries: remainingEntries } });
      } else {
        reset();
        if (submitter.current !== SubmitTypes.addMore) {
          navigate("..");
        }

        submitter.current = null;
      }
    }
  }, [dayjs, isSubmitSuccessful, navigate, originalDate, reset, templateEntries]);

  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { userPrefersSetRemainingHours, toggleRemainingHours } = usePreferSetRemainingHours();
  const { control, watch } = form;
  const dateWatch = dayjs(watch("date")).locale(dayjs.locale());
  const { isJiraAuth, isLoading } = useIsJiraAuthenticated();

  const { data } = useQuery(GetMySettingsDocument);
  const [updateSettings] = useMutation(UpdateSettingsDocument, {
    refetchQueries: [GetMySettingsDocument],
  });

  const handleAddMore = () => {
    submitter.current = SubmitTypes.addMore;
    handleSubmit(onSubmit)();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
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
            {isJiraAuth ? (
              <JiraIssueComboBox form={form} name="issue" title={t("entryDialog.issue")} />
            ) : (
              <DimensionComboBox form={form} name="issue" title={t("entryDialog.issue")} />
            )}
            <DimensionComboBox form={form} name="client" title={t("entryDialog.client")} />
            <Grid size={12}>
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
            <Grid size={12}>
              <EntryFiltersSection />
            </Grid>
            {data && !data.getMySettings.jiraNotificationIgnore && !isJiraAuth && !isLoading ? (
              <Grid>
                <JiraIntegrationAlert
                  onHide={() =>
                    updateSettings({ variables: { settings: { jiraNotificationIgnore: true } } })
                  }
                />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
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
          <Grid size={12}>
            <Alert severity="warning">{t("entryDialog.openStatusNote")}</Alert>
          </Grid>
        )}
        {editEntry && (
          <Grid size={12}>
            <Alert severity="info">{t("entryDialog.editingNote")}</Alert>
          </Grid>
        )}
        {mobile ? (
          <>
            <Grid sx={{ mt: 2 }} size={12}>
              <Button loading={loading} type="submit" variant="contained" size="large" fullWidth>
                {t("entryDialog.submit")}
              </Button>
            </Grid>
            {!editEntry && !templateEntries && (
              <Grid size={12}>
                <Button
                  loading={loading}
                  onClick={() => handleAddMore()}
                  variant="outlined"
                  size="large"
                  fullWidth
                >
                  {t("entryDialog.addMore")}
                </Button>
              </Grid>
            )}
            <Grid size={12}>
              <Button type="reset" variant="text" size="large" onClick={() => reset()} fullWidth>
                {editEntry ? t("entryDialog.reset") : t("entryDialog.clear")}
              </Button>
            </Grid>
            <Grid size={12}>
              {editEntry && originalDate && (
                <BigDeleteEntryButton
                  entryKey={editEntry.key}
                  date={dayjs(originalDate)}
                  onDeleted={() => navigate("..")}
                />
              )}
            </Grid>
            <Grid size={12}>
              {!editEntry && !templateEntries && (
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
            <Grid sx={{ mt: 2 }} size={4}>
              <Box sx={{ display: "flex", justifyContent: "start", gap: 2 }}>
                {!editEntry && !templateEntries && (
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
            <Grid sx={{ mt: 2 }} size={8}>
              <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
                <Button type="reset" variant="text" size="large" onClick={() => reset()}>
                  {editEntry ? t("entryDialog.reset") : t("entryDialog.clear")}
                </Button>
                {!editEntry && !templateEntries && (
                  <Button
                    loading={loading}
                    onClick={() => handleAddMore()}
                    variant="outlined"
                    size="large"
                  >
                    {t("entryDialog.addMore")}
                  </Button>
                )}
                <Button loading={loading} type="submit" variant="contained" size="large">
                  {t("entryDialog.submit")}
                </Button>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </form>
  );
};

export default EntryForm;
