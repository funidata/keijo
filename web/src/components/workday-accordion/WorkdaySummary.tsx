import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionSummary, Box, Chip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { sum } from "lodash";
import { roundToFullMinutes } from "../../common/duration";
import useDayjs from "../../common/useDayjs";
import { isHoliday, isVacation, isWeekend } from "../../common/workdayUtils";
import { Workday } from "../../graphql/generated/graphql";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import HolidayChip from "./info-chips/HolidayChip";
import NoEntriesChip from "./info-chips/NoEntriesChip";
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

  const totalHours = sum(workday.entries.map((wd) => wd.duration));
  const totalDuration = dayjs.duration(totalHours, "hour");
  const totalHoursFormatted = roundToFullMinutes(totalDuration).format("H:mm");

  const empty = workday.entries.length === 0;

  const InfoChip = () => {
    if (vacation) {
      return <VacationChip />;
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
    <AccordionSummary expandIcon={!vacation && <ExpandMoreIcon />}>
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
            vacation ? { display: "flex", flexDirection: "row", alignItems: "center", gap: 2 } : {}
          }
        >
          <Typography sx={{ textTransform: "capitalize", minWidth: 105 }}>
            {date.format("dd l")}
          </Typography>
          {mobile && (
            <Box sx={!vacation ? { mt: 1 } : {}}>
              <InfoChip />
            </Box>
          )}
        </Box>
        {!mobile && <InfoChip />}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!vacation && (
            <>
              <EntryDialogButton date={date} size="medium" />
              <Chip label={`${totalHoursFormatted} h`} sx={{ mr: 2, color: "inherit" }} />
            </>
          )}
          {vacation && !mobile && <Box sx={{ width: 133 }} />}
        </Box>
      </Box>
    </AccordionSummary>
  );
};

export default WorkdaySummary;
