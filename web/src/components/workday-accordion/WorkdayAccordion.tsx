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
import dayjs from "../../common/dayjs";
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
          <Typography sx={{ textTransform: "capitalize" }}>
            {dayjs(workday.date).format("dd D.M.YYYY")}
          </Typography>
          <Chip label={`${totalHours} h`} sx={{ mr: 2 }} />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <EntryTable workday={workday} />
      </AccordionDetails>
    </Accordion>
  );
};

export default WorkdayAccordion;
