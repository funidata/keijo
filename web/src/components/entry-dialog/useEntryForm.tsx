import { useLazyQuery, useMutation } from "@apollo/client";
import { Dayjs } from "dayjs";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useDayjs from "../../common/useDayjs";
import {
  AddWorkdayEntryDocument,
  Entry,
  FindWorkdaysDocument,
  GetMySettingsDocument,
  ReplaceWorkdayEntryDocument,
} from "../../graphql/generated/graphql";
import { useNotification } from "../global-notification/useNotification";
import useFormSetRemainingHours from "./useFormSetRemainingHours";

export type EntryFormSchema = {
  date: Dayjs;
  duration: string;
  description: string;
  product: string;
  activity: string;
  issue: string | null;
  client: string;
};

export type useEntryProps = {
  editEntry?: Entry;
  date?: Dayjs;
  template?: Entry;
};

/**
 * Encapsulation of entry form logic to keep layout component clean.
 *
 * Note that calling this hook will create a new RHF form instance, i.e., you must pass down
 * the actual instance from parent components rather than call this hook again in child components.
 */
const useEntryForm = ({ editEntry, date, template }: useEntryProps) => {
  const { t } = useTranslation();
  const { showSuccessNotification } = useNotification();
  const dayjs = useDayjs();

  const [addWorkdayEntryMutation, { loading: addQueryLoading, client }] = useMutation(
    AddWorkdayEntryDocument,
    {
      refetchQueries: [FindWorkdaysDocument],
      onCompleted: async () => {
        await client.resetStore();
        showSuccessNotification(t("notifications.addEntry.success"));
      },
    },
  );

  const [replaceWorkdayEntryMutation, { loading: replaceMutationLoading }] = useMutation(
    ReplaceWorkdayEntryDocument,
    {
      refetchQueries: [FindWorkdaysDocument],
      notifyOnNetworkStatusChange: true,
      onCompleted: async () => {
        await client.resetStore();
        showSuccessNotification(t("notifications.editEntry.success"));
      },
    },
  );

  const [getMySettings] = useLazyQuery(GetMySettingsDocument);
  const getDefaultValues = async (): Promise<EntryFormSchema> => {
    const { data: settingsData } = await getMySettings();

    return {
      date: date ? dayjs(date) : dayjs(),
      duration: editEntry?.duration.toString() || template?.duration.toString() || "",
      description: editEntry?.description || template?.description || "",
      product:
        editEntry?.product || template?.product || settingsData?.getMySettings.productPreset || "",
      activity:
        editEntry?.activity ||
        template?.activity ||
        settingsData?.getMySettings.activityPreset ||
        "",
      issue: editEntry?.issue || template?.issue || null,
      client: editEntry?.client || template?.client || "",
    };
  };

  const form = useForm<EntryFormSchema>({
    defaultValues: getDefaultValues,
  });

  const { loading: hoursLoading } = useFormSetRemainingHours({
    form,
    isEnabled: editEntry === undefined && template === undefined && !form.formState.isLoading,
  });

  const addWorkday: SubmitHandler<EntryFormSchema> = async (formValues) => {
    const { date, duration, description, product, activity, issue, client } = formValues;

    await addWorkdayEntryMutation({
      variables: {
        entry: {
          date: date.format("YYYY-MM-DD"),
          duration: Number(duration),
          description,
          product,
          activity,
          issue,
          client,
        },
      },
    });
  };

  const editWorkday: SubmitHandler<EntryFormSchema> = async (formValues) => {
    const { date: newDate, duration, description, product, activity, issue, client } = formValues;

    if (!editEntry) {
      throw new Error("Original entry not given.");
    }

    await replaceWorkdayEntryMutation({
      variables: {
        originalEntry: { key: editEntry.key, date: date?.format("YYYY-MM-DD") },
        replacementEntry: {
          date: newDate.format("YYYY-MM-DD"),
          duration: Number(duration),
          description,
          product,
          activity,
          issue,
          client,
        },
      },
    });
  };

  const onSubmit: SubmitHandler<EntryFormSchema> = async (formValues) => {
    if (editEntry) {
      await editWorkday(formValues);
    } else {
      await addWorkday(formValues);
    }
  };

  const loading = addQueryLoading || replaceMutationLoading || hoursLoading;

  return { form, onSubmit, loading };
};

export default useEntryForm;
