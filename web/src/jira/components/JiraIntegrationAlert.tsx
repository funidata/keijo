import { Alert, Button } from "@mui/material";
import { t } from "i18next";
import { JiraInfoDialog } from "./JiraInfoDialog";
import { useState } from "react";

type JiraIntegrationAlertProps = {
  onHide: () => void;
};

export const JiraIntegrationAlert = ({ onHide }: JiraIntegrationAlertProps) => {
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  return (
    <>
      <Alert
        severity="info"
        action={
          <>
            <Button
              onClick={() => setInfoDialogOpen(true)}
              sx={{ mr: 2 }}
              variant="outlined"
              size="small"
            >
              {t("controls.jiraConnect")}
            </Button>
            <Button onClick={onHide} variant="outlined" color="inherit" size="small">
              {t("controls.hide")}
            </Button>
          </>
        }
      >
        {t("jira.connectNotification")}
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
