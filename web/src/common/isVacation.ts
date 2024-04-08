import { Workday } from "../graphql/generated/graphql";
import { EntryType } from "./entryType.enum";

export const isVacation = (workday: Workday): boolean => {
  if (workday.entries.length !== 1) {
    return false;
  }

  const entry = workday.entries[0];
  return entry.entryType === EntryType.Vacation;
};
