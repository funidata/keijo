import { Box, List, Paper, Typography } from "@mui/material";
import { GetMySettingsDocument } from "../../graphql/generated/graphql";
import CreateTemplateButton from "./AddTemplateButton";
import EntryTemplateRow from "./EntryTemplateRow";
import { useQuery } from "@apollo/client";

const TemplateAccordion = () => {
  const { data: settingsData } = useQuery(GetMySettingsDocument);

  return (
    <Paper sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5em 1em 0em 1em",
        }}
      >
        <Box>
          <Typography sx={{ textTransform: "capitalize", minWidth: 105 }}>
            {"My Templates"}
          </Typography>
        </Box>

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
          {settingsData?.getMySettings.entryTemplates?.map((template) => (
            <EntryTemplateRow entry={template} listItemProps={{ sx: { mt: 1 } }} />
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default TemplateAccordion;
