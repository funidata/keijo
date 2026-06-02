import { Box } from "@mui/material";
import { DateRange, DateRangePicker } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { useWorkdayBrowserParams } from "./useWorkdayBrowserParams";

const DateControl = () => {
  const { t } = useTranslation();
  const { goToRange, from, to } = useWorkdayBrowserParams();

  const handleChange = ([newStart, newEnd]: DateRange<Dayjs>) => {
    if (newStart && newEnd) {
      goToRange(newStart, newEnd);
    }
  };

  return (
    <Box>
      <DateRangePicker value={[from, to]} label={t("controls.dateRange")} onChange={handleChange} />
    </Box>
  );
};

export default DateControl;
