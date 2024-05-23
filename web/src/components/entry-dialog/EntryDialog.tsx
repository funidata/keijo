import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import LabelledIconButton from "../LabelledIconButton";

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
      <LabelledIconButton
        label={t("controls.close")}
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
        tooltipProps={{ placement: "left" }}
      >
        <CloseIcon fontSize="inherit" />
      </LabelledIconButton>
      <DialogContent sx={{ maxWidth: "100vw" }}>
        <Outlet />
      </DialogContent>
    </Dialog>
  );
};

export default EntryDialog;
