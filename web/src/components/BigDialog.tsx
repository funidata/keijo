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
import { useNavigate } from "react-router-dom";
import LabelledIconButton from "./LabelledIconButton";

type BigDialogProps = Omit<DialogProps, "open">;

/**
 * Generic dialog that becomes fullscreen on smaller viewports.
 *
 * This component sets the dialog to be always open to accommodate controlling
 * its visibility with routing.
 *
 * Pass content as `children`.
 */
const BigDialog = ({ title, children, ...props }: BigDialogProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const onClose = useCallback(() => {
    navigate("..");
  }, [navigate]);

  return (
    <Dialog maxWidth="lg" fullWidth fullScreen={fullScreen} onClose={onClose} {...props} open>
      <DialogTitle>{title}</DialogTitle>
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
      <DialogContent sx={{ maxWidth: "100vw" }}>{children}</DialogContent>
    </Dialog>
  );
};

export default BigDialog;
