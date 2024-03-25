import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Typography,
} from "@mui/material";
import { sum } from "lodash";
import { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import useDayjs from "../../common/useDayjs";
import { Workday } from "../../graphql/generated/graphql";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import EntryFlexRow from "./EntryFlexRow";
import useWorkdayAccordionState from "./useWorkdayAccordionState";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdayAccordion = ({ workday }: WorkdayAccordionProps) => {
  const { t } = useTranslation();
  const dayjs = useDayjs();
  const date = dayjs(workday.date);
  const { expanded, setExpanded } = useWorkdayAccordionState(date);

  const totalHours = sum(workday.entries.map((wd) => wd.duration));
  const totalHoursFormatted = dayjs.duration(totalHours, "hour").format("H:mm");

  const empty = workday.entries.length === 0;

  const toggleAccordion = (_: SyntheticEvent, expd: boolean) => {
    if (empty) {
      return;
    }
    setExpanded(expd);
  };

  return (
    <Accordion disableGutters expanded={empty ? false : expanded} onChange={toggleAccordion}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ textTransform: "capitalize" }}>{date.format("dd L")}</Typography>
          {empty && (
            <Chip
              label={t("entryTable.noEntries")}
              variant="outlined"
              style={{ color: "inherit", fontStyle: "italic" }}
            />
          )}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EntryDialogButton date={date} size="medium" />
            <Chip label={`${totalHoursFormatted} h`} sx={{ mr: 2, color: "inherit" }} />
          </Box>
        </Box>
      </AccordionSummary>
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
