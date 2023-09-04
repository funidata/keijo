import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip } from "@mui/material";
import dayjs from "dayjs";
import { sum } from "lodash";
import { Workday } from "../../graphql/generated/graphql";
import EntryTable from "./EntryTable";

type WorkdayAccordionProps = {
  workday: Workday;
};

//FIXME: Make dayjs respect language selection over browser locale.
const WorkdayAccordion = ({ workday }: WorkdayAccordionProps) => {
  const totalHours = sum(workday.entries.map((wd) => wd.duration));

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
          {dayjs(workday.date).format("dd D.M.YYYY")}
          <Chip label={totalHours} sx={{ mr: 2 }} />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <EntryTable entries={workday.entries} />
      </AccordionDetails>
    </Accordion>
  );
};

export default WorkdayAccordion;
