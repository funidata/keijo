import Box from "@mui/material/Box";
import useEntryTemplateAccordionState from "./useEntryTemplateAccordionState";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GetMySettingsDocument } from "../../graphql/generated/graphql";
import CreateTemplateButton from "./AddTemplateButton";
import EntryTemplateRow from "./EntryTemplateRow";
import { useQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import Accordion from "@mui/material/Accordion";
import { AccordionDetails, AccordionSummary } from "@mui/material";

const TemplateAccordion = () => {
  const { data: settingsData } = useQuery(GetMySettingsDocument);
  const { t } = useTranslation();

  const templates = useMemo(() => {
    return settingsData?.getMySettings.entryTemplates ?? null;
  }, [settingsData]);

  const hasTemplates = useMemo(() => {
    return templates !== null && templates.length > 0;
  }, [templates]);

  const { expanded, setExpanded } = useEntryTemplateAccordionState();

  return (
    <Box sx={{ marginBottom: 6 }}>
      <Accordion expanded={expanded} onChange={(_, isExpanded) => setExpanded(isExpanded)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="template-accordion-content"
          id="template-accordion-header"
        >
          <Typography component="span" variant="h6" sx={{ fontWeight: "medium" }}>
            {t("titles.templates")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Grid container spacing={1}>
              {hasTemplates &&
                settingsData?.getMySettings.entryTemplates?.map((template) => (
                  <Grid key={template.key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <EntryTemplateRow entry={template} />
                  </Grid>
                ))}
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CreateTemplateButton />
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default TemplateAccordion;
