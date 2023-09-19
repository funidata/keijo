/**
 * This component renders a single, global notification in accordance with Material Design rules.
 * To trigger the notification, use the custom hook `useNotification`.
 */
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNotificationState } from "./useNotification";

const GlobalNotification = () => {
  const [open, setOpen] = useState(false);
  const { autoHide, message, type } = useNotificationState();

  const severity = type || "info";
  const autoHideDuration = autoHide ? 5000 : null;

  const close = () => setOpen(false);
  const reset = () => {
    // FIXME: Re-implement resetNotification()
  };

  useEffect(() => {
    if (type) {
      setOpen(true);
    }
  }, [type]);

  return (
    <Snackbar
      open={open}
      onClose={close}
      TransitionProps={{ onExited: reset }}
      autoHideDuration={autoHideDuration}
    >
      <Alert severity={severity} variant="filled" onClose={close}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalNotification;
