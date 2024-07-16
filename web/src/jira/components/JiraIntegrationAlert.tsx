import { Alert, Button } from "@mui/material";
import { t } from "i18next";
import { connectToJira } from "../jiraUtils";

export const JiraIntegrationAlert = () => {
  return (
    <Alert
      severity="info"
      action={
        <>
          <Button onClick={connectToJira} sx={{ mr: 2 }} variant="outlined" size="small">
            Connect
          </Button>
          <Button variant="outlined" color="inherit" size="small">
            Hide
          </Button>
        </>
      }
    >
      {t("jira.connectNotification")}
    </Alert>
  );
};
