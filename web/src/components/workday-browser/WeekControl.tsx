import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Typography,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { range } from "lodash";
import dayjs from "../../common/dayjs";
import useWorkdayBrowser from "./useWorkdayBrowser";

const WeekControl = () => {
  const { start, setStart, setEnd } = useWorkdayBrowser();
  const selectedValue = start.week().toString();

  // Current (NOT selected!) week serves as middle point for dropdown options.
  const currentWeek = dayjs().week();
  const weeks = range(currentWeek - 5, currentWeek + 5).map((weekIndex) => ({
    no: dayjs().week(weekIndex).week(),
    // Note: Calculating start date from the index guarantees correct dates even when the year changes.
    start: dayjs().week(weekIndex).weekday(0),
  }));

  const selectWeek = (start: Dayjs) => {
    setStart(start);
    setEnd(start.add(6, "day"));
  };

  const handleChange = (event: SelectChangeEvent) => {
    const value = Number(event.target.value);
    const start = weeks.find((week) => week.no === value)?.start || dayjs();
    selectWeek(start);
  };

  const goToPreviousWeek = () => selectWeek(start.subtract(7, "day"));
  const goToNextWeek = () => selectWeek(start.add(7, "day"));

  const iconButtonSx: SxProps = { borderRadius: 1, pl: 2, pr: 2 };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
      <IconButton sx={iconButtonSx} onClick={goToPreviousWeek}>
        <ArrowBackIcon />
      </IconButton>
      <FormControl sx={{ minWidth: 100 }}>
        <InputLabel id="demo-simple-select-label">Week</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Week"
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
      <IconButton sx={iconButtonSx} onClick={goToNextWeek}>
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
};

export default WeekControl;
