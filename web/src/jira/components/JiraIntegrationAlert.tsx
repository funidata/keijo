import { Alert, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import { JiraInfoDialog } from "./JiraInfoDialog";

type JiraIntegrationAlertProps = {
  onHide: () => void;
};

export const JiraIntegrationAlert = ({ onHide }: JiraIntegrationAlertProps) => {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Alert severity="info" onClose={onHide}>
        {t("jira.connectNotification")}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "end" }}>
          <Button
            onClick={() => setInfoDialogOpen(true)}
            variant="outlined"
            size="medium"
            fullWidth={mobile}
          >
            {t("controls.jiraConnect")}
          </Button>
        </Box>
      </Alert>
      <JiraInfoDialog
        open={infoDialogOpen}
        handleClose={() => {
          setInfoDialogOpen(false);
        }}
      />
    </>
  );
};
