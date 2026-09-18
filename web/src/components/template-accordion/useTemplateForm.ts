import { useLazyQuery, useMutation } from "@apollo/client/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AddEntryTemplateDocument,
  EntryTemplateType,
  GetMySettingsDocument,
  ReplaceEntryTemplateDocument,
} from "../../graphql/generated/graphql";
import { useNotification } from "../global-notification/useNotification";
import { EntryFormSchema } from "../entry-form/useEntryForm";

export type TemplateFormSchema = {
  templateName: string;
} & Omit<EntryFormSchema, "date">;

export type UseTemplateFormProps = {
  editTemplate?: EntryTemplateType;
};

const useTemplateForm = ({ editTemplate }: UseTemplateFormProps) => {
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

  return { form, onSubmit, loading: addLoading || replaceLoading };
};

export default useTemplateForm;
