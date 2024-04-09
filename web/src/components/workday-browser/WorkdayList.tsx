import { useQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import { range } from "lodash";
import useDayjs from "../../common/useDayjs";
import { FindWorkdaysDocument } from "../../graphql/generated/graphql";
import WorkdayAccordion from "../workday-accordion/WorkdayAccordion";
import LoadingIndicator from "./LoadingIndicator";
import TotalHours from "./TotalHours";
import useWorkdayBrowser from "./useWorkdayBrowser";

const WorkdayList = () => {
  const dayjs = useDayjs();
  const { start, end } = useWorkdayBrowser();

  const { data } = useQuery(FindWorkdaysDocument, {
    variables: { start: start.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD") },
    // Poll every 5 minutes, mainly to keep IDP session alive.
    pollInterval: 5 * 60 * 1000,
  });

  if (!data) {
    return <LoadingIndicator />;
  }

  const normalizedStart = start.hour(0).minute(0).second(0).millisecond(0);
  const normalizedEnd = end.hour(0).minute(0).second(0).millisecond(0);

  // Construct requested date range to include days without entries.
  const workdays = range(normalizedEnd.diff(normalizedStart, "day") + 1).map((i) => {
    const date = normalizedStart.add(i, "day");
    return {
      date,
      entries: data.findWorkdays.find((wd) => date.isSame(dayjs(wd.date), "day"))?.entries || [],
    };
  });

  return (
    <>
      <TotalHours workdays={workdays} />
      <Paper>
        {workdays.map((wd) => (
          <WorkdayAccordion workday={wd} key={wd.date.toString()} />
        ))}
      </Paper>
    </>
  );
};

export default WorkdayList;
