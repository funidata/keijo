import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { t } from "i18next";
import { connectToJira } from "../jiraUtils";

type JiraInfoDialogProps = {
  open: boolean;
  handleClose: () => void;
};

export const JiraInfoDialog = ({ open, handleClose }: JiraInfoDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogTitle>{t("jira.infoDialog.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("jira.infoDialog.content")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("controls.cancel")}</Button>
        <Button onClick={connectToJira} autoFocus>
          {t("controls.jiraConnect")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
