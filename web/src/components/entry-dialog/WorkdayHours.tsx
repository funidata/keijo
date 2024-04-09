import { useQuery } from "@apollo/client";
import { Box, Chip, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { roundToFullMinutes, totalDurationOfEntries } from "../../common/duration";
import { FindWorkdaysDocument } from "../../graphql/generated/graphql";

type WorkdayHoursProps = {
  date: Dayjs;
};

const WorkdayHours = ({ date }: WorkdayHoursProps) => {
  const { t } = useTranslation();
  const queryDate = date.format("YYYY-MM-DD");
  const { data } = useQuery(FindWorkdaysDocument, {
    variables: { start: queryDate, end: queryDate },
  });

  const totalDuration = totalDurationOfEntries(
    data?.findWorkdays.length === 1 ? data.findWorkdays[0].entries : [],
  );
  const totalHoursFormatted = roundToFullMinutes(totalDuration).format("H:mm");

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Typography>{t("entryDialog.totalHoursToday")}:</Typography>
      <Chip label={`${totalHoursFormatted} h`} />
    </Box>
  );
};

export default WorkdayHours;
