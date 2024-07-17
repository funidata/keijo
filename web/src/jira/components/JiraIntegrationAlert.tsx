import { Alert, Button } from "@mui/material";
import { t } from "i18next";

type JiraIntegrationAlertProps = {
  onConnect: () => void;
  onHide: () => void;
};

export const JiraIntegrationAlert = ({ onConnect, onHide }: JiraIntegrationAlertProps) => {
  return (
    <Alert
      severity="info"
      action={
        <>
          <Button onClick={onConnect} sx={{ mr: 2 }} variant="outlined" size="small">
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
  );
};
