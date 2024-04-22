import { Box, Chip, Typography } from "@mui/material";
import { t } from "i18next";
import { flatMap } from "lodash";
import { roundToFullMinutes, totalDurationOfEntries } from "../../common/duration";
import { Workday } from "../../graphql/generated/graphql";
import useWorkdayBrowser from "./useWorkdayBrowser";

type TotalHoursProps = {
  workdays: Workday[];
};

const TotalHours = ({ workdays }: TotalHoursProps) => {
  const { start, end } = useWorkdayBrowser();

  const entries = flatMap(workdays, (wd) => wd.entries);
  const duration = roundToFullMinutes(totalDurationOfEntries(entries));
  const totalHoursFormatted = `${duration.days() * 24 + duration.hours()}:${duration.format("mm")}`;

  const weekView = start.weekday() === 0 && end.weekday() === 6;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "end",
        gap: 2,
        mb: 2,
        color: (theme) => (theme.palette.mode === "dark" ? theme.palette.primary.main : "inherit"),
      }}
    >
      <Typography variant="button">
        {t(weekView ? "entryTable.totalHoursInWeek" : "entryTable.totalHoursInRange")}:
      </Typography>
      <Chip
        label={
          <>
            <Box component="span" sx={{ fontWeight: 500 }}>
              {totalHoursFormatted}
            </Box>{" "}
            h
          </>
        }
        sx={{ fontSize: "1.3rem", height: "auto", borderRadius: 24, p: "5px" }}
      />
    </Box>
  );
};

export default TotalHours;
