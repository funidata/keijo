import { Box } from "@mui/material";
import { DateRange, DateRangePicker } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import useWorkdayBrowser from "./useWorkdayBrowser";

const DateControl = () => {
  const { t } = useTranslation();
  const { start, end, setStart, setEnd } = useWorkdayBrowser();

  const handleChange = ([newStart, newEnd]: DateRange<Dayjs>) => {
    if (newStart && newEnd) {
      setStart(newStart);
      setEnd(newEnd);
    }
  };

  return (
    <Box>
      <DateRangePicker
        value={[start, end]}
        localeText={{ start: t("controls.startDate"), end: t("controls.endDate") }}
        onChange={handleChange}
      />
    </Box>
  );
};

export default DateControl;
