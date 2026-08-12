import {
  Typography,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  Box,
  Stack,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CopyEntryButton from "../workday-accordion/entry-row/CopyEntryButton";
import { EntryTemplateType } from "../../graphql/generated/graphql";
import DeleteTemplateButton from "./DeleteTemplateButton";
import { roundToFullMinutes } from "../../common/duration";
import useDayjs from "../../common/useDayjs";

type EntryTemplateRowProps = {
  entry: EntryTemplateType;
};

const EntryTemplateRow = ({ entry }: EntryTemplateRowProps) => {
  const dayjs = useDayjs();
  const totalHoursFormatted = roundToFullMinutes(dayjs.duration(entry.duration, "hour")).format(
    "H:mm",
  );

  return (
    <Box>
      <Accordion sx={{ backgroundColor: "background.paper" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}
          >
            <Typography component="span" sx={{ fontWeight: "medium" }}>
              {entry.templateName}
            </Typography>
            <CopyEntryButton entry={entry} />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="column">
            <Typography>
              <b>Kesto:</b> {totalHoursFormatted}h
            </Typography>
            {entry.product && (
              <Typography>
                <b>Tuote:</b> {entry.product}
              </Typography>
            )}
            {entry.activity && (
              <Typography>
                <b>Toiminto:</b> {entry.activity}
              </Typography>
            )}
            {entry.client && (
              <Typography>
                <b>Asiakas:</b> {entry.client}
              </Typography>
            )}
            {entry.issue && (
              <Typography>
                <b>Tiketti:</b> {entry.issue}
              </Typography>
            )}
            {entry.description && (
              <Typography>
                <b>Kommentti:</b> {entry.description}
              </Typography>
            )}
          </Stack>
        </AccordionDetails>
        <AccordionActions>
          <Button>Muokkaa</Button>
          <DeleteTemplateButton templateKey={entry.key} />
        </AccordionActions>
      </Accordion>
    </Box>
  );
};

export default EntryTemplateRow;
