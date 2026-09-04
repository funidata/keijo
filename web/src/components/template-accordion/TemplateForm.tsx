import { Box, Button, Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AddEntryTemplateDocument,
  EntryTemplateType,
  GetMySettingsDocument,
  ReplaceEntryTemplateDocument,
} from "../../graphql/generated/graphql";

import { useIsJiraAuthenticated } from "../../jira/jira-api";
import JiraIssueComboBox from "../entry-dialog/JiraIssueComboBox";
import DimensionComboBox from "../entry-dialog/DimensionComboBox";
import DurationSlider from "../entry-dialog/DurationSlider";
import { EntryFormSchema } from "../entry-form/useEntryForm";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useNotification } from "../global-notification/useNotification";

type LocationState = {
  editTemplate?: EntryTemplateType;
};

type TemplateFormSchema = {
  templateName: string;
} & Omit<EntryFormSchema, "date">;

const TemplateForm = () => {
  const { state } = useLocation();
  const { editTemplate }: LocationState = state || {};

  const { t } = useTranslation();
  const { showSuccessNotification } = useNotification();

  const [addEntryTemplate, { loading: addLoading }] = useMutation(AddEntryTemplateDocument, {
    refetchQueries: [GetMySettingsDocument],
    awaitRefetchQueries: true,
    onCompleted: () => {
      showSuccessNotification(t("notifications.addTemplate.success"));
    },
  });

  const [replaceEntryTemplate, { loading: replaceLoading }] = useMutation(
    ReplaceEntryTemplateDocument,
    {
      refetchQueries: [GetMySettingsDocument],
      awaitRefetchQueries: true,
      onCompleted: () => {
        showSuccessNotification(t("notifications.editTemplate.success"));
      },
    },
  );

  const [getMySettings] = useLazyQuery(GetMySettingsDocument);

  const getCreateDefaultValues = async (): Promise<TemplateFormSchema> => {
    const { data: settingsData } = await getMySettings().catch((e: unknown) => {
      const isAbortError =
        (e instanceof DOMException || e instanceof Error) && e.name === "AbortError";
      if (!isAbortError) throw e;
      return { data: undefined };
    });

    return {
      templateName: "",
      duration: "",
      description: "",
      product: settingsData?.getMySettings.productPreset || "",
      activity: settingsData?.getMySettings.activityPreset || "",
      issue: null,
      client: "",
    };
  };

  const form = useForm<TemplateFormSchema>({
    defaultValues: editTemplate
      ? {
          templateName: editTemplate.templateName,
          duration: editTemplate.duration.toString(),
          description: editTemplate.description || "",
          product: editTemplate.product || "",
          activity: editTemplate.activity || "",
          issue: editTemplate.issue || null,
          client: editTemplate.client || "",
        }
      : getCreateDefaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  const onSubmit: SubmitHandler<TemplateFormSchema> = async (formValues) => {
    if (editTemplate) {
      await replaceEntryTemplate({
        variables: {
          input: {
            key: editTemplate.key,
            template: { ...formValues, duration: Number(formValues.duration) },
          },
        },
      });
    } else {
      await addEntryTemplate({
        variables: { template: { ...formValues, duration: Number(formValues.duration) } },
      });
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      navigate("..");
    }
  }, [isSubmitSuccessful, navigate, reset]);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { control, watch } = form;
  const { isJiraAuth } = useIsJiraAuthenticated();
  const loading = addLoading || replaceLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller
            name="templateName"
            control={control}
            rules={{
              validate: (templateNameValue) => {
                if (typeof templateNameValue == "string" && templateNameValue.trim().length > 0) {
                  return true;
                }
                return t("entryDialog.validation.templateNameRequired");
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label={t("entryDialog.templateName")}
                error={!!form.formState.errors.templateName}
                helperText={form.formState.errors.templateName?.message}
                fullWidth
                sx={{ mb: 3 }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
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
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="duration"
            control={control}
            render={({ field }) => <DurationSlider field={field} />}
          />
        </Grid>

        {mobile ? (
          <>
            <Grid size={12} sx={{ mt: 2 }}>
              <Button loading={loading} type="submit" variant="contained" size="large" fullWidth>
                {t("entryDialog.submit")}
              </Button>
            </Grid>
            <Grid size={12}>
              <Button
                type="reset"
                variant="outlined"
                size="large"
                onClick={() => reset()}
                fullWidth
              >
                {editTemplate ? t("entryDialog.reset") : t("entryDialog.clear")}
              </Button>
            </Grid>
          </>
        ) : (
          <Grid size={12} sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
              <Button type="reset" variant="outlined" size="large" onClick={() => reset()}>
                {editTemplate ? t("entryDialog.reset") : t("entryDialog.clear")}
              </Button>
              <Button loading={loading} type="submit" variant="contained" size="large">
                {t("entryDialog.submit")}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default TemplateForm;
