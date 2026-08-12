import { Box, Stack, Grid, Typography } from "@mui/material";
import { GetMySettingsDocument } from "../../graphql/generated/graphql";
import CreateTemplateButton from "./AddTemplateButton";
import EntryTemplateRow from "./EntryTemplateRow";
import { useQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";

const TemplateAccordion = () => {
  const { data: settingsData } = useQuery(GetMySettingsDocument);
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography component="h2" variant="h6">{t("titles.templates")}</Typography>
        <CreateTemplateButton size="medium" />
      </Box>
      <Box>
        <Grid container spacing={1}>
          {settingsData?.getMySettings.entryTemplates?.length ? (
            settingsData?.getMySettings.entryTemplates?.map((template) => (
              <Grid key={template.key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <EntryTemplateRow key={template.key} entry={template} />
              </Grid>
            ))
          ) : (
            <Stack sx={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
              <Typography color="textDisabled" variant="body2">
                {t("titles.noTemplates")}
              </Typography>
            </Stack>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default TemplateAccordion;
