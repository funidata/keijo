import { useQuery } from "@apollo/client";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FindWorkdaysDocument } from "../../graphql/generated/graphql";
import WorkdayAccordion from "../workday-accordion/WorkdayAccordion";
import useWorkdayBrowser from "./useWorkdayBrowser";

const WorkdayList = () => {
  const { t } = useTranslation();
  const { start, end } = useWorkdayBrowser();
  const { data } = useQuery(FindWorkdaysDocument, { variables: { start, end } });

  if (!data) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="h6" fontStyle="italic">
          {t("entryTable.loading")}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      {data.findWorkdays.map((wd) => (
        <WorkdayAccordion workday={wd} key={wd.date} />
      ))}
    </Paper>
  );
};

export default WorkdayList;
