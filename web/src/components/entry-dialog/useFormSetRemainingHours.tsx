import { useQuery } from "@apollo/client";
import { Dayjs } from "dayjs";
import { UseFormReturn } from "react-hook-form";
import dayjs from "../../common/dayjs";
import { useEffect } from "react";
import { roundToFullMinutes, totalDurationOfEntries } from "../../common/duration";
import usePreferSetRemainingHours from "../user-preferences/usePreferSetRemainingHours";
import { EntryFormSchema } from "./useEntryForm";
import { Entry, FindWorkdaysDocument } from "../../graphql/generated/graphql";

export type useEntryProps = {
  editEntry?: Entry;
  date?: Dayjs;
};

type useFormRemainingHoursProps = {
  form: UseFormReturn<EntryFormSchema>;
  isEnabled: boolean;
  defaultValues: EntryFormSchema;
};

const useFormSetRemainingHours = ({
  form,
  isEnabled,
  defaultValues,
}: useFormRemainingHoursProps) => {
  const { userPrefersSetRemainingHours } = usePreferSetRemainingHours();
  const { watch, reset } = form;
  const dateWatch = dayjs(watch("date")).locale(dayjs.locale());
  const queryDate = dateWatch.format("YYYY-MM-DD");
  const { data, loading: wdLoading } = useQuery(FindWorkdaysDocument, {
    variables: { start: queryDate, end: queryDate },
  });

  useEffect(() => {
    if (!isEnabled) return;
    const defaultVals: EntryFormSchema = {
      date: defaultValues.date,
      duration: defaultValues.duration,
      description: defaultValues.description,
      product: defaultValues.product,
      activity: defaultValues.activity,
      issue: defaultValues.issue,
      client: defaultValues.client,
    };
    if (!wdLoading && userPrefersSetRemainingHours) {
      const totalDuration = totalDurationOfEntries(
        data?.findWorkdays.length === 1 ? data.findWorkdays[0].entries : [],
      );
      const workDayFullHours = dayjs.duration(7.5, "hour");
      const remainingHours =
        workDayFullHours > totalDuration
          ? workDayFullHours.subtract(totalDuration)
          : dayjs.duration(0);
      const remainingHoursFormatted = roundToFullMinutes(remainingHours).asHours().toString();
      reset({ ...defaultVals, duration: remainingHoursFormatted }, { keepDirtyValues: true });
    } else if (!userPrefersSetRemainingHours) {
      reset({ ...defaultVals, duration: "0" }, { keepDirtyValues: true });
    }
  }, [
    data?.findWorkdays,
    defaultValues.activity,
    defaultValues.client,
    defaultValues.date,
    defaultValues.description,
    defaultValues.duration,
    defaultValues.issue,
    defaultValues.product,
    isEnabled,
    reset,
    userPrefersSetRemainingHours,
    wdLoading,
  ]);

  return { loading: wdLoading };
};

export default useFormSetRemainingHours;
