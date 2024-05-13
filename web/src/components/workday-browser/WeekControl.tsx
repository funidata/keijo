import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TodayIcon from "@mui/icons-material/Today";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { range } from "lodash";
import { useTranslation } from "react-i18next";
import useDayjs from "../../common/useDayjs";
import { useWorkdayBrowserParams } from "./useWorkdayBrowserParams";

const WeekControl = () => {
  const dayjs = useDayjs();
  const { t } = useTranslation();
  const { from, goToWeek } = useWorkdayBrowserParams();
  const selectedValue = from.week().toString();

  // Current (NOT selected!) week serves as middle point for dropdown options.
  const currentWeek = dayjs().week();
  const weeks = range(currentWeek - 5, currentWeek + 5).map((weekIndex) => ({
    no: dayjs().week(weekIndex).week(),
    // Note: Calculating start date from the index guarantees correct dates even when the year changes.
    start: dayjs().week(weekIndex).weekday(0),
  }));

  // If user navigates beyond the options list, add current selection to the list.
  if (from.isBefore(weeks[0].start, "week")) {
    weeks.unshift({
      no: from.week(),
      start: from.weekday(0),
    });
  }
  if (from.isAfter(weeks.at(-1)?.start, "week")) {
    weeks.push({
      no: from.week(),
      start: from.weekday(0),
    });
  }

  const handleChange = (event: SelectChangeEvent) => {
    const value = Number(event.target.value);
    const start = weeks.find((week) => week.no === value)?.start || dayjs();
    goToWeek(start);
  };

  const goToPreviousWeek = () => goToWeek(from.subtract(7, "day"));
  const goToNextWeek = () => goToWeek(from.add(7, "day"));
  const goToCurrentWeek = () => goToWeek(dayjs().week(currentWeek));

  const iconButtonSx: SxProps = { borderRadius: 1, pl: 2, pr: 2 };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
      <Tooltip title={t("controls.aria.prevWeek")}>
        <IconButton
          sx={iconButtonSx}
          onClick={goToPreviousWeek}
          aria-label={t("controls.aria.prevWeek")}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <FormControl sx={{ minWidth: 170 }}>
        <InputLabel id="week-control-select-label">{t("controls.selectWeek")}</InputLabel>
        <Select
          labelId="week-control-select-label"
          id="week-control-select"
          label={t("controls.selectWeek")}
          value={selectedValue}
          onChange={handleChange}
          sx={{
            [".MuiBox-root"]: {
              border: 0,
            },
          }}
        >
          {weeks.map((week) => (
            <MenuItem value={week.no} key={`week-control-menu-item-${week.no}`}>
              <Box
                sx={{
                  display: "flex",
                  borderBottom: week.no === currentWeek ? "1px solid grey" : null,
                }}
              >
                <Typography variant="h5">{week.no}</Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ alignSelf: "end", mb: "3px", ml: 1, fontStyle: "italic" }}
                >
                  ({week.start.format("l")})
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip title={t("controls.aria.nextWeek")}>
        <IconButton
          sx={iconButtonSx}
          onClick={goToNextWeek}
          aria-label={t("controls.aria.nextWeek")}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("controls.aria.currentWeek")}>
        <IconButton
          sx={iconButtonSx}
          onClick={goToCurrentWeek}
          aria-label={t("controls.aria.currentWeek")}
        >
          <TodayIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default WeekControl;
