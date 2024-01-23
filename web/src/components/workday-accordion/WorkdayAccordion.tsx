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
import EntryFlexRow from "./EntryFlexRow";
import EntryTable from "./EntryTable";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdayAccordion = ({ workday }: WorkdayAccordionProps) => {
  const dayjs = useDayjs();
  const totalHours = sum(workday.entries.map((wd) => wd.duration));

  const toggle = true;

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ textTransform: "capitalize" }}>
            {dayjs(workday.date).format("dd L")}
          </Typography>
          <Chip label={`${totalHours} h`} sx={{ mr: 2 }} />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {toggle ? (
          workday.entries.map((entry) => <EntryFlexRow entry={entry} date={workday.date} />)
        ) : (
          <EntryTable workday={workday} />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default WorkdayAccordion;
