/**
 * This component renders a single, global notification in accordance with Material Design rules.
 * To trigger the notification, use the custom hook `useNotification`.
 */
import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNotificationState } from "./useNotification";

const GlobalNotification = () => {
  const [open, setOpen] = useState(false);
  const { autoHide, message, type, resetNotification } = useNotificationState();
  const autoHideDuration = autoHide ? 5000 : null;
  const close = () => setOpen(false);

  useEffect(() => {
    if (type) {
      setOpen(true);
    }
  }, [type]);

  return (
    <Snackbar
      open={open}
      onClose={close}
      TransitionProps={{ onExited: resetNotification }}
      autoHideDuration={autoHideDuration}
    >
      <Alert severity={type} variant="filled" onClose={close}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalNotification;
