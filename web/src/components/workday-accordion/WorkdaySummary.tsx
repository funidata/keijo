import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionSummary, Box, Chip, Typography } from "@mui/material";
import { sum } from "lodash";
import { useTranslation } from "react-i18next";
import { roundToFullMinutes } from "../../common/duration";
import { isHoliday } from "../../common/isHoliday";
import useDayjs from "../../common/useDayjs";
import { Workday } from "../../graphql/generated/graphql";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdaySummary = ({ workday }: WorkdayAccordionProps) => {
  const { t } = useTranslation();
  const dayjs = useDayjs();
  const date = dayjs(workday.date).locale(dayjs.locale());
  const holiday = isHoliday(date);

  const totalHours = sum(workday.entries.map((wd) => wd.duration));
  const totalDuration = dayjs.duration(totalHours, "hour");
  const totalHoursFormatted = roundToFullMinutes(totalDuration).format("H:mm");

  const empty = workday.entries.length === 0;

  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ textTransform: "capitalize" }}>{date.format("dd l")}</Typography>
        {holiday && (
          <Chip
            label={t("entryTable.holiday")}
            variant="filled"
            sx={{
              color: "inherit",
              fontWeight: 500,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.light,
            }}
          />
        )}
        {!holiday && empty && (
          <Chip
            label={t("entryTable.noEntries")}
            variant="outlined"
            style={{ color: "inherit", fontStyle: "italic" }}
          />
        )}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <EntryDialogButton date={date} size="medium" />
          <Chip label={`${totalHoursFormatted} h`} sx={{ mr: 2, color: "inherit" }} />
        </Box>
      </Box>
    </AccordionSummary>
  );
};

export default WorkdaySummary;
