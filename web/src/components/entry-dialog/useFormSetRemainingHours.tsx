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
};

const useFormSetRemainingHours = ({ form, isEnabled }: useFormRemainingHoursProps) => {
  const { userPrefersSetRemainingHours } = usePreferSetRemainingHours();
  const { getValues, resetField, setValue, getFieldState } = form;
  const formInputDate = dayjs(getValues("date")).locale(dayjs.locale());
  const queryDate = formInputDate.format("YYYY-MM-DD");
  const { data, loading: wdLoading } = useQuery(FindWorkdaysDocument, {
    variables: { start: queryDate, end: queryDate },
  });

  useEffect(() => {
    if (!isEnabled || getFieldState("duration").isDirty) return;
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

      resetField("duration", { defaultValue: remainingHoursFormatted });
      setValue("duration", remainingHoursFormatted);
    } else if (!userPrefersSetRemainingHours) {
      resetField("duration", { defaultValue: "0" });
      setValue("duration", "0");
    }
  }, [
    data?.findWorkdays,
    getFieldState,
    isEnabled,
    resetField,
    setValue,
    userPrefersSetRemainingHours,
    wdLoading,
  ]);

  return { loading: wdLoading };
};

export default useFormSetRemainingHours;
