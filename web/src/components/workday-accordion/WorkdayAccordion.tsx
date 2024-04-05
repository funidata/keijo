import { Accordion, AccordionDetails, Box } from "@mui/material";
import { SyntheticEvent } from "react";
import useDayjs from "../../common/useDayjs";
import { Workday } from "../../graphql/generated/graphql";
import EntryFlexRow from "./EntryFlexRow";
import WorkdaySummary from "./WorkdaySummary";
import useWorkdayAccordionState from "./useWorkdayAccordionState";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdayAccordion = ({ workday }: WorkdayAccordionProps) => {
  const dayjs = useDayjs();
  const date = dayjs(workday.date).locale(dayjs.locale());
  const { expanded, setExpanded } = useWorkdayAccordionState(date);

  const empty = workday.entries.length === 0;

  const toggleAccordion = (_: SyntheticEvent, expd: boolean) => {
    if (empty) {
      return;
    }
    setExpanded(expd);
  };

  return (
    <Accordion disableGutters expanded={empty ? false : expanded} onChange={toggleAccordion}>
      <WorkdaySummary workday={workday} />
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {workday.entries.map((entry) => (
            <EntryFlexRow entry={entry} date={date} key={entry.key} />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default WorkdayAccordion;
