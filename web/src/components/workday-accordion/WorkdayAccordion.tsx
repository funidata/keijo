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
import useDayjs from "../../common/useDayjs";
import { Workday } from "../../graphql/generated/graphql";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import EntryFlexRow from "./EntryFlexRow";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdayAccordion = ({ workday }: WorkdayAccordionProps) => {
  const dayjs = useDayjs();
  const date = dayjs(workday.date);
  const totalHours = sum(workday.entries.map((wd) => wd.duration));
  const totalHoursFormatted = dayjs.duration(totalHours, "hour").format("H:mm");

  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
            color: "primary.light",
          }}
        >
          <Typography sx={{ textTransform: "capitalize" }}>{date.format("dd L")}</Typography>
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
