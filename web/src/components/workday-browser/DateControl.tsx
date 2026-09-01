import { Box } from "@mui/material";
import { DateRange, DateRangePicker } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { useWorkdayBrowserParams } from "./useWorkdayBrowserParams";

export default function DateControl({ target = "range" }: { target?: "range" | "overview" }) {
  const { t } = useTranslation();
  const { goToRange, goToOverview, from, to } = useWorkdayBrowserParams();

  const handleChange = ([newStart, newEnd]: DateRange<Dayjs>) => {
    if (newStart && newEnd) {
      if (target === "overview") {
        goToOverview(newStart, newEnd);
        return;
      }

      goToRange(newStart, newEnd);
    }
  };

  return (
    <Box>
      <DateRangePicker value={[from, to]} label={t("controls.dateRange")} onChange={handleChange} />
    </Box>
  );
}
