import { Alert, AlertTitle, Box, Button, useMediaQuery, useTheme } from "@mui/material";
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
        <AlertTitle>{t("jira.connectNotificationTitle")}</AlertTitle>
        <Box sx={{ mt: 1 }}>{t("jira.connectNotification1")}</Box>
        <Box sx={{ mt: 1 }}>{t("jira.connectNotification2")}</Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "end" }}>
          <Button
            onClick={() => setInfoDialogOpen(true)}
            variant="contained"
            size="medium"
            color="info"
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
