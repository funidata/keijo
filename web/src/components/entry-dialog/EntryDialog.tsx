import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";

type EntryDialogProps = Omit<DialogProps, "open">;

const EntryDialog = ({ title, ...props }: EntryDialogProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const onClose = useCallback(() => {
    navigate(".");
  }, [navigate]);

  return (
    <Dialog maxWidth="lg" fullWidth {...props} fullScreen={fullScreen} onClose={onClose} open>
      <DialogTitle>{t(title || "entryDialog.title")}</DialogTitle>
      <Tooltip title={t("controls.close")}>
        <IconButton
          aria-label={t("controls.close")}
          onClick={onClose}
          size="large"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <DialogContent sx={{ maxWidth: "100vw" }}>
        <Outlet />
      </DialogContent>
    </Dialog>
  );
};

export default EntryDialog;
