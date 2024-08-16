import { Box, List, ListItem, Paper, Typography } from "@mui/material";
import { GetMySettingsDocument } from "../../graphql/generated/graphql";
import CreateTemplateButton from "./AddTemplateButton";
import EntryTemplateRow from "./EntryTemplateRow";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

const TemplateAccordion = () => {
  const { data: settingsData } = useQuery(GetMySettingsDocument);
  const { t } = useTranslation();

  return (
    <Paper sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1em 1em 0em 1em",
        }}
      >
        <Typography>{t("titles.templates")}</Typography>

        <CreateTemplateButton size="medium" />
      </Box>
      <Box sx={{ display: "block", padding: "8px 16px 16px;" }}>
        <List
          sx={{
            maxHeight: "20vh",
            width: "100%",
            overflow: "auto",
          }}
        >
          {settingsData?.getMySettings.entryTemplates?.length ? (
            settingsData?.getMySettings.entryTemplates?.map((template) => (
              <EntryTemplateRow entry={template} listItemProps={{ sx: { mt: 1 } }} />
            ))
          ) : (
            <ListItem sx={{ display: "flex", justifyContent: "center" }}>
              <Typography color={(theme) => theme.palette.text.disabled}>
                {t("titles.noTemplates")}
              </Typography>
            </ListItem>
          )}
        </List>
      </Box>
    </Paper>
  );
};

export default TemplateAccordion;
