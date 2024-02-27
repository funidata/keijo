import { useMutation } from "@apollo/client";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FindWorkdaysDocument, RemoveWorkdayEntryDocument } from "../../graphql/generated/graphql";
import { useNotification } from "../global-notification/useNotification";

type DeleteEntryButtonProps = {
  entryKey: string;
  date: Dayjs;
};

const BigDeleteEntryButton = ({ entryKey, date }: DeleteEntryButtonProps) => {
  const { showSuccessNotification } = useNotification();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [removeWorkdayEntry] = useMutation(RemoveWorkdayEntryDocument, {
    refetchQueries: [FindWorkdaysDocument],
    onCompleted: () => {
      showSuccessNotification(t("notifications.deleteEntry.success"));
    },
  });

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onConfirm = async () => {
    removeWorkdayEntry({
      variables: { entry: { key: entryKey, date: date.format("YYYY-MM-DD") } },
    });
    onClose();
  };

  return (
    <>
      <Button variant="contained" size="large" color="error" fullWidth onClick={onOpen}>
        {t("entryDialog.delete")}
      </Button>
      <Dialog open={open} onClose={onClose} fullWidth aria-labelledby="confirmation-dialog-title">
        <DialogTitle id="confirmation-dialog-title">
          {t("controls.confirmDeleteForDialog")}
        </DialogTitle>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            {t("controls.cancel")}
          </Button>
          <Button onClick={onConfirm} autoFocus>
            {t("controls.deleteEntry")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BigDeleteEntryButton;
