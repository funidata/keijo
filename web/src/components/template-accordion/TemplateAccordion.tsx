import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { GetMySettingsDocument } from "../../graphql/generated/graphql";
import CreateTemplateButton from "./AddTemplateButton";
import EntryTemplateRow from "./EntryTemplateRow";
import { useQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const TemplateAccordion = () => {
  const { data: settingsData } = useQuery(GetMySettingsDocument);
  const { t } = useTranslation();

  const templates = useMemo(() => {
    return settingsData?.getMySettings.entryTemplates ?? null;
  }, [settingsData]);

  const hasTemplates = useMemo(() => {
    return templates !== null && templates.length > 0;
  }, [templates]);

  return (
    <Box>
      <Typography component="h2" variant="h6" sx={visuallyHidden}>
        {t("titles.templates")}
      </Typography>

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
    </Box>
  );
};

export default TemplateAccordion;
