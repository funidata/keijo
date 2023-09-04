import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary, Box, Chip } from "@mui/material";
import dayjs from "dayjs";
import { sum } from "lodash";
import { Workday } from "../../graphql/generated/graphql";

type WorkdayAccordionProps = {
  workday: Workday;
};

//FIXME: Make dayjs respect language selection over browser locale.
const WorkdayAccordion = ({ workday }: WorkdayAccordionProps) => {
  const totalHours = sum(workday.entries.map((wd) => wd.duration));

  return (
    <Accordion>
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
    </Accordion>
  );
};

export default WorkdayAccordion;
