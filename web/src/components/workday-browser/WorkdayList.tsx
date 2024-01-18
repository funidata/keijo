import { useQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import { FindWorkdaysDocument } from "../../graphql/generated/graphql";
import WorkdayAccordion from "../workday-accordion/WorkdayAccordion";
import useWorkdayBrowser from "./useWorkdayBrowser";

const WorkdayList = () => {
  const { start, end } = useWorkdayBrowser();
  const { data } = useQuery(FindWorkdaysDocument, { variables: { start, end } });

  if (!data) {
    return null;
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
