import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import dayjs from "../../common/dayjs";
import useWorkdayBrowser from "./useWorkdayBrowser";

const DateControl = () => {
  const { start, end, setStart, setEnd } = useWorkdayBrowser();

  const handleStartChange = (val: Dayjs | null) => {
    const date = dayjs(val);
    if (date.isValid()) {
      setStart(date);
    }
  };

  const handleEndChange = (val: Dayjs | null) => {
    const date = dayjs(val);
    if (date.isValid()) {
      setEnd(date);
    }
  };

  return (
    <Box>
      <DatePicker value={start} onChange={handleStartChange} />
      <DatePicker value={end} onChange={handleEndChange} />
    </Box>
  );
};

export default DateControl;
