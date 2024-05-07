import { Accordion, AccordionDetails, Box } from "@mui/material";
import { SyntheticEvent } from "react";
import useDayjs from "../../common/useDayjs";
import {
  hasOnlyFlexLeaveEntry,
  isHoliday,
  isSpecialSingleEntryDay,
  isWeekend,
} from "../../common/workdayUtils";
import { Workday } from "../../graphql/generated/graphql";
import WorkdaySummary from "./WorkdaySummary";
import EntryRow from "./entry-row/EntryRow";
import useWorkdayAccordionState from "./useWorkdayAccordionState";

import ZeroEntryAlert from "./workday-alert/ZeroEntryAlert";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdayAccordion = ({ workday }: WorkdayAccordionProps) => {
  const dayjs = useDayjs();
  const date = dayjs(workday.date).locale(dayjs.locale());
  const holiday = isHoliday(date);
  const weekend = isWeekend(date);
  const disabled = isSpecialSingleEntryDay(workday);
  const onlyFlexLeaveEntry = hasOnlyFlexLeaveEntry(workday);

  const { expanded: preferExpanded, setExpanded } = useWorkdayAccordionState(date);
  const empty = workday.entries.length === 0;
  const expanded = empty || disabled ? false : preferExpanded;

  const toggleAccordion = (_: SyntheticEvent, expd: boolean) => {
    if (empty || disabled) {
      return;
    }
    setExpanded(expd);
  };

  return (
    <Accordion
      disableGutters
      expanded={expanded}
      onChange={toggleAccordion}
      sx={{
        bgcolor: (theme) => {
          if (holiday || weekend || disabled) {
            return theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[300];
          }
          return "";
        },
        borderTop: expanded ? "1px solid" : "",
        borderColor: "rgba(255, 255, 255, 0.12)",
        "&:first-of-type": {
          border: "none",
        },
      }}
    >
      <WorkdaySummary workday={workday} />
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {workday.entries.map((entry) => (
            <EntryRow entry={entry} date={date} key={entry.key} />
          ))}
          {onlyFlexLeaveEntry ? <ZeroEntryAlert date={date} /> : null}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default WorkdayAccordion;
