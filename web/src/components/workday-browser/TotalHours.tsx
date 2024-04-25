import { Box, Chip, Typography } from "@mui/material";
import { t } from "i18next";
import { flatMap } from "lodash";
import { roundToFullMinutes, totalDurationOfEntries } from "../../common/duration";
import { Workday } from "../../graphql/generated/graphql";
import { useWorkdayBrowserParams } from "./useWorkdayBrowserParams";

type TotalHoursProps = {
  workdays: Workday[];
};

const TotalHours = ({ workdays }: TotalHoursProps) => {
  const { browsingMode } = useWorkdayBrowserParams();

  const entries = flatMap(workdays, (wd) => wd.entries);
  const duration = roundToFullMinutes(totalDurationOfEntries(entries));
  const totalHoursFormatted = `${duration.days() * 24 + duration.hours()}:${duration.format("mm")}`;

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
        {t(
          browsingMode === "week" ? "entryTable.totalHoursInWeek" : "entryTable.totalHoursInRange",
        )}
        :
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
