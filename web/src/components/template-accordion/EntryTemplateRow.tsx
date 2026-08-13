import {
  Typography,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  Box,
  Stack,
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
      <Accordion sx={{ backgroundColor: "background.paper" }} disableGutters>
        <Box sx={{ position: "relative" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ flexDirection: "row-reverse" }}>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                paddingY: 1,
              }}
            >
              <Typography component="span" sx={{ fontWeight: "medium", paddingLeft: 2, width: "calc(100% - 58px + 15px)" }}>
                {entry.templateName}
              </Typography>
            </Stack>
          </AccordionSummary>
          <Stack
            direction="row"
            sx={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "4px" }}
          >
            <CopyEntryButton entry={entry} />
          </Stack>
        </Box>
        <AccordionDetails>
          <Stack direction="column">
            <Typography>
              <Typography component="span" sx={{ fontWeight: "medium"}}>Kesto:</Typography> {totalHoursFormatted}h
            </Typography>
            {entry.product && (
              <Typography>
                <Typography component="span" sx={{ fontWeight: "medium"}}>Tuote:</Typography> {entry.product}
              </Typography>
            )}
            {entry.activity && (
              <Typography>
                <Typography component="span" sx={{ fontWeight: "medium"}}>Toiminto:</Typography> {entry.activity}
              </Typography>
            )}
            {entry.client && (
              <Typography>
                <Typography component="span" sx={{ fontWeight: "medium"}}>Asiakas:</Typography> {entry.client}
              </Typography>
            )}
            {entry.issue && (
              <Typography>
                <Typography component="span" sx={{ fontWeight: "medium"}}>Tiketti:</Typography> {entry.issue}
              </Typography>
            )}
            {entry.description && (
              <Typography>
                <Typography component="span" sx={{ fontWeight: "medium"}}>Kommentti:</Typography> {entry.description}
              </Typography>
            )}
          </Stack>
        </AccordionDetails>
        <AccordionActions>
          <DeleteTemplateButton templateKey={entry.key} />
        </AccordionActions>
      </Accordion>
    </Box>
  );
};

export default EntryTemplateRow;
