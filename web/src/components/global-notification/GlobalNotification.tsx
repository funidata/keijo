/**
 * This component renders a single, global notification in accordance with Material Design rules.
 * To trigger the notification, use the custom hook `useNotification`.
 */
import { Alert, Snackbar } from "@mui/material";
import { useNotificationState } from "./useNotification";

const GlobalNotification = () => {
  const { autoHide, message, type, resetNotification, action } = useNotificationState();
  const autoHideDuration = autoHide ? 5000 : null;
  const close = resetNotification;

  return (
    <Snackbar
      open={Boolean(type)}
      onClose={close}
      slotProps={{ transition: { onExited: resetNotification } }}
      autoHideDuration={autoHideDuration}
    >
      <Alert severity={type} variant="filled" onClose={close} sx={{ color: "white" }}>
        {message} {action}
      </Alert>
    </Snackbar>
  );
};

export default GlobalNotification;
