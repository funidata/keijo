import { useMutation } from "@apollo/client";
import { Dayjs } from "dayjs";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "../../common/dayjs";
import {
  AddWorkdayEntryDocument,
  Entry,
  FindWorkdaysDocument,
  ReplaceWorkdayEntryDocument,
} from "../../graphql/generated/graphql";
import { useNotification } from "../global-notification/useNotification";
import { useMemo } from "react";
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
};

/**
 * Encapsulation of entry form logic to keep layout component clean.
 *
 * Note that calling this hook will create a new RHF form instance, i.e., you must pass down
 * the actual instance from parent components rather than call this hook again in child components.
 */
const useEntryForm = ({ editEntry, date }: useEntryProps) => {
  const { t } = useTranslation();
  const { showSuccessNotification } = useNotification();

  const [addWorkdayEntryMutation, { loading: addQueryLoading }] = useMutation(
    AddWorkdayEntryDocument,
    {
      refetchQueries: [FindWorkdaysDocument],
      onCompleted: () => {
        showSuccessNotification(t("notifications.addEntry.success"));
      },
    },
  );

  const [replaceWorkdayEntryMutation, { loading: replaceMutationLoading }] = useMutation(
    ReplaceWorkdayEntryDocument,
    {
      refetchQueries: [FindWorkdaysDocument],
      notifyOnNetworkStatusChange: true,
      onCompleted: () => {
        showSuccessNotification(t("notifications.editEntry.success"));
      },
    },
  );

  const defaultValues: EntryFormSchema = useMemo(
    () => ({
      date: date ? dayjs(date) : dayjs(),
      duration: editEntry?.duration.toString() || "",
      description: editEntry?.description || "",
      product: editEntry?.product || "",
      activity: editEntry?.activity || "",
      issue: editEntry?.issue || null,
      client: editEntry?.client || "",
    }),
    [date, editEntry],
  );

  const form = useForm<EntryFormSchema>({ defaultValues });

  const { loading: hoursLoading } = useFormSetRemainingHours({
    form,
    isEnabled: editEntry === undefined,
    defaultValues,
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
