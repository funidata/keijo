import { AlertColor } from "@mui/material";
import { create } from "zustand";

type NotificationState = {
  type: AlertColor | undefined;
  message: string | null;
  autoHide: boolean;
};

type NotificationActions = {
  showNotification: (notification: NotificationState) => void;
};

export const useNotification = create<NotificationState & NotificationActions>()((set) => ({
  type: undefined,
  message: null,
  autoHide: false,
  showNotification: (notification: NotificationState) => set(() => notification),
}));
