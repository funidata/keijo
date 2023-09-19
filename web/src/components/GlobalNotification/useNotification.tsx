import { AlertColor } from "@mui/material";
import { create } from "zustand";

type NotificationState = {
  type: AlertColor | undefined;
  message: string | null;
  autoHide: boolean;
};

type NotificationActions = {
  setNotification: (notification: NotificationState) => void;
};

export const useNotificationState = create<NotificationState & NotificationActions>()((set) => ({
  type: undefined,
  message: null,
  autoHide: false,
  setNotification: (notification: NotificationState) => set(() => notification),
}));

type NotificationOptions = Partial<Pick<NotificationState, "autoHide">>;

/**
 * Convenience hook for showing global notifications without directly interacting with state.
 *
 * This hook subscribes only to the `setNotification` property of the state thus
 * avoiding unnecessary re-renders. For direct access to the notification state, use
 * `useNotificationState` hook.
 */
export const useNotification = () => {
  const setNotification = useNotificationState((state) => state.setNotification);

  return {
    /**
     * Show success notification. Hides automatically.
     * @param message Notification content.
     * @param options Options override.
     */
    showSuccessNotification: (message: string, options: NotificationOptions = {}): void => {
      setNotification({ message, type: "success", autoHide: true, ...options });
    },
    /**
     * Show info notification. Hides automatically.
     * @param message Notification content.
     * @param options Options override.
     */
    showInfoNotification: (message: string, options: NotificationOptions = {}): void => {
      setNotification({ message, type: "info", autoHide: true, ...options });
    },
    /**
     * Show persistent warning notification.
     * @param message Notification content.
     * @param options Options override.
     */
    showWarningNotification: (message: string, options: NotificationOptions = {}): void => {
      setNotification({ message, type: "warning", autoHide: false, ...options });
    },
    /**
     * Show persistent error notification.
     * @param message Notification content.
     * @param options Options override.
     */
    showErrorNotification: (message: string, options: NotificationOptions = {}): void => {
      setNotification({ message, type: "error", autoHide: false, ...options });
    },
  };
};
