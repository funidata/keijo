import { Dayjs } from "dayjs";
import holidaysRaw from "../assets/holidays.json";
import { Workday } from "../graphql/generated/graphql";
import dayjs from "./dayjs";
import { EntryType } from "./entryType.enum";

const holidays = holidaysRaw.map(dayjs);

export const isHoliday = (date: Dayjs): boolean =>
  !!holidays.find((holiday) => date.isSame(holiday, "date"));

export const isVacation = (workday: Workday): boolean => {
  if (workday.entries.length !== 1) {
    return false;
  }
  const entry = workday.entries[0];
  return entry.entryType === EntryType.Vacation;
};

export const isFlexLeaveDay = (workday: Workday): boolean => {
  if (workday.entries.length !== 1) {
    return false;
  }
  const entry = workday.entries[0];
  return entry.entryType === EntryType.FlexLeave;
};

export const isSickLeave = (workday: Workday): boolean => {
  if (workday.entries.length !== 1) {
    return false;
  }
  const entry = workday.entries[0];
  return entry.entryType === EntryType.SickLeave;
};

export const isWeekend = (date: Dayjs): boolean => date.weekday() === 5 || date.weekday() === 6;

export const isSpecialSingleEntryDay = (workday: Workday): boolean =>
  isVacation(workday) || isFlexLeaveDay(workday) || isSickLeave(workday);
