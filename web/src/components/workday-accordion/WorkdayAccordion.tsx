import { Accordion, AccordionDetails, List } from "@mui/material";
import { SyntheticEvent } from "react";
import useDayjs from "../../common/useDayjs";
import {
  hasOnlyFlexLeaveEntry,
  isHoliday,
  isSpecialSingleEntryDay,
  isWeekend,
} from "../../common/workdayUtils";
import { EntryType } from "../../common/entryType.enum";
import { Workday } from "../../graphql/generated/graphql";
import WorkdaySummary from "./WorkdaySummary";
import EntryRow from "./entry-row/EntryRow";
import useWorkdayAccordionState from "./useWorkdayAccordionState";
import AddZeroEntryAlert from "./workday-alert/AddZeroEntryAlert";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdayAccordion = ({ workday }: WorkdayAccordionProps) => {
  const dayjs = useDayjs();
  const date = dayjs(workday.date).locale(dayjs.locale());
  const holiday = isHoliday(date);
  const weekend = isWeekend(date);

  // The HR system may auto-insert flex leave entries on weekends/holidays when a flex leave spans over those days.
  // These are not real flex leave days, so they are filtered out to avoid misleading display and zero-entry prompts.
  const isWeekendOrHoliday = weekend || holiday;
  const effectiveEntries = isWeekendOrHoliday
    ? workday.entries.filter((entry) => entry.ratioNumber !== EntryType.FlexLeave)
    : workday.entries;
  const effectiveWorkday = { ...workday, entries: effectiveEntries };

  const disabled = isSpecialSingleEntryDay(effectiveWorkday);
  const onlyFlexLeaveEntry = hasOnlyFlexLeaveEntry(effectiveWorkday);

  const { expanded: preferExpanded, setExpanded } = useWorkdayAccordionState(date);
  const empty = effectiveWorkday.entries.length === 0;
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
      <WorkdaySummary workday={effectiveWorkday} />
      <AccordionDetails>
        <List sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 0, pb: 0 }}>
          {effectiveWorkday.entries.map((entry) => (
            <EntryRow entry={entry} date={date} key={entry.key} />
          ))}
          {onlyFlexLeaveEntry && <AddZeroEntryAlert date={date} />}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default WorkdayAccordion;
