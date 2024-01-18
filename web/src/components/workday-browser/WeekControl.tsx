import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ErrorIcon from "@mui/icons-material/Error";
import { Box, Chip, FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import useWorkdayBrowser from "./useWorkdayBrowser";

// TODO: Acually implement this.

const WeekControl = () => {
  const { start } = useWorkdayBrowser();
  const currentWeek = start.week();
  console.log(currentWeek);

  console.log(dayjs().week(0).week());

  return (
    <Box>
      <Box>
        <Chip label="Not implemented, use Browse by Date." color="error" icon={<ErrorIcon />} />
      </Box>
      <IconButton disabled>
        <ArrowBackIcon />
      </IconButton>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age" disabled>
          <MenuItem value={10}>52</MenuItem>
          <MenuItem value={20}>1</MenuItem>
          <MenuItem value={30}>2</MenuItem>
        </Select>
      </FormControl>
      <IconButton disabled>
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
};

export default WeekControl;
