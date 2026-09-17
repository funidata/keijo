import HolidayPayLeaveChip from "./HolidayPayLeaveChip";
import FlexLeaveChip from "./FlexLeaveChip";
import HolidayChip from "./HolidayChip";
import NoEntriesChip from "./NoEntriesChip";
import SickLeaveChip from "./SickLeaveChip";
import VacationChip from "./VacationChip";
import WeekendChip from "./WeekendChip";
import {
  isFlexLeaveDay,
  isHoliday,
  isHolidayPayLeave,
  isSickLeave,
  isVacation,
  isWeekend,
} from "../../../common/workdayUtils";
import type { Dayjs } from "dayjs";
import { Workday } from "../../../graphql/generated/graphql";

export default function InfoChip({ workday, date }: { workday: Workday; date: Dayjs }) {
  const holiday = isHoliday(date);
  const weekend = isWeekend(date);
  const vacation = isVacation(workday);
  const flexLeave = isFlexLeaveDay(workday);
  const holidayPayLeave = isHolidayPayLeave(workday);
  const sickLeave = isSickLeave(workday);

  const empty = workday.entries.length === 0;

  if (vacation) {
    return <VacationChip />;
  }
  if (flexLeave) {
    return <FlexLeaveChip />;
  }
  if (holidayPayLeave) {
    return <HolidayPayLeaveChip />;
  }
  if (sickLeave) {
    return <SickLeaveChip />;
  }
  if (weekend) {
    return <WeekendChip />;
  }
  if (holiday) {
    return <HolidayChip />;
  }
  if (empty) {
    return <NoEntriesChip sx={{ borderColor: "grey.400" }} />;
  }
  return null;
}
