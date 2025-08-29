import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionSummary, Box, Chip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { roundToFullMinutes, totalDurationOfEntries } from "../../common/duration";
import useDayjs from "../../common/useDayjs";
import {
  isFlexLeaveDay,
  isHoliday,
  isHolidayPayLeave,
  isParentalLeave,
  isSickLeave,
  isSpecialSingleEntryDay,
  isVacation,
  isWeekend,
} from "../../common/workdayUtils";
import { Workday } from "../../graphql/generated/graphql";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import FlexLeaveChip from "./info-chips/FlexLeaveChip";
import HolidayChip from "./info-chips/HolidayChip";
import HolidayPayLeaveChip from "./info-chips/HolidayPayLeaveChip";
import NoEntriesChip from "./info-chips/NoEntriesChip";
import ParentalLeaveChip from "./info-chips/ParentalLeaveChip";
import SickLeaveChip from "./info-chips/SickLeaveChip";
import VacationChip from "./info-chips/VacationChip";
import WeekendChip from "./info-chips/WeekendChip";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdaySummary = ({ workday }: WorkdayAccordionProps) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const dayjs = useDayjs();
  const date = dayjs(workday.date).locale(dayjs.locale());
  const holiday = isHoliday(date);
  const weekend = isWeekend(date);
  const vacation = isVacation(workday);
  const flexLeave = isFlexLeaveDay(workday);
  const holidayPayLeave = isHolidayPayLeave(workday);
  const sickLeave = isSickLeave(workday);
  const parentalLeave = isParentalLeave(workday);
  const disabled = isSpecialSingleEntryDay(workday);

  const totalDuration = totalDurationOfEntries(workday.entries);
  const totalHoursFormatted = roundToFullMinutes(totalDuration).format("H:mm");

  const empty = workday.entries.length === 0;

  const InfoChip = () => {
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
    if (parentalLeave) {
      return <ParentalLeaveChip />;
    }
    if (weekend) {
      return <WeekendChip />;
    }
    if (holiday) {
      return <HolidayChip />;
    }
    if (empty) {
      return <NoEntriesChip />;
    }
    return null;
  };

  return (
    <AccordionSummary expandIcon={!disabled && <ExpandMoreIcon />}>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={
            disabled ? { display: "flex", flexDirection: "row", alignItems: "center", gap: 2 } : {}
          }
        >
          <Typography sx={{ textTransform: "capitalize", minWidth: 105 }}>
            {date.format("dd l")}
          </Typography>
          {mobile && (
            <Box sx={!disabled ? { mt: 1 } : {}}>
              <InfoChip />
            </Box>
          )}
        </Box>
        {!mobile && <InfoChip />}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!disabled && (
            <>
              <EntryDialogButton date={date} size="medium" />
              <Chip label={`${totalHoursFormatted} h`} sx={{ mr: 2, color: "inherit" }} />
            </>
          )}
          {disabled && !mobile && <Box sx={{ width: 133 }} />}
        </Box>
      </Box>
    </AccordionSummary>
  );
};

export default WorkdaySummary;
