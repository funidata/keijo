import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionSummary, Box, Chip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { roundToFullMinutes, totalDurationOfEntries } from "../../common/duration";
import useDayjs from "../../common/useDayjs";
import {
  isFlexLeaveDay,
  isHoliday,
  isHolidayPayLeave,
  isSickLeave,
  isSpecialSingleEntryDay,
  isVacation,
  isWeekend,
} from "../../common/workdayUtils";
import { Workday } from "../../graphql/generated/graphql";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import FlexLeaveChip from "./info-chips/FlexLeaveChip";
import HolidayChip from "./info-chips/HolidayChip";
import NoEntriesChip from "./info-chips/NoEntriesChip";
import SickLeaveChip from "./info-chips/SickLeaveChip";
import VacationChip from "./info-chips/VacationChip";
import WeekendChip from "./info-chips/WeekendChip";
import HolidayPayLeaveChip from "./info-chips/HolidayPayLeaveChip";
import { useTranslation } from "react-i18next";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdaySummary = ({ workday }: WorkdayAccordionProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const dayjs = useDayjs();
  const date = dayjs(workday.date).locale(dayjs.locale());
  const isCurrentDay = date.isSame(dayjs(), "day");
  const holiday = isHoliday(date);
  const weekend = isWeekend(date);
  const vacation = isVacation(workday);
  const flexLeave = isFlexLeaveDay(workday);
  const holidayPayLeave = isHolidayPayLeave(workday);
  const sickLeave = isSickLeave(workday);
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
  };

  return (
    <Box sx={{ position: "relative" }}>
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
              disabled
                ? { display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }
                : {}
            }
          >
            <Typography
              sx={{
                textTransform: "capitalize",
                position: "relative",
                minWidth: 105,
                ...(isCurrentDay && { fontWeight: "medium" }),
              }}
              aria-current={isCurrentDay ? "date" : undefined}
            >
              {date.format("dd l")}
              <Typography component="span" sx={{ position: "absolute", paddingLeft: 1 }}>
                {isCurrentDay && !mobile && `(${t("general.today")})`}
              </Typography>
            </Typography>
            {mobile && (
              <Box sx={!disabled ? { mt: 1 } : {}}>
                <InfoChip />
              </Box>
            )}
          </Box>
          {!mobile && <InfoChip />}
          {!disabled && (
            <Chip
              label={`${totalHoursFormatted} h`}
              sx={{
                mr: 2,
                color: "inherit",
                ...(isCurrentDay && { fontWeight: "medium" }),
              }}
            />
          )}
          {disabled && !mobile && <Box sx={{ width: 133 }} />}
        </Box>
      </AccordionSummary>
      {!disabled && (
        <Box
          sx={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "116px" }}
        >
          <EntryDialogButton date={date} size="medium" />
        </Box>
      )}
    </Box>
  );
};

export default WorkdaySummary;
