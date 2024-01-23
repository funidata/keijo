import { useQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import { FindWorkdaysDocument } from "../../graphql/generated/graphql";
import WorkdayAccordion from "../workday-accordion/WorkdayAccordion";
import LoadingIndicator from "./LoadingIndicator";
import useWorkdayBrowser from "./useWorkdayBrowser";

const WorkdayList = () => {
  const { start, end } = useWorkdayBrowser();

  const { data } = useQuery(FindWorkdaysDocument, {
    variables: { start: start.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD") },
  });

  if (!data) {
    return <LoadingIndicator />;
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
