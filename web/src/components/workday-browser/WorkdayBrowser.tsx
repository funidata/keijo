import { useQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import { FindWorkdaysDocument } from "../../graphql/generated/graphql";
import WorkdayAccordion from "../workday-accordion/WorkdayAccordion";
import ListControls from "./ListControls";
import useWorkdayBrowser from "./useWorkdayBrowser";

const WorkdayBrowser = () => {
  const { start, end } = useWorkdayBrowser();
  const { data } = useQuery(FindWorkdaysDocument, { variables: { start, end } });

  if (!data) {
    return null;
  }

  return (
    <>
      <ListControls />
      <Paper>
        {data.findWorkdays.map((wd) => (
          <WorkdayAccordion workday={wd} key={wd.date} />
        ))}
      </Paper>
    </>
  );
};

export default WorkdayBrowser;
